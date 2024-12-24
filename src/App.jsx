import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Remove BrowserRouter here
import Login from './Login';
import Signup from './Signup';
import Squad_info from './Squad-info';
import Mission from './Mission';
import MapScreen from './MapScreen';
import Communication from './Communication';
import RearCam from './RearCam';
import NightVisionCam from './NightVisionCam';
import BaseScreen from './BaseScreen';
import CameraComponent from './components/CameraComponent';
import Navbar from './Navbar';
import 'regenerator-runtime/runtime'; // Ensure this is required

import './App.css';

function App() {
    const location = useLocation(); // This works because <BrowserRouter> wraps this component in the root

    return (
        <>
            {/* Conditionally render Navbar */}
            {location.pathname !== "/" &&
                location.pathname !== "/login" &&
                location.pathname !== "/signup" &&
                location.pathname !== "/RearCam" && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/Mission" element={<Mission />} />
                <Route path="/Squad-info" element={<Squad_info />} />
                <Route path="/MapScreen" element={<MapScreen />} />
                <Route path="/Communication" element={<Communication />} />
                <Route path="/Rearcam" element={<RearCam />} />
                <Route path="/NightVisionCam" element={<NightVisionCam />} />
                <Route path="/BaseScreen" element={<BaseScreen />} />
                <Route path="/CameraComponent" element={<CameraComponent />} /> // Add ARMode component here if needed
            </Routes>
        </>
    );
}

export default App;
