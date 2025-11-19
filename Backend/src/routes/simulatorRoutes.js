const express = require('express');
const router = express.Router();
const SimulatorController = require('../controllers/simulatorController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication to all routes (optional - remove if you want public access)
// router.use(authenticate);

// Energy endpoints
router.get('/energy/latest', SimulatorController.getLatestEnergyReadings);
router.get('/energy/building/:buildingId', SimulatorController.getBuildingEnergyHistory);

// Occupancy endpoints
router.get('/occupancy/latest', SimulatorController.getLatestOccupancyReadings);
router.get('/occupancy/room/:roomId', SimulatorController.getRoomOccupancyHistory);

// Alerts endpoints
router.get('/alerts', SimulatorController.getActiveAlerts);
router.get('/alerts/:id', SimulatorController.getAlertById);
router.put('/alerts/:id/acknowledge', authenticate, SimulatorController.acknowledgeAlert);
router.put('/alerts/:id/resolve', authenticate, SimulatorController.resolveAlert);

// Dashboard statistics
router.get('/stats', SimulatorController.getDashboardStats);

module.exports = router;
