import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [vehiclePositions, setVehiclePositions] = useState({});
  const animationRef = useRef(null);
  const simulationContainerRef = useRef(null);

  useEffect(() => {
    // Fetch scenarios on component mount
    const fetchScenarios = async () => {
      try {
        const result = await axios.get('http://localhost:5000/scenarios');
        setScenarios(result.data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };
    fetchScenarios();
  }, []);

  useEffect(() => {
    // Fetch vehicles when scenario changes
    const fetchVehiclesForScenario = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/vehicles?scenarioId=${selectedScenario}`);
        setVehicles(result.data);
      } catch (error) {
        console.error('Error fetching vehicles for scenario:', error);
      }
    };

    if (selectedScenario) {
      fetchVehiclesForScenario();
    }
  }, [selectedScenario]);

  useEffect(() => {
    // Initialize vehicle positions when vehicles state updates
    const initialPositions = {};
    vehicles.forEach(vehicle => {
      initialPositions[vehicle.id] = { x: vehicle.positionX || 0, y: vehicle.positionY || 0 };
    });
    setVehiclePositions(initialPositions);
  }, [vehicles]);

  const startSimulation = async () => {
    if (!selectedScenario) {
      console.error('Please select a valid scenario.');
      return;
    }

    try {
      const result = await axios.get(`http://localhost:5000/vehicles?scenarioId=${selectedScenario}`);
      setVehicles(result.data);

      // Initialize vehicle positions
      const initialPositions = {};
      result.data.forEach(vehicle => {
        initialPositions[vehicle.id] = { x: vehicle.positionX || 0, y: vehicle.positionY || 0 };
      });
      setVehiclePositions(initialPositions);

      setSimulationRunning(true);
      moveVehicles(); // Start moving vehicles immediately after starting simulation
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
    cancelAnimationFrame(animationRef.current);
  };

  const moveVehicles = useCallback(() => {
    if (!simulationRunning || !selectedScenario) {
      return;
    }
  
    const simulationContainer = simulationContainerRef.current;
    const containerRect = simulationContainer.getBoundingClientRect();
  
    const nextPositions = {};
    vehicles.forEach(vehicle => {
      const speed = vehicle.speed;
      const direction = vehicle.direction;
      let newX = vehiclePositions[vehicle.id].x;
      let newY = vehiclePositions[vehicle.id].y;
  
      switch (direction) {
        case 'Towards':
          newX += speed;
          break;
        case 'Backwards':
          newX -= speed;
          break;
        case 'Upwards':
          newY -= speed;
          break;
        case 'Downwards':
          newY += speed;
          break;
        default:
          break;
      }
  
      // Check if new position is within boundaries
      if (
        newX >= 0 &&
        newY >= 0 &&
        newX + vehicle.width <= containerRect.width &&
        newY + vehicle.height <= containerRect.height
      ) {
        nextPositions[vehicle.id] = { x: newX, y: newY };
      } else {
        nextPositions[vehicle.id] = { ...vehiclePositions[vehicle.id] }; // Maintain current position if outside boundaries
      }
    });
  
    setVehiclePositions(nextPositions);
  
    animationRef.current = requestAnimationFrame(moveVehicles);
  }, [simulationRunning, selectedScenario, vehicles, vehiclePositions]);
  

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="home-container">
      <h2>Home</h2>
      <div className="form-group">
        <label htmlFor="scenarioSelect">Select Scenario</label>
        <select
          id="scenarioSelect"
          onChange={(e) => setSelectedScenario(e.target.value)}
          value={selectedScenario}
        >
          <option value="" disabled>Select Scenario</option>
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={startSimulation}
        disabled={!selectedScenario || simulationRunning}
        className="start-button"
      >
        Start Simulation
      </button>
      <button
        onClick={stopSimulation}
        disabled={!simulationRunning}
        className="stop-button"
      >
        Stop Simulation
      </button>
      <div className="simulation-container" ref={simulationContainerRef}>
        {simulationRunning && vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="vehicle"
            style={{
              left: `${vehiclePositions[vehicle.id]?.x}px`,
              top: `${vehiclePositions[vehicle.id]?.y}px`
            }}
          >
            {vehicle.name}
          </div>
        ))}
      </div>
      <div className="vehicle-table-container">
        <h3>Vehicle Data</h3>
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position X</th>
              <th>Position Y</th>
              <th>Speed</th>
              <th>Direction</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.name}</td>
                <td>{vehiclePositions[vehicle.id]?.x}</td>
                <td>{vehiclePositions[vehicle.id]?.y}</td>
                <td>{vehicle.speed}</td>
                <td>{vehicle.direction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;