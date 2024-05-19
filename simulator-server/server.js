const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let data = { scenarios: [], vehicles: [] };

const loadData = () => {
  if (fs.existsSync('data.json')) {
    const rawData = fs.readFileSync('data.json');
    data = JSON.parse(rawData);
    console.log('Data loaded:', data);
  }
};

const saveData = () => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.get('/scenarios', (req, res) => {
  loadData();
  const scenariosWithVehicleCount = data.scenarios.map(scenario => {
    const vehicles = data.vehicles.filter(vehicle => vehicle.scenarioId === scenario.id);
    return { ...scenario, vehicleCount: vehicles.length };
  });
  res.json(scenariosWithVehicleCount);
});

app.post('/scenarios', (req, res) => {
  loadData();
  const newScenario = { id: Date.now().toString(), ...req.body };
  data.scenarios.push(newScenario);
  saveData();
  res.status(201).json(newScenario);
});

app.get('/vehicles', (req, res) => {
  loadData();
  const { scenarioId } = req.query;
  if (scenarioId) {
    const filteredVehicles = data.vehicles.filter(vehicle => vehicle.scenarioId === scenarioId || vehicle.scenario === scenarioId);
    res.json(filteredVehicles);
  } else {
    res.json(data.vehicles);
  }
});

app.post('/vehicles', (req, res) => {
  loadData();
  const newVehicle = { id: Date.now().toString(), ...req.body };
  data.vehicles.push(newVehicle);
  saveData();
  res.status(201).json(newVehicle);
});


app.delete('/scenarios/:id', (req, res) => {
  loadData();
  const scenarioId = req.params.id;
  data.scenarios = data.scenarios.filter(scenario => scenario.id !== scenarioId);
  data.vehicles = data.vehicles.filter(vehicle => vehicle.scenarioId !== scenarioId);
  saveData();
  res.status(204).send();
});

app.delete('/scenarios', (req, res) => {
  loadData();
  data.scenarios = [];
  data.vehicles = [];
  saveData();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});