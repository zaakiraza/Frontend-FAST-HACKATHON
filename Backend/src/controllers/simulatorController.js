const db = require('../../db');

const SimulatorController = {
  // Get latest energy readings for all buildings
  async getLatestEnergyReadings(req, res) {
    try {
      const query = `
        SELECT 
          er1.*
        FROM energy_readings er1
        INNER JOIN (
          SELECT building_id, MAX(timestamp) as max_timestamp
          FROM energy_readings
          GROUP BY building_id
        ) er2 ON er1.building_id = er2.building_id AND er1.timestamp = er2.max_timestamp
        ORDER BY er1.building_id
      `;
      
      const [readings] = await db.query(query);
      
      res.json({
        success: true,
        data: readings
      });
    } catch (error) {
      console.error('Error fetching energy readings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch energy readings',
        error: error.message
      });
    }
  },

  // Get energy readings for specific building with time range
  async getBuildingEnergyHistory(req, res) {
    try {
      const { buildingId } = req.params;
      const { hours = 1 } = req.query;
      
      const query = `
        SELECT *
        FROM energy_readings
        WHERE building_id = ?
        AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY timestamp DESC
        LIMIT 1000
      `;
      
      const [readings] = await db.query(query, [buildingId, hours]);
      
      res.json({
        success: true,
        data: readings
      });
    } catch (error) {
      console.error('Error fetching building energy history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch building energy history',
        error: error.message
      });
    }
  },

  // Get latest occupancy readings for all rooms
  async getLatestOccupancyReadings(req, res) {
    try {
      const query = `
        SELECT 
          or1.*
        FROM occupancy_readings or1
        INNER JOIN (
          SELECT room_id, MAX(timestamp) as max_timestamp
          FROM occupancy_readings
          GROUP BY room_id
        ) or2 ON or1.room_id = or2.room_id AND or1.timestamp = or2.max_timestamp
        ORDER BY or1.room_id
      `;
      
      const [readings] = await db.query(query);
      
      res.json({
        success: true,
        data: readings
      });
    } catch (error) {
      console.error('Error fetching occupancy readings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch occupancy readings',
        error: error.message
      });
    }
  },

  // Get occupancy readings for specific room with time range
  async getRoomOccupancyHistory(req, res) {
    try {
      const { roomId } = req.params;
      const { hours = 1 } = req.query;
      
      const query = `
        SELECT *
        FROM occupancy_readings
        WHERE room_id = ?
        AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY timestamp DESC
        LIMIT 1000
      `;
      
      const [readings] = await db.query(query, [roomId, hours]);
      
      res.json({
        success: true,
        data: readings
      });
    } catch (error) {
      console.error('Error fetching room occupancy history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch room occupancy history',
        error: error.message
      });
    }
  },

  // Get active alerts
  async getActiveAlerts(req, res) {
    try {
      const { type, severity } = req.query;
      
      let query = `
        SELECT *
        FROM alerts
        WHERE status = 'active'
      `;
      
      const params = [];
      
      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }
      
      if (severity) {
        query += ' AND severity = ?';
        params.push(severity);
      }
      
      query += ' ORDER BY created_at DESC LIMIT 100';
      
      const [alerts] = await db.query(query, params);
      
      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alerts',
        error: error.message
      });
    }
  },

  // Get alert by ID
  async getAlertById(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'SELECT * FROM alerts WHERE id = ?';
      const [alerts] = await db.query(query, [id]);
      
      if (alerts.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      }
      
      res.json({
        success: true,
        data: alerts[0]
      });
    } catch (error) {
      console.error('Error fetching alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alert',
        error: error.message
      });
    }
  },

  // Acknowledge alert
  async acknowledgeAlert(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || null;
      
      const query = `
        UPDATE alerts
        SET acknowledged_at = NOW(), acknowledged_by = ?
        WHERE id = ? AND acknowledged_at IS NULL
      `;
      
      const [result] = await db.query(query, [userId, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found or already acknowledged'
        });
      }
      
      res.json({
        success: true,
        message: 'Alert acknowledged successfully'
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to acknowledge alert',
        error: error.message
      });
    }
  },

  // Resolve alert
  async resolveAlert(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || null;
      
      const query = `
        UPDATE alerts
        SET status = 'resolved', resolved_at = NOW(), resolved_by = ?
        WHERE id = ? AND status = 'active'
      `;
      
      const [result] = await db.query(query, [userId, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found or already resolved'
        });
      }
      
      res.json({
        success: true,
        message: 'Alert resolved successfully'
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve alert',
        error: error.message
      });
    }
  },

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      // Get total energy consumption in last hour
      const energyQuery = `
        SELECT 
          COUNT(DISTINCT building_id) as total_buildings,
          AVG(consumption_kwh) as avg_consumption,
          MAX(consumption_kwh) as max_consumption,
          MIN(consumption_kwh) as min_consumption
        FROM energy_readings
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
      `;
      
      // Get occupancy statistics
      const occupancyQuery = `
        SELECT 
          COUNT(DISTINCT room_id) as total_rooms,
          AVG(utilization_rate) as avg_utilization,
          SUM(occupancy) as total_occupancy,
          SUM(capacity) as total_capacity
        FROM occupancy_readings
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
      `;
      
      // Get alert counts
      const alertsQuery = `
        SELECT 
          COUNT(*) as total_active_alerts,
          SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical_alerts,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_alerts,
          SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_alerts,
          SUM(CASE WHEN type = 'energy' THEN 1 ELSE 0 END) as energy_alerts,
          SUM(CASE WHEN type = 'occupancy' THEN 1 ELSE 0 END) as occupancy_alerts
        FROM alerts
        WHERE status = 'active'
      `;
      
      const [energyStats] = await db.query(energyQuery);
      const [occupancyStats] = await db.query(occupancyQuery);
      const [alertStats] = await db.query(alertsQuery);
      
      res.json({
        success: true,
        data: {
          energy: energyStats[0],
          occupancy: occupancyStats[0],
          alerts: alertStats[0]
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      });
    }
  }
};

module.exports = SimulatorController;
