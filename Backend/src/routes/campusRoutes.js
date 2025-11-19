const express = require('express');
const router = express.Router();
const CampusController = require('../controllers/campusController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/', CampusController.getAllCampuses);
router.get('/:id', CampusController.getCampusById);
router.get('/:id/stats', CampusController.getCampusStats);

// Protected routes (require authentication)
router.post('/', authenticate, CampusController.createCampus);
router.put('/:id', authenticate, CampusController.updateCampus);
router.patch('/:id', authenticate, CampusController.updateCampus);
router.delete('/:id', authenticate, CampusController.deleteCampus);

module.exports = router;
