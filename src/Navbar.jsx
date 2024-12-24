import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate();

    return (
        <div className='Navbar'>
            <button className="NavButton" onClick={() => navigate('/Mission')}>Mission</button>
            <button className="NavButton"  onClick={() => navigate('/Squad-info')}>Squad-Info</button>
            <button className="NavButton"  onClick={() => navigate('/MapScreen')}>Map</button>
            <button className="NavButton"  onClick={() => navigate('/Communication')}>Comms</button>
            <button className="NavButton"  onClick={() => navigate('/Rearcam')}>RearCam</button>
            <button className="NavButton"  onClick={() => navigate('/NightVisionCam')}>NightVisionCam</button>
            <button className="NavButton" onClick={() => navigate('/BaseScreen')}>Base</button>
            <button className="NavButton" onClick={() => navigate('/CameraComponent')}>CameraComponent</button>
        </div>
    );
}

export default Navbar;