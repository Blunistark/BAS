import React, { useEffect, useRef } from "react";
import "./RearCam.css";
import Navbar from "./Navbar";

function RearCam() {
  const videoRef = useRef(null);

  useEffect(() => {z
    const getWebcamStream = async () => {
      try {
        // Check if mediaDevices and getUserMedia are supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("getUserMedia is not supported in this browser.");
          alert("Your browser does not support webcam access.");
          return;
        }

        // Request webcam access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Error accessing webcam. Please check browser permissions or camera availability.");
      }
    };

    getWebcamStream();

    // Cleanup function to stop webcam when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop all video tracks
      }
    };
  }, []);

  return (
    <div className="rearcam-container">
      {/* Add Navbar if needed */}
      {/* <Navbar /> */}
      {/* Video element for webcam stream */}
      <video
        className="rearcam-stream"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="100%" // Customize width and height as needed
      />
    </div>
  );
}

export default RearCam;
