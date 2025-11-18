const DashboardModel = require('../models/dashboardModel');

const DashboardController = {
  // GET /api/dashboard/stats
  async getDashboardStats(req, res) {
    try {
      const stats = await DashboardModel.getDashboardStats();
      res.json({ stats });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch dashboard stats',
        error: error.message 
      });
    }
  },

  // GET /api/dashboard/alerts
  async getRecentAlerts(req, res) {
    try {
      const alerts = await DashboardModel.getRecentAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch recent alerts',
        error: error.message 
      });
    }
  }
};

module.exports = DashboardController;
