const express = require('express');
const router = express.Router();
const EnergyController = require('../controllers/energyController');

// Energy routes
router.get('/summary', EnergyController.getEnergySummary);
router.get('/buildings', EnergyController.getBuildings);
router.get('/timeseries', EnergyController.getEnergyTimeSeries);
router.get('/anomalies', EnergyController.getEnergyAnomalies);
router.get('/building/:id', EnergyController.getBuildingEnergyDetail);

module.exports = router;
