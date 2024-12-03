import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@supabase/supabase-js";
import './MapScreen.css';

// Initialize Supabase client
const supabaseUrl = "https://iussqunpdvvbffbcecsb.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1c3NxdW5wZHZ2YmZmYmNlY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4Nzc2NzMsImV4cCI6MjA0ODQ1MzY3M30.dYPVOnvXFVCVe_RARa2Cutt0Gsiug3w3w0oCdezIah0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Custom marker icon
const soldierIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Example marker icon URL
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const enemyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149076.png", // Example enemy marker icon URL
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

const MapScreen = () => {
  const [soldiers, setSoldiers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [newSoldierName, setNewSoldierName] = useState("");
  const [newEnemyName, setNewEnemyName] = useState("");

  // Fetch initial soldier and enemy data
  const fetchData = async () => {
    const { data: soldiersData, error: soldiersError } = await supabase
      .from("soldiers")
      .select("*");
    if (soldiersError) console.error("Error fetching soldiers:", soldiersError);
    else setSoldiers(soldiersData);

    const { data: enemiesData, error: enemiesError } = await supabase
      .from("enemies")
      .select("*");
    if (enemiesError) console.error("Error fetching enemies:", enemiesError);
    else setEnemies(enemiesData);
  };

  // Add a new soldier
  const addSoldier = async () => {
    const { data, error } = await supabase
      .from("soldiers")
      .insert([
        { name: newSoldierName, latitude: 48.7363, longitude: 19.1461 }, // Sample coordinates
      ])
      .single();
    if (error) console.error("Error adding soldier:", error);
    else {
      setSoldiers((prev) => [...prev, data]);
      setNewSoldierName(""); // Reset input field
    }
  };

  // Add a new enemy
  const addEnemy = async () => {
    const { data, error } = await supabase
      .from("enemies")
      .insert([
        { name: newEnemyName, latitude: 48.7363, longitude: 19.1461 }, // Sample coordinates
      ])
      .single();
    if (error) console.error("Error adding enemy:", error);
    else {
      setEnemies((prev) => [...prev, data]);
      setNewEnemyName(""); // Reset input field
    }
  };

  // Remove a soldier by id
  const removeSoldier = async (id) => {
    const { error } = await supabase.from("soldiers").delete().eq("id", id);
    if (error) console.error("Error removing soldier:", error);
    else {
      setSoldiers((prev) => prev.filter((soldier) => soldier.id !== id));
    }
  };

  // Remove an enemy by id
  const removeEnemy = async (id) => {
    const { error } = await supabase.from("enemies").delete().eq("id", id);
    if (error) console.error("Error removing enemy:", error);
    else {
      setEnemies((prev) => prev.filter((enemy) => enemy.id !== id));
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchData();
  
    // Subscribe to real-time updates for soldiers
    const soldierChannel = supabase
      .channel("soldiers")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "soldiers" }, (payload) => {
        setSoldiers((prev) => [...prev, payload.new]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "soldiers" }, (payload) => {
        setSoldiers((prev) =>
          prev.map((soldier) =>
            soldier.id === payload.new.id ? payload.new : soldier
          )
        );
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "soldiers" }, (payload) => {
        setSoldiers((prev) =>
          prev.filter((soldier) => soldier.id !== payload.old.id)
        );
      })
      .subscribe();
  
    // Subscribe to real-time updates for enemies
    const enemyChannel = supabase
      .channel("enemies")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "enemies" }, (payload) => {
        setEnemies((prev) => [...prev, payload.new]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "enemies" }, (payload) => {
        setEnemies((prev) =>
          prev.map((enemy) => (enemy.id === payload.new.id ? payload.new : enemy))
        );
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "enemies" }, (payload) => {
        setEnemies((prev) =>
          prev.filter((enemy) => enemy.id !== payload.old.id)
        );
      })
      .subscribe();
  
    // Cleanup subscriptions on unmount
    return () => {
      soldierChannel.unsubscribe();
      enemyChannel.unsubscribe();
    };
  }, []);

  return (
    <div className="map-screen">
      {/* Map */}
      <MapContainer
        center={[13.0538, 77.5674]} // Centered at Bengaluru
        zoom={10}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Soldier Markers */}
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

        {/* Enemy Markers */}
        {enemies.map((enemy) => (
          <Marker
            key={enemy.id}
            position={[enemy.latitude, enemy.longitude]}
            icon={enemyIcon}
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

      {/* Soldier List */}
      <div className="soldier-list">
        <h2>Soldiers</h2>
        <ul>
          {soldiers.map((soldier) => (
            <li key={soldier.id}>
              <span>{soldier.name}</span>
              <button onClick={() => removeSoldier(soldier.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Enemy List */}
      <div className="enemy-list">
        <h2>Enemies</h2>
        <ul>
          {enemies.map((enemy) => (
            <li key={enemy.id}>
              <span>{enemy.name}</span>
              <button onClick={() => removeEnemy(enemy.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Soldier */}
      <div className="add-soldier">
        <h3>Add Soldier</h3>
        <input
          type="text"
          value={newSoldierName}
          onChange={(e) => setNewSoldierName(e.target.value)}
          placeholder="Soldier Name"
        />
        <button onClick={addSoldier}>Add Soldier</button>
      </div>

      {/* Add Enemy */}
      <div className="add-enemy">
        <h3>Add Enemy</h3>
        <input
          type="text"
          value={newEnemyName}
          onChange={(e) => setNewEnemyName(e.target.value)}
          placeholder="Enemy Name"
        />
        <button onClick={addEnemy}>Add Enemy</button>
      </div>
    </div>
  );
};

export default MapScreen;
