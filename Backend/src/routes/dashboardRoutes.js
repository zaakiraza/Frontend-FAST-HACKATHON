const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// Dashboard routes
router.get('/stats', DashboardController.getDashboardStats);
router.get('/alerts', DashboardController.getRecentAlerts);

module.exports = router;
