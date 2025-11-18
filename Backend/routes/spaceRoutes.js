const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');

// Space routes
router.get('/summary', SpaceController.getSpaceSummary);
router.get('/occupancy', SpaceController.getSpaceOccupancy);
router.get('/heatmap', SpaceController.getSpaceHeatmap);
router.get('/suggestions', SpaceController.getSpaceSuggestions);
router.get('/building/:buildingName', SpaceController.getOccupancyByBuilding);
router.get('/room/:roomName', SpaceController.getRoomDetails);

module.exports = router;
