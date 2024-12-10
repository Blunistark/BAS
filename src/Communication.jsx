import React, { useState, useEffect } from 'react';
import './Communication.css';
import Navbar from './Navbar';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import supabase from './supabase';

function Communication() {
  const [messages, setMessages] = useState([]);
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const userEmail = localStorage.getItem('userEmail'); // Retrieve the logged-in user's email

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      if (!error) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (content) => {
    if (!content.trim()) return;
    await supabase.from('messages').insert([
      { sender: userEmail, content }, // Use the logged-in user's email as the sender
    ]);
    resetTranscript();
  };

  const handleMicPress = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      sendMessage(transcript);
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  return (
    <div className="Communication-screen">
      <h1 className="Communication-title">COMMUNICATION</h1>
      <div className="Msg-Container">
        <div className="Msg-Keeper">
          <div className="Msg-Holder">
            {messages.map((msg) => (
              <h3
                key={msg.id}
                className={`Msg ${msg.sender === userEmail ? 'Person1' : 'Person2'}`}
              >
                {msg.sender}: {msg.content}
              </h3>
            ))}
          </div>
        </div>
        <div className="keyboard">
          <button
            className={`Mic ${listening ? 'Recording' : 'NotRecording'}`}
            onClick={handleMicPress} // Use onClick for simplicity
          >
            <img src="src/assets/mic.png" alt="mic" className="Mic-Icon" draggable="false" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Communication;
