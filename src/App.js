import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddScenario from './components/AddScenario';
import AllScenarios from './components/AllScenarios';
import AddVehicle from './components/AddVehicle';
import Home from './components/Home';
import './App.css'; // Import the custom CSS file

function App() {
  return (
    <Router>
      <div className="App">
        {/* Side Navbar */}
        <nav className="navbar">
          <ul>
          <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-scenario">Add Scenario</Link>
            </li>
            <li>
              <Link to="/all-scenarios">All Scenarios</Link>
            </li>
            <li>
              <Link to="/add-vehicle">Add Vehicle</Link>
            </li>
           
          </ul>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/add-scenario" element={<AddScenario />} />
            <Route path="/all-scenarios" element={<AllScenarios />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
