const express = require('express');
const router = express.Router();
const BuildingController = require('../controllers/buildingController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/', BuildingController.getAllBuildings);
router.get('/:id', BuildingController.getBuildingById);
router.get('/:id/stats', BuildingController.getBuildingStats);

// Protected routes (require authentication)
router.post('/', authenticate, BuildingController.createBuilding);
router.put('/:id', authenticate, BuildingController.updateBuilding);
router.patch('/:id', authenticate, BuildingController.updateBuilding);
router.delete('/:id', authenticate, BuildingController.deleteBuilding);

module.exports = router;
