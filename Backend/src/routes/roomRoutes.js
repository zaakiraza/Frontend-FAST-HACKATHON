const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);
router.get('/:id/history', RoomController.getRoomOccupancyHistory);

// Protected routes (require authentication)
router.post('/', authenticate, RoomController.createRoom);
router.put('/:id', authenticate, RoomController.updateRoom);
router.patch('/:id', authenticate, RoomController.updateRoom);
router.patch('/:id/occupancy', authenticate, RoomController.updateRoomOccupancy);
router.delete('/:id', authenticate, RoomController.deleteRoom);

module.exports = router;
