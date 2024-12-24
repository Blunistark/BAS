import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './BaseScreen.css';
import supabase from "./supabase";
import artilleryImage from './assets/Aaa.jpg';  
import medIcon from './assets/imgs/Med.jpg';
import ArtIcon from './assets/imgs/Arty.jpg';
import CavIcon from './assets/imgs/Cavh.jpg';
import InfIcon from './assets/imgs/Inf.jpg';
import SigIcon from './assets/imgs/Sig.jpg';
import TDIcon from './assets/imgs/Td.jpg';
import TranspIcon from './assets/imgs/Trans.jpg';
import Unit from './assets/imgs/Unit.png';
import HQ from './assets/imgs/HQ.png';
import Enemy_Unit from './assets/imgs/Enemy-Unit.png';


const markerIcons = {
  Artillery: new L.Icon({ iconUrl: ArtIcon, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  MedicalSignals: new L.Icon({ iconUrl: medIcon, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  TankDestroyer: new L.Icon({ iconUrl: TDIcon, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  Infantry: new L.Icon({ iconUrl: InfIcon, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  AntiAircraft: new L.Icon({ iconUrl: artilleryImage, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] }),
  Signals: new L.Icon({ iconUrl: SigIcon, iconSize: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  Transport: new L.Icon({ iconUrl: TranspIcon, iconSize: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  Cavalry: new L.Icon({ iconUrl: CavIcon, iconSize: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  HQ: new L.Icon({ iconUrl:HQ , iconSize: [25, 25], iconAnch: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  Enemy_Unit : new L.Icon({ iconUrl:Enemy_Unit , iconSize: [25, 25], iconAnch: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  Unit : new L.Icon({ iconUrl:Unit , iconSize: [25, 25], iconAnch: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  soldier: new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", iconSize: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] }),
  enemy: new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149076.png", iconSize: [25, 25], iconAnchor: [12, 25], popupAnchor: [0, -20] })
};

const MapEvents = ({ handleMapClick, isAddingMarker }) => {
  useMapEvent("click", handleMapClick);
  return null;
};

const BaseScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [soldiers, setSoldiers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedMarkerType, setSelectedMarkerType] = useState("Artillery");
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soldierVitals, setSoldierVitals] = useState(null);
  const [error, setError] = useState(null);

  const mapRef = useRef();

  // Fetch markers from Supabase
  const fetchMarkers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("markers").select("*");
      if (error) {
        console.error("Error fetching markers:", error);
        return;
      }
      setMarkers(data);
    } catch (error) {
      console.error("Unexpected error fetching markers:", error);
    }
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch soldiers
      const { data: soldiersData, error: soldiersError } = await supabase
        .from("soldiers")
        .select("*");
      if (soldiersError) throw soldiersError;
      setSoldiers(soldiersData);

      // Fetch enemies
      const { data: enemiesData, error: enemiesError } = await supabase
        .from("enemies")
        .select("*");
      if (enemiesError) throw enemiesError;
      setEnemies(enemiesData);

      // Fetch soldier vitals for soldier 1
      const { data: vitalsData, error: vitalsError } = await supabase
        .from("soldier_vitals")
        .select("*")
        .eq("soldier_id", 1)
        .single();
      if (vitalsError) throw vitalsError;
      setSoldierVitals(vitalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const zoomToMarker = useCallback((latitude, longitude) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([latitude, longitude], 18); // Adjust zoom level (14 is a good level for zooming into a marker)
    }
  }, []);
  

  // Handle map click to add marker
  const handleMapClick = useCallback(
    async (e) => {
      if (isAddingMarker) {
        const { lat, lng } = e.latlng;
        try {
          const newMarker = {
            type: selectedMarkerType,
            latitude: lat,
            longitude: lng,
          };
          // Insert new marker into database
          const { error } = await supabase
            .from("markers")
            .insert([newMarker]);
          if (error) {
            console.error("Error adding marker:", error);
            return;
          }
          // After adding marker, fetch updated list of markers
          fetchMarkers();
        } catch (error) {
          console.error("Unexpected error adding marker:", error);
        }
      }
    },
    [isAddingMarker, selectedMarkerType, fetchMarkers]
  );

  // Check if the toggle button is changing the state correctly
  const toggleAddMarker = useCallback(() => {
    setIsAddingMarker((prev) => !prev);
  }, []);

  // Delete marker function
  const deleteMarker = async (markerId) => {
    try {
      // Delete marker from the database
      const { error } = await supabase.from("markers").delete().eq("id", markerId);
      if (error) {
        console.error("Error deleting marker:", error);
        return;
      }
      // After deleting marker, fetch updated list of markers
      fetchMarkers();
    } catch (error) {
      console.error("Unexpected error deleting marker:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMarkers(); // Fetch markers initially

    // Subscribe to real-time updates for soldiers
    const soldierChannel = supabase
      .channel("soldiers")
      .on("postgres_changes", { event: "*", schema: "public", table: "soldiers" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setSoldiers((prevSoldiers) => [...prevSoldiers, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          setSoldiers((prevSoldiers) =>
            prevSoldiers.map((soldier) => (soldier.id === payload.new.id ? payload.new : soldier))
          );
        } else if (payload.eventType === "DELETE") {
          setSoldiers((prevSoldiers) => prevSoldiers.filter((soldier) => soldier.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to real-time updates for enemies
    const enemyChannel = supabase
      .channel("enemies")
      .on("postgres_changes", { event: "*", schema: "public", table: "enemies" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setEnemies((prevEnemies) => [...prevEnemies, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          setEnemies((prevEnemies) =>
            prevEnemies.map((enemy) => (enemy.id === payload.new.id ? payload.new : enemy))
          );
        } else if (payload.eventType === "DELETE") {
          setEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to real-time updates for markers
    const markerChannel = supabase
      .channel("markers")
      .on("postgres_changes", { event: "*", schema: "public", table: "markers" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMarkers((prevMarkers) => [...prevMarkers, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          setMarkers((prevMarkers) =>
            prevMarkers.map((marker) => (marker.id === payload.new.id ? payload.new : marker))
          );
        } else if (payload.eventType === "DELETE") {
          setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      soldierChannel.unsubscribe();
      enemyChannel.unsubscribe();
      markerChannel.unsubscribe();
    };
  }, [fetchData, fetchMarkers]);

  return (
    <div className="base-screen">
      {error && <div className="error-message">{error}</div>}

      <div className="Overlay">
      <div className="soldier-list">
        <p>Soldiers</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {soldiers.map((soldier) => (
              <li key={soldier.id}>
                <span onClick={() => zoomToMarker(soldier.latitude, soldier.longitude)}>
                  {soldier.name}
                </span>
                {soldier.id === 1 && soldierVitals && (
                  <div>
                    <strong>Heart Rate:</strong> {soldierVitals.heart_rate} bpm
                    <br />
                    <strong>Temperature:</strong> {soldierVitals.temperature} °C
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      <div className="Enemy-Overlay">
        
      <div className="soldier-list">
        <p>Enemies</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {enemies.map((enemy) => (
              <li key={enemy.id}>
                <span onClick={() => zoomToMarker(enemy.latitude, enemy.longitude)}>
                  {enemy.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>


      <div className="Buttons-Overlay">
        <div className="buttons">
          <button className="key" onClick={toggleAddMarker}>
            {isAddingMarker ? "Cancel Adding Marker" : "Add Marker"}
          </button>
          <button
            className="key"
            onClick={() => deleteMarker(markers[markers.length - 1]?.id)}
          >
            Remove Marker
          </button>
          <select
            value={selectedMarkerType}
            onChange={(e) => setSelectedMarkerType(e.target.value)}
          >
            <option value="Artillery">Artillery</option>
            <option value="MedicalSignals">Medical</option>
            <option value="Signals">Signals</option>
            <option value="TankDestroyer">Tank Destroyer</option>
            <option value="Infantry">Infantry</option>
            <option value="AntiAircraft">Anti-Aircraft</option>
            <option value="Cavalry">Cavalry</option>
            <option value="Transport">Transport</option>
            <option value="Enemy_Unit">Enemey-Unit</option>
            <option value="Unit">Unit</option>
            <option value="HQ">HQ</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading map...</div>
      ) : (
        <MapContainer
          center={[13.0538, 77.5674]} // Centered at Bengaluru
          zoom={10}
          className="map-container"
          ref={mapRef}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents handleMapClick={handleMapClick} isAddingMarker={isAddingMarker} />
          
          {/* Render markers for soldiers */}
          {soldiers.map((soldier) => (
            soldier.latitude && soldier.longitude && (
              <Marker
                key={`soldier-${soldier.id}`}
                position={[soldier.latitude, soldier.longitude]}
                icon={markerIcons.soldier}
              >
                <Popup>
                  <strong>{soldier.name}</strong>
                  <br />
                  Latitude: {soldier.latitude}
                  <br />
                  Longitude: {soldier.longitude}
                </Popup>
              </Marker>
            )
          ))}

          {/* Render markers for enemies */}
          {enemies.map((enemy) => (
            enemy.latitude && enemy.longitude && (
              <Marker
                key={`enemy-${enemy.id}`}
                position={[enemy.latitude, enemy.longitude]}
                icon={markerIcons.enemy}
              >
                <Popup>
                  <strong>{enemy.name}</strong>
                  <br />
                  Latitude: {enemy.latitude}
                  <br />
                  Longitude: {enemy.longitude}
                </Popup>
              </Marker>
            )
          ))}

          {/* Render user-defined markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={markerIcons[marker.type] || markerIcons.Artillery}
            >
              <Popup>
                <strong>{marker.type}</strong>
                <br />
                Latitude: {marker.latitude}
                <br />
                Longitude: {marker.longitude}
                <button onClick={() => deleteMarker(marker.id)}>Delete Marker</button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default BaseScreen
