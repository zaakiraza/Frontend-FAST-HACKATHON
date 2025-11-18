const SpaceModel = require('../models/spaceModel');

const SpaceController = {
  // GET /api/space/summary
  async getSpaceSummary(req, res) {
    try {
      const summary = await SpaceModel.getSummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching space summary:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch space summary',
        error: error.message 
      });
    }
  },

  // GET /api/space/occupancy?filter=all
  async getSpaceOccupancy(req, res) {
    try {
      const { filter = 'all' } = req.query;
      const occupancy = await SpaceModel.getOccupancy(filter);
      res.json(occupancy);
    } catch (error) {
      console.error('Error fetching occupancy:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch occupancy',
        error: error.message 
      });
    }
  },

  // GET /api/space/heatmap
  async getSpaceHeatmap(req, res) {
    try {
      const heatmap = await SpaceModel.getHeatmap();
      res.json(heatmap);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch heatmap',
        error: error.message 
      });
    }
  },

  // GET /api/space/suggestions
  async getSpaceSuggestions(req, res) {
    try {
      const suggestions = await SpaceModel.getSuggestions();
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch suggestions',
        error: error.message 
      });
    }
  },

  // GET /api/space/building/:buildingName
  async getOccupancyByBuilding(req, res) {
    try {
      const { buildingName } = req.params;
      const occupancy = await SpaceModel.getOccupancyByBuilding(buildingName);
      res.json(occupancy);
    } catch (error) {
      console.error('Error fetching occupancy by building:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch occupancy by building',
        error: error.message 
      });
    }
  },

  // GET /api/space/room/:roomName
  async getRoomDetails(req, res) {
    try {
      const { roomName } = req.params;
      const room = await SpaceModel.getRoomDetails(roomName);
      
      if (!room) {
        return res.status(404).json({ 
          success: false, 
          message: 'Room not found' 
        });
      }
      
      res.json(room);
    } catch (error) {
      console.error('Error fetching room details:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch room details',
        error: error.message 
      });
    }
  }
};

module.exports = SpaceController;
