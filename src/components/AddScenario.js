import React, { useState } from 'react';
import axios from 'axios';
import './AddScenario.css';

function AddScenario() {
  const [scenario, setScenario] = useState({ name: '', time: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScenario({ ...scenario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the scenario data as an object with 'name' and 'time' properties
      await axios.post('http://localhost:5000/scenarios', {
        name: scenario.name,
        time: parseInt(scenario.time, 10), // Ensure time is stored as an integer
      });
      setScenario({ name: '', time: '' }); // Reset the form after successful submission
    } catch (error) {
      console.error('Error while submitting:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleReset = () => {
    setScenario({ name: '', time: '' });
  };

  return (
    <div className="add-scenario-container">
      <h2>Add Scenario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Scenario Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={scenario.name}
            onChange={handleChange}
            required
            placeholder="Scenario Name"
          />

          <label htmlFor="time">Scenario Time (seconds)</label>
          <input
            type="number"
            id="time"
            name="time"
            value={scenario.time}
            onChange={handleChange}
            required
            placeholder="Time"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="add-button">
            Add
          </button>
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="go-back-button" onClick={handleReset}>
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddScenario;
