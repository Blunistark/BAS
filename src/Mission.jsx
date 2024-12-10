import React from 'react';
import './Mission.css';
import Navbar from "./Navbar";

function Mission() {
  return (
    <>
      <div className="Mission-container">
        <h1 className="Mission-title">MISSION INFO</h1>
        <div className="Mission-cards">
          <div className="Mission-card">
            <h2>Operation Sunrise</h2>
            <div className="Mission-subcard">
              <h3>Details</h3>
              <ul>
                <li>Objective: Secure communication towers</li>
                <li>Timeframe: 48 hours</li>
                <li>Team: Alpha Squad</li>
              </ul>
            </div>
          </div>
          <div className="Mission-card">
            <h2>Reconnaissance Omega</h2>
            <div className="Mission-subcard">
              <h3>Details</h3>
              <ul>
                <li>Objective: Monitor and report troop activity</li>
                <li>Timeframe: 72 hours</li>
                <li>Team: Bravo Unit</li>
              </ul>
            </div>
          </div>
          <div className="Mission-card">
            <h2>Rescue Echo</h2>
            <div className="Mission-subcard">
              <h3>Details</h3>
              <ul>
                <li>Objective: Extract hostages</li>
                <li>Timeframe: 24 hours</li>
                <li>Team: Delta Force</li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="navbar-Overlay">
          <div className="buttons">
            <Navbar className="Navbar" />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Mission;
