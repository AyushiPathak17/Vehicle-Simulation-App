import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddVehicle.css';

function AddVehicle() {
  const [scenarios, setScenarios] = useState([]);
  const [vehicle, setVehicle] = useState({
    scenario: '',
    name: '',
    speed: '',
    positionX: '',
    positionY: '',
    direction: ''
  });

  const containerWidth = 800; // Adjust this value to match your container width
  const containerHeight = 400; // Adjust this value to match your container height

  useEffect(() => {
    const fetchScenarios = async () => {
      const response = await axios.get('http://localhost:5000/scenarios');
      setScenarios(response.data);
    };
    fetchScenarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate position inputs
    if (
      vehicle.positionX < 0 ||
      vehicle.positionX >= containerWidth ||
      vehicle.positionY < 0 ||
      vehicle.positionY >= containerHeight
    ) {
      alert('Position values should be within the container bounds');
      return;
    }

    await axios.post('http://localhost:5000/vehicles', vehicle);
    setVehicle({
      scenario: '',
      name: '',
      speed: '',
      positionX: '',
      positionY: '',
      direction: ''
    });
  };

  const handleReset = () => {
    setVehicle({
      scenario: '',
      name: '',
      speed: '',
      positionX: '',
      positionY: '',
      direction: ''
    });
  };

  return (
    <div className="add-vehicle-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-row">
            <div className="form-item">
              <label htmlFor="scenario">Scenario</label>
              <select
                id="scenario"
                name="scenario"
                value={vehicle.scenario}
                onChange={handleChange}
              >
                <option value="">Select Scenario</option>
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="name">Vehicle Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={vehicle.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
              />
            </div>
            <div className="form-item">
              <label htmlFor="speed">Speed</label>
              <input
                type="text"
                id="speed"
                name="speed"
                value={vehicle.speed}
                onChange={handleChange}
                placeholder="Speed"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-item">
              <label htmlFor="positionX">Position X</label>
              <input
                type="text"
                id="positionX"
                name="positionX"
                value={vehicle.positionX}
                onChange={handleChange}
                placeholder="Position X"
              />
            </div>
            <div className="form-item">
              <label htmlFor="positionY">Position Y</label>
              <input
                type="text"
                id="positionY"
                name="positionY"
                value={vehicle.positionY}
                onChange={handleChange}
                placeholder="Position Y"
              />
            </div>
            <div className="form-item">
              <label htmlFor="direction">Direction</label>
              <select
                id="direction"
                name="direction"
                value={vehicle.direction}
                onChange={handleChange}
              >
                <option value="">Select Direction</option>
                <option value="Towards">Towards</option>
                <option value="Backwards">Backwards</option>
                <option value="Upwards">Upwards</option>
                <option value="Downwards">Downwards</option>
              </select>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button type="submit" className="add-button">Add Vehicle</button>
          <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
          <button type="button" className="go-back-button">Go Back</button>
        </div>
      </form>
    </div>
  );
}

export default AddVehicle;
