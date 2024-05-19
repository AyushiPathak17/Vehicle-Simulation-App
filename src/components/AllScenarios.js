import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllScenarios.css';

function AllScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchScenariosAndVehicles() {
      try {
        const scenariosResponse = await axios.get('http://localhost:5000/scenarios');
        if (!isMounted) return;

        const scenariosData = scenariosResponse.data;
        if (!Array.isArray(scenariosData)) {
          console.error('Invalid data format received:', scenariosData);
          return;
        }

        const scenariosWithVehicles = await Promise.all(
          scenariosData.map(async (scenario) => {
            const vehiclesResponse = await axios.get(`http://localhost:5000/vehicles?scenarioId=${scenario.id}`);
            const vehiclesData = vehiclesResponse.data;
            return { ...scenario, vehicles: vehiclesData };
          })
        );

        if (isMounted) {
          setScenarios(scenariosWithVehicles);
        }
      } catch (error) {
        console.error('Error fetching scenarios and vehicles:', error);
      }
    }

    fetchScenariosAndVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/scenarios/${id}`);
      setScenarios(prevScenarios => prevScenarios.filter(scenario => scenario.id !== id));
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:5000/scenarios');
      setScenarios([]);
    } catch (error) {
      console.error('Error deleting all scenarios:', error);
    }
  };

  return (
    <div className="all-scenarios-container">
      <h2>All Scenarios</h2>
      <div className="buttons">
        <button className="add-scenario-button" onClick={() => navigate('/add-scenario')}>Add New Scenario</button>
        <button className="add-vehicle-button" onClick={() => navigate('/add-vehicle')}>Add Vehicle</button>
        <button className="delete-all-button" onClick={handleDeleteAll}>Delete All</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Scenario ID</th>
            <th>Scenario Name</th>
            <th>Time (seconds)</th>
            <th>Number of Vehicles</th>
            <th>Add Vehicle</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map(scenario => (
            <tr key={scenario.id}>
              <td>{scenario.id}</td>
              <td>{scenario.name}</td>
              <td>{scenario.time}</td>
              <td>{scenario.vehicles.length}</td>
              <td>
                <button onClick={() => navigate(`/add-vehicle/${scenario.id}`)}>Add Vehicle</button>
              </td>
              <td>
                <button className="edit-button">Edit</button>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(scenario.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllScenarios;
