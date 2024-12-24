import React, { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Get video stream from the rear camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // 'environment' targets the rear camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setError('Unable to access camera: ' + err.message);
      }
    };

    getCamera();
    
    // Cleanup on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {hasPermission ? (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto"></video>
      ) : (
        <div>{error ? error : 'Requesting camera access...'}</div>
      )}
    </div>
  );
};

export default CameraComponent;
