import React from "react";
import "./RearCam.css";
import Navbar from "./Navbar";

function RearCam() {
  const raspberryPiIP = "http://192.168.56.246:8080"; // Replace with your Raspberry Pi's IP

  return (
    <div className="rearcam-container">
      <iframe
        className="rearcam-stream"
        src={`${raspberryPiIP}/?action=stream`}
        allowFullScreen
        title="Live Stream"
      ></iframe>
    </div>
  );
}

export default RearCam;
