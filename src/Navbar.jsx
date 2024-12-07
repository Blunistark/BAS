import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate();

    return (
        <div className='Navbar'>
            <img src="C:\Users\Kirran Kumar\OneDrive\Desktop\VS CODES\BMS\src\assets\msg.png"  alt="message"/>
            <button className="NavButton" onClick={() => navigate('/Mission')}>Mission</button>
            <button className="NavButton"  onClick={() => navigate('/Squad-info')}>Squad-Info</button>
            <button className="NavButton"  onClick={() => navigate('/MapScreen')}>Map</button>
        </div>
    );
}

export default Navbar;