const EnergyModel = require('../models/energyModel');

const EnergyController = {
  // GET /api/energy/summary
  async getEnergySummary(req, res) {
    try {
      const summary = await EnergyModel.getSummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching energy summary:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch energy summary',
        error: error.message 
      });
    }
  },

  // GET /api/energy/buildings
  async getBuildings(req, res) {
    try {
      const buildings = await EnergyModel.getBuildings();
      res.json(buildings);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch buildings',
        error: error.message 
      });
    }
  },

  // GET /api/energy/timeseries?buildingId=1&timeRange=hourly
  async getEnergyTimeSeries(req, res) {
    try {
      const { buildingId, timeRange = 'hourly' } = req.query;
      const data = await EnergyModel.getTimeSeriesData(buildingId, timeRange);
      
      if (buildingId) {
        const buildings = await EnergyModel.getBuildings();
        const building = buildings.find(b => b.id == buildingId);
        res.json({
          building: building?.name,
          data
        });
      } else {
        res.json(data);
      }
    } catch (error) {
      console.error('Error fetching time series data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch time series data',
        error: error.message 
      });
    }
  },

  // GET /api/energy/anomalies
  async getEnergyAnomalies(req, res) {
    try {
      const anomalies = await EnergyModel.getAnomalies();
      res.json(anomalies);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch anomalies',
        error: error.message 
      });
    }
  },

  // GET /api/energy/building/:id
  async getBuildingEnergyDetail(req, res) {
    try {
      const { id } = req.params;
      const detail = await EnergyModel.getBuildingDetail(id);
      
      if (!detail) {
        return res.status(404).json({ 
          success: false, 
          message: 'Building not found' 
        });
      }
      
      res.json(detail);
    } catch (error) {
      console.error('Error fetching building detail:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch building detail',
        error: error.message 
      });
    }
  }
};

module.exports = EnergyController;
