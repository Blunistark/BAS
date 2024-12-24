import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './MapScreen.css';
import supabase from "./supabase";
import VoiceAssistant from './VoiceAssistant'; // Import the voice assistant component
import artilleryImage from './assets/Aaa.jpg';  
import medIcon from './assets/imgs/Med.jpg';
import ArtIcon from './assets/imgs/Arty.jpg';
import CavIcon from './assets/imgs/Cavh.jpg';
import InfIcon from './assets/imgs/Inf.jpg';
import SigIcon from './assets/imgs/Sig.jpg';
import TDIcon from './assets/imgs/Td.jpg';
import TranspIcon from './assets/imgs/Trans.jpg'
import Unit from './assets/imgs/Unit.png';
import HQ from './assets/imgs/HQ.png';
import Enemy_Unit from './assets/imgs/Enemy-Unit.png';

// Custom marker icons
const UnitIcon= new L.Icon({
  iconUrl: Unit,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const HQIcon = new L.Icon({
  iconUrl: HQ,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const Enemy_UnitIcon = new L.Icon({
  iconUrl: Enemy_Unit,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const CavalryIcon = new L.Icon({
  iconUrl: CavIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const TransportIcon = new L.Icon({
  iconUrl: TranspIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const medicalSignalIcon = new L.Icon({
  iconUrl: medIcon, // Replace with your actual image URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const tankDestroyerIcon = new L.Icon({
  iconUrl: TDIcon, // Replace with your actual image URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const infantryIcon = new L.Icon({
  iconUrl: InfIcon , // Replace with your actual image URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const antiAircraftIcon = new L.Icon({
  iconUrl: artilleryImage, // Replace with your actual image URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const artilleryIcon = new L.Icon({
  iconUrl: ArtIcon, // Use the imported artillery image
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});


const soldierIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const enemyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149076.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const signalIcon = new L.Icon({
  iconUrl: SigIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});



const MapScreen = () => {
  const [soldiers, setSoldiers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [soldierVitals, setSoldierVitals] = useState(null); // Store soldier vitals
  const [isAddingEnemy, setIsAddingEnemy] = useState(false);
  const [isRemovingEnemy, setIsRemovingEnemy] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef();
  const [enemyCount, setEnemyCount] = useState(0);

  const soldier1 = {
    name: "Soldier 1",
    latitude: 13.0538,
    longitude: 77.5674,
  };

  const markerIcons = {
    Artillery: artilleryIcon,
    MedicalSignals: medicalSignalIcon,
    TankDestroyer: tankDestroyerIcon,
    Infantry: infantryIcon,
    AntiAircraft: antiAircraftIcon,
    Signals : signalIcon,
    Transport: TransportIcon,
    Cavalry : CavalryIcon,
    HQ : HQIcon,
    Unit : UnitIcon,
    Enemy_Unit: Enemy_UnitIcon
  };


  // Display error messages
  const [error, setError] = useState(null);

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


  // Fetch initial soldier and enemy data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch soldiers data
      const { data: soldiersData, error: soldiersError } = await supabase
        .from("soldiers")
        .select("*");
      if (soldiersError) throw soldiersError;
      setSoldiers(soldiersData);

      // Fetch enemies data
      const { data: enemiesData, error: enemiesError } = await supabase
        .from("enemies")
        .select("*");
      if (enemiesError) throw enemiesError;
      setEnemies(enemiesData);

      // Fetch vitals for soldier 1
      const { data: vitalsData, error: vitalsError } = await supabase
        .from("soldier_vitals")
        .select("*")
        .eq("soldier_id", 1)
        .single(); // Fetch single record for soldier 1
      if (vitalsError) throw vitalsError;
      setSoldierVitals(vitalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to determine pulse color based on heart rate
  const getPulseColor = (heartRate) => {
    if (heartRate >= 60 && heartRate <= 100) {
      return "green"; // Good BPM
    }
    return "red"; // Not good BPM
  };

  // Subscribe to real-time updates for soldier vitals (only for soldier 1)
  useEffect(() => {
    const vitalsChannel = supabase
      .channel("soldier_vitals")
      .on("postgres_changes", { event: "*", schema: "public", table: "soldier_vitals" }, (payload) => {
        if (payload.new.soldier_id === 1) {
          setSoldierVitals(payload.new); // Update only soldier 1's vitals
        }
      })
      .subscribe();

    return () => {
      vitalsChannel.unsubscribe();
    };
  }, []);

  // Add enemy at clicked location
  const handleMapClick = useCallback(async (e) => {
    if (isAddingEnemy) {
      const { lat, lng } = e.latlng;
      try {
        const newEnemyName = `Enemy ${enemyCount + 1}`;
        const { error } = await supabase
          .from("enemies")
          .insert([{ name: newEnemyName, latitude: lat, longitude: lng }]);
        if (error) {
          console.error("Error adding enemy:", error);
          return;
        }
        setEnemyCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error("Unexpected error adding enemy:", error);
      }
    }
  }, [isAddingEnemy, enemyCount]);

  // Toggle add enemy mode
  const toggleAddEnemy = useCallback(() => {
    setIsAddingEnemy((prev) => !prev);
    setIsRemovingEnemy(false);
  }, []);

  // Toggle remove enemy mode
  const toggleRemoveEnemy = useCallback(() => {
    setIsRemovingEnemy((prev) => !prev);
    setIsAddingEnemy(false);
  }, []);

  const zoomToMarker = useCallback((latitude, longitude) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([latitude, longitude], 16); // Adjust zoom level (14 is a good level for zooming into a marker)
    }
  }, []);

  // Remove enemy on marker click
  const handleEnemyMarkerClick = useCallback(async (id) => {
    if (isRemovingEnemy) {
      try {
        const { error } = await supabase.from("enemies").delete().eq("id", id);
        if (error) throw error;
        setEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.id !== id));
      } catch (error) {
        console.error("Error removing enemy:", error);
      }
    }
  }, [isRemovingEnemy]);

  // Function to zoom to a soldier's location
  const zoomToSoldier = useCallback((latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  }, []);

  // Custom hook to handle map events
  const MapEvents = () => {
    useMapEvent('click', handleMapClick);
    const map = useMapEvent('dragstart', () => {
      if (isAddingEnemy) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }
    });

    useEffect(() => {
      if (isAddingEnemy) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }
    }, [map]);

    return null;
  };

  // Function to show all markers on the map
  const showAllMarkers = useCallback(() => {
    if (mapRef.current) {
      const bounds = L.latLngBounds([]);
      soldiers.forEach((soldier) => {
        bounds.extend([soldier.latitude, soldier.longitude]);
      });
      enemies.forEach((enemy) => {
        bounds.extend([enemy.latitude, enemy.longitude]);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [soldiers, enemies]);

  useEffect(() => {
    fetchData();
    fetchMarkers();

    // Subscribe to real-time updates for soldiers
    const soldierChannel = supabase
      .channel("soldiers")
      .on("postgres_changes", { event: "*", schema: "public", table: "soldiers" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setSoldiers((prevSoldiers) => [...prevSoldiers, payload.new]);
        } else if (payload.eventType === "UPDATE") {
          setSoldiers((prevSoldiers) =>
            prevSoldiers.map((soldier) =>
              soldier.id === payload.new.id ? payload.new : soldier
            )
          );
        } else if (payload.eventType === "DELETE") {
          setSoldiers((prevSoldiers) =>
            prevSoldiers.filter((soldier) => soldier.id !== payload.old.id)
          );
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
            prevEnemies.map((enemy) =>
              enemy.id === payload.new.id ? payload.new : enemy
            )
          );
        } else if (payload.eventType === "DELETE") {
          setEnemies((prevEnemies) =>
            prevEnemies.filter((enemy) => enemy.id !== payload.old.id)
          );
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
          prevMarkers.map((marker) =>
            marker.id === payload.new.id ? payload.new : marker
          )
        );
      } else if (payload.eventType === "DELETE") {
        setMarkers((prevMarkers) =>
          prevMarkers.filter((marker) => marker.id !== payload.old.id)
        );
      }
    })
    .subscribe();

    return () => {
      soldierChannel.unsubscribe();
      enemyChannel.unsubscribe();
      markerChannel.unsubscribe();
    };
  }, [fetchData , fetchMarkers]);

  return (
    <div className="map-screen">
      {error && <div className="error-message">{error}</div>}

      <div className="Overlay">

        <div className="Voice-assistant">
         <VoiceAssistant /> {/* Add VoiceAssistant */}
        </div>
      
        <div className="soldier-list">
          <p>Soldiers</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {soldiers.map((soldier) => (
                <li key={soldier.id} onClick={() => zoomToSoldier(soldier.latitude, soldier.longitude)}>
                  <span>{soldier.name}</span>
                  {/* Show vitals for soldier 1 */}
                  {soldier.id === 1 && soldierVitals && (
                    <div>
                      <strong>Heart Rate:</strong> {soldierVitals.heart_rate} bpm
                      <br />
                      <strong>Temperature:</strong> {soldierVitals.temperature} °C
                      <div
                        className="pulse-line"
                        style={{
                          backgroundColor: getPulseColor(soldierVitals.heart_rate),
                          height: "5px",
                          width: "50px",
                          marginTop: "5px",
                        }}
                      />
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
          <button className="key" onClick={toggleAddEnemy}>
            {isAddingEnemy ? "Cancel Adding Enemy" : "Add Enemy"}
          </button>
          <button className="key" onClick={toggleRemoveEnemy}>
            {isRemovingEnemy ? "Cancel Removing Enemy" : "Remove Enemy"}
          </button>
          <button className="key" onClick={showAllMarkers}>Show All</button>
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
          <MapEvents />
          {soldiers.map((soldier) => (
            <Marker
              key={soldier.id}
              position={[soldier.latitude, soldier.longitude]}
              icon={soldierIcon}
            >
              <Popup>
                <strong>{soldier.name}</strong>
                <br />
                Latitude: {soldier.latitude}
                <br />
                Longitude: {soldier.longitude}
                {/* Show vitals for soldier 1 */}
                {soldier.id === 1 && soldierVitals && (
                  <div>
                    <strong>Heart Rate:</strong> {soldierVitals.heart_rate} bpm
                    <br />
                    <strong>Temperature:</strong> {soldierVitals.temperature} °C
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
          {enemies.map((enemy) => (
            <Marker
              key={enemy.id}
              position={[enemy.latitude, enemy.longitude]}
              icon={enemyIcon}
              eventHandlers={{
                click: () => handleEnemyMarkerClick(enemy.id),
              }}
            >
              <Popup>
                <strong>{enemy.name}</strong>
                <br />
                Latitude: {enemy.latitude}
                <br />
                Longitude: {enemy.longitude}
              </Popup>
            </Marker>
          ))}
           {/* Render user-defined markers */}
           {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.latitude, marker.longitude]}
          icon={markerIcons[marker.type] || artilleryIcon} // Use the correct icon based on marker type
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

export default MapScreen;
