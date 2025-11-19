const RoomModel = require('../models/roomModel');

const RoomController = {
  // Get all rooms
  async getAllRooms(req, res) {
    try {
      const { buildingId } = req.query;
      const rooms = await RoomModel.getAll(buildingId);
      res.json({ success: true, data: rooms });
    } catch (error) {
      console.error('Error getting rooms:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get room by UID
  async getRoomById(req, res) {
    try {
      const room = await RoomModel.getByUid(req.params.id);
      
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      res.json({ success: true, data: room });
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new room
  async createRoom(req, res) {
    try {
      const { roomNumber, name, buildingId, type, floor, capacity, currentOccupancy, status } = req.body;

      if (!roomNumber || !buildingId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Room number and buildingId are required' 
        });
      }

      const room = await RoomModel.create({
        roomNumber,
        name,
        buildingId,
        type,
        floor,
        capacity,
        currentOccupancy,
        status
      });

      res.status(201).json({ success: true, data: room });
    } catch (error) {
      console.error('Error creating room:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update room
  async updateRoom(req, res) {
    try {
      const room = await RoomModel.update(req.params.id, req.body);
      
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      res.json({ success: true, data: room });
    } catch (error) {
      console.error('Error updating room:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete room
  async deleteRoom(req, res) {
    try {
      const deleted = await RoomModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get room occupancy history
  async getRoomOccupancyHistory(req, res) {
    try {
      const hours = parseInt(req.query.hours) || 24;
      const history = await RoomModel.getOccupancyHistory(req.params.id, hours);
      
      res.json({ success: true, data: history });
    } catch (error) {
      console.error('Error getting room occupancy history:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update room occupancy
  async updateRoomOccupancy(req, res) {
    try {
      const { occupancy } = req.body;

      if (occupancy === undefined || occupancy < 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Valid occupancy value is required' 
        });
      }

      const room = await RoomModel.updateOccupancy(req.params.id, occupancy);
      
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      res.json({ success: true, data: room });
    } catch (error) {
      console.error('Error updating room occupancy:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = RoomController;
