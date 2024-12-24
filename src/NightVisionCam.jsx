import React from "react";
import "./NightVisionCam.css";  // You can customize styles here
import Navbar from "./Navbar";   // If you want to reuse the Navbar

function NightVisionCam() {
  const raspberryPiIP = "http://192.168.142.31:8080"; // Replace with your Raspberry Pi's IP

  return (
    <div className="nightvisioncam-container">
      <iframe
        className="nightvisioncam-stream"
        src={`${raspberryPiIP}/?action=stream`}
        allowFullScreen
        title="Night Vision Live Stream"
      ></iframe>
    </div>
  );
}

export default NightVisionCam;
