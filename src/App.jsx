// import React from 'react';
// import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
// import Login from './Login';
// import Signup from './Signup';
// import Squad_info from './Squad-info';
// import Mission from './Mission';
// import MapScreen from './MapScreen-save';
// import './App.css';

// function App() {
//     return (
//         <>
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="*" element={<Squad_info />} />
//                 <Route path="/Mission" element={<Mission/>}/>
//                 <Route path="/Squad-info" element={<Squad_info/>}/>
//                 <Route path="MapScreen-save" element={<MapScreen/>}/>
//             </Routes>
//             <div className='Navbar'>
//                 <Link to='/login'>Login</Link>
//                 <Link to='Mission'>Mission</Link>
//                 <Link to="Squad-info">Squard-Info</Link>
//                 {
//                 //<Link to = "MapScreen">MapScreen</Link>
//                 }
//             </div>
//         </Router>
//             </>
//        // <Squad_info/>
//         //<Mission/>
//     );
// }

// export default App;

// 320*480 RESOLUTION
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Squad_info from './Squad-info';
import Mission from './Mission';
import MapScreen from './MapScreen';
import Communication from './Communication';

import './App.css';

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className='Navbar'>
            <button className="NavButton" onClick={() => navigate('/Mission')}>Mission</button>
            <button className="NavButton"  onClick={() => navigate('/Squad-info')}>Squad-Info</button>
            <button className="NavButton"  onClick={() => navigate('/MapScreen')}>Map</button>
            <button className="NavButton"  onClick={() => navigate('/Communication')}>Comms</button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Squad_info />} />
                <Route path="/Mission" element={<Mission />} />
                <Route path="/Squad-info" element={<Squad_info />} />
                <Route path="MapScreen" element={<MapScreen />} />
                <Route path ="Communication" element={<Communication/>}/>
            </Routes>
            <Navbar />
        </Router>
    );
}

export default App;
