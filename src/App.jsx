import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Squad_info from './Squad_info/Squad-info';
import MapScreen from './MapScreen/MapScreen';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Signup />} />
                <Route path="/squad-info" element={<Squad_info />} />
                <Route path="/map-screen" element={<MapScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
