import React from 'react';
import './Squad-info.css';
import Navbar from './Navbar';  // Import Navbar component

function Squad_info() {

  const handleMicPress = () => {
    console.log("Microphone Pressed");
  };

  return (
    <>
      <div className="Squad-info-screen">
        <h1 className="Squad-info-title">SQUAD INFO</h1>
        <div className="container">
          <div className="soldier-cards">
            {["Soldier 1", "Soldier 2", "Soldier 3", "Soldier 4", "Soldier 5", "Soldier 6"].map((soldier, index) => (
              <div key={index} className="soldier-card">
                <h2>{soldier}</h2>
                <p>
                  This soldier is highly skilled in combat and tactical operations. With advanced training in handling both close-quarters and long-range combat, they have proven themselves as an elite member of the squad. Known for their sharp instincts and quick reflexes, this soldier is always ready for action and able to adapt to any situation with ease.
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mic Button */}
        <button className="Microphone-btn" onClick={handleMicPress}>
          <img
            src="src\assets\mic.png" 
            alt="Mic Icon"
            className="button-icon"
          />
        </button>

        {/* Navbar
        <div className="navbar-overlay">
          <Navbar />
        </div> */}
      </div>
    </>
  );
}

export default Squad_info;
