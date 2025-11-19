const CampusModel = require('../models/campusModel');

const CampusController = {
  // Get all campuses
  async getAllCampuses(req, res) {
    try {
      const campuses = await CampusModel.getAll();
      res.json({ success: true, data: campuses });
    } catch (error) {
      console.error('Error getting campuses:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get campus by UID
  async getCampusById(req, res) {
    try {
      const campus = await CampusModel.getByUid(req.params.id);
      
      if (!campus) {
        return res.status(404).json({ success: false, error: 'Campus not found' });
      }
      
      res.json({ success: true, data: campus });
    } catch (error) {
      console.error('Error getting campus:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new campus
  async createCampus(req, res) {
    try {
      const { name, location, total_area } = req.body;

      if (!name || !location) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and location are required' 
        });
      }

      const campus = await CampusModel.create({
        name,
        location,
        total_area
      });

      res.status(201).json({ success: true, data: campus });
    } catch (error) {
      console.error('Error creating campus:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update campus
  async updateCampus(req, res) {
    try {
      const campus = await CampusModel.update(req.params.id, req.body);
      
      if (!campus) {
        return res.status(404).json({ success: false, error: 'Campus not found' });
      }
      
      res.json({ success: true, data: campus });
    } catch (error) {
      console.error('Error updating campus:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete campus
  async deleteCampus(req, res) {
    try {
      const deleted = await CampusModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Campus not found' });
      }
      
      res.json({ success: true, message: 'Campus deleted successfully' });
    } catch (error) {
      console.error('Error deleting campus:', error);
      
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ success: false, error: error.message });
      }
      
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get campus statistics
  async getCampusStats(req, res) {
    try {
      const stats = await CampusModel.getStats(req.params.id);
      
      if (!stats) {
        return res.status(404).json({ success: false, error: 'Campus not found' });
      }
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error getting campus stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = CampusController;
