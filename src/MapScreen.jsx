import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@supabase/supabase-js";
import './MapScreen.css';
import Navbar from "./Navbar";

// Initialize Supabase client using environment variables
const supabaseUrl = "https://iussqunpdvvbffbcecsb.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1c3NxdW5wZHZ2YmZmYmNlY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4Nzc2NzMsImV4cCI6MjA0ODQ1MzY3M30.dYPVOnvXFVCVe_RARa2Cutt0Gsiug3w3w0oCdezIah0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Custom marker icons
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

const MapScreen = () => {
  const [soldiers, setSoldiers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [isAddingEnemy, setIsAddingEnemy] = useState(false);
  const [isRemovingEnemy, setIsRemovingEnemy] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef();
  const [enemyCount, setEnemyCount] = useState(0);

  // Display error messages
  const [error, setError] = useState(null);

  // Fetch initial soldier and enemy data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: soldiersData, error: soldiersError } = await supabase
        .from("soldiers")
        .select("*");
      if (soldiersError) throw soldiersError;
      setSoldiers(soldiersData);

      const { data: enemiesData, error: enemiesError } = await supabase
        .from("enemies")
        .select("*");
      if (enemiesError) throw enemiesError;
      setEnemies(enemiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
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

    return () => {
      soldierChannel.unsubscribe();
      enemyChannel.unsubscribe();
    };
  }, [fetchData]);

  return (
    <div className="map-screen">
      {error && <div className="error-message">{error}</div>}


      <div className="Overlay">
        <div className="soldier-list">
          <p>Soldiers</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {soldiers.map((soldier) => (
                <li key={soldier.id} onClick={() => zoomToSoldier(soldier.latitude, soldier.longitude)}>
                  <span>{soldier.name}</span>
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
                    <span>{enemy.name}</span>
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


      <div className="navbar-Overlay">
        <div className="buttons">
          <Navbar className="Navbar"/> 
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
          zoomControl={false}
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
        </MapContainer>
      )}
    </div>
  );
};

export default MapScreen;