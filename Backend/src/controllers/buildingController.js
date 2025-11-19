const BuildingModel = require('../models/buildingModel');

const BuildingController = {
  // Get all buildings
  async getAllBuildings(req, res) {
    try {
      const { campusId } = req.query;
      const buildings = await BuildingModel.getAll(campusId);
      res.json({ success: true, data: buildings });
    } catch (error) {
      console.error('Error getting buildings:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get building by UID
  async getBuildingById(req, res) {
    try {
      const building = await BuildingModel.getByUid(req.params.id);
      
      if (!building) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }
      
      res.json({ success: true, data: building });
    } catch (error) {
      console.error('Error getting building:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new building
  async createBuilding(req, res) {
    try {
      const { name, code, campusId, totalRooms, totalCapacity, status } = req.body;

      if (!name || !code || !campusId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, code, and campusId are required' 
        });
      }

      const building = await BuildingModel.create({
        name,
        code,
        campusId,
        totalRooms,
        totalCapacity,
        status
      });

      res.status(201).json({ success: true, data: building });
    } catch (error) {
      console.error('Error creating building:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update building
  async updateBuilding(req, res) {
    try {
      const building = await BuildingModel.update(req.params.id, req.body);
      
      if (!building) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }
      
      res.json({ success: true, data: building });
    } catch (error) {
      console.error('Error updating building:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete building
  async deleteBuilding(req, res) {
    try {
      const deleted = await BuildingModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }
      
      res.json({ success: true, message: 'Building deleted successfully' });
    } catch (error) {
      console.error('Error deleting building:', error);
      
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get building statistics
  async getBuildingStats(req, res) {
    try {
      const stats = await BuildingModel.getStats(req.params.id);
      
      if (!stats) {
        return res.status(404).json({ success: false, error: 'Building not found' });
      }
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error getting building stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = BuildingController;
