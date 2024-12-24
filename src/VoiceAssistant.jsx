import React, { useState, useEffect } from 'react';
import supabase from './supabase'; // Assuming Supabase is set up

const VoiceAssistant = ({ onAddEnemy, onUpdateEnemy }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognizer = new recognition();
  speechRecognizer.lang = 'en-US';
  speechRecognizer.continuous = false;

  useEffect(() => {
    if (isListening) {
      speechRecognizer.start();
    } else {
      speechRecognizer.stop();
    }

    speechRecognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      handleCommand(transcript);
    };

    speechRecognizer.onerror = (error) => {
      console.error('Error recognizing speech:', error);
    };

    return () => {
      speechRecognizer.abort();
    };
  }, [isListening]);

  useEffect(() => {
    const channel = supabase
      .channel('enemies')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'enemies' }, (payload) => {
        console.log('Real-time: Enemy added:', payload);
        onAddEnemy(payload.new.latitude, payload.new.longitude);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'enemies' }, (payload) => {
        console.log('Real-time: Enemy updated:', payload);
        onUpdateEnemy(payload.new.latitude, payload.new.longitude);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onAddEnemy, onUpdateEnemy]);

  const handleCommand = async (transcript) => {
    const addRegex = /add enemy (\d+)\s*(metres|M)\s*(\d+)\s*degrees\s*named\s*(\w+)/;
    const match = transcript.match(addRegex);

    if (match) {
      const distance = parseInt(match[1]);
      const degrees = parseInt(match[3]);
      const name = match[4];  // Extract the name from the command
      console.log('Parsed Command:', { distance, degrees, name });

      await addEnemyFromSoldier(distance, degrees, name);
    }
  };

  // Convert distance and degrees to lat/lon
  const convertToLatLng = (lat, lon, distance, degrees) => {
    const radians = degrees * (Math.PI / 180); // Convert degrees to radians
    const R = 6371000; // Radius of the Earth in meters
    
    // Calculate the change in latitude (dLat) and longitude (dLon)
    const dLat = distance * Math.cos(radians) / R;  // Change in latitude (in radians)
    const dLon = distance * Math.sin(radians) / (R * Math.cos(lat * Math.PI / 180));  // Change in longitude (in radians)
  
    // Convert from radians back to degrees
    const newLat = lat + (dLat * 180 / Math.PI); // Convert radians to degrees for latitude
    const newLon = lon + (dLon * 180 / Math.PI); // Convert radians to degrees for longitude
  
    // Log for debugging
    console.log(`Original: lat = ${lat}, lon = ${lon}`);
    console.log(`Distance = ${distance} meters, Degrees = ${degrees}`);
    console.log(`Intermediate dLat = ${dLat}, dLon = ${dLon}`);
    console.log(`Converted: newLat = ${newLat}, newLon = ${newLon}`);
  
    // Normalize longitude to stay within [-180, 180]
    const normalizedLon = (newLon + 180) % 360;
    const adjustedLon = normalizedLon < 0 ? normalizedLon + 360 : normalizedLon - 180;
    
    // Ensure latitude stays within [-90, 90]
    const adjustedLat = Math.min(Math.max(newLat, -90), 90);
  
    // Log final coordinates
    console.log(`Final: newLat = ${adjustedLat}, newLon = ${adjustedLon}`);
  
    return { latitude: adjustedLat, longitude: adjustedLon };
  };

  const addEnemyFromSoldier = async (distance, degrees, name) => {
    const soldierId = 1;

    // Fetch the soldier's location from Supabase
    const { data: soldierData, error: soldierError } = await supabase
      .from('soldiers')
      .select('latitude, longitude')
      .eq('id', soldierId)
      .single();

    if (soldierError) {
      console.error('Error fetching soldier data:', soldierError);
      return;
    }

    // Log soldier's location
    console.log('Soldier location:', soldierData);

    const soldierLatitude = soldierData.latitude;
    const soldierLongitude = soldierData.longitude;

    // Log the parsed distance and degrees
    console.log('Parsed Command:', { distance, degrees });

    // Calculate the new enemy location
    const { latitude: newLatitude, longitude: newLongitude } = convertToLatLng(soldierLatitude, soldierLongitude, distance, degrees);

    // Log the calculated enemy location
    console.log('Calculated enemy location:', { latitude: newLatitude, longitude: newLongitude });

    // Ensure the coordinates are valid
    if (isNaN(newLatitude) || isNaN(newLongitude)) {
      console.error('Invalid latitude or longitude');
      return;
    }

    // Add the new enemy to Supabase with the name
    await addEnemyToSupabase(newLatitude, newLongitude, name);
  };

  const addEnemyToSupabase = async (latitude, longitude, name) => {
    try {
      console.log('Attempting to add enemy with coordinates:', { latitude, longitude });
      const { data, error } = await supabase
        .from('enemies')
        .insert([
          {
            name: name,  // Insert the enemy's name
            latitude: latitude,
            longitude: longitude,
            created_at: new Date(),
          }
        ]);

      if (error) {
        console.error('Error adding enemy to Supabase:', error.message);
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Enemy added to Supabase:', data);
      }
    } catch (error) {
      console.error('Unexpected error in addEnemyToSupabase:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsListening((prev) => !prev)}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {command && <div>Last Command: {command}</div>}
    </div>
  );
};

export default VoiceAssistant;
