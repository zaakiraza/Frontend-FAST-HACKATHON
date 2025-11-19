const db = require('../../db');

const DashboardModel = {
  // Get comprehensive dashboard stats
  async getDashboardStats() {
    // Energy stats
    const energyQuery = `
      SELECT 
        SUM(consumption_kwh) as current,
        'kWh' as unit
      FROM energy_readings
      WHERE DATE(timestamp) = CURDATE()
    `;
    
    // Space utilization stats
    const spaceQuery = `
      SELECT 
        ROUND((COUNT(CASE WHEN status = 'occupied' THEN 1 END) / COUNT(*)) * 100, 1) as utilization
      FROM rooms
    `;
    
    // Maintenance stats
    const maintenanceQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open
      FROM tickets
    `;
    
    // Alerts count
    const alertsQuery = `
      SELECT 
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
        COUNT(CASE WHEN severity IN ('high', 'medium') THEN 1 END) as warnings,
        COUNT(CASE WHEN severity = 'low' THEN 1 END) as info
      FROM energy_anomalies
      WHERE DATE(timestamp) = CURDATE()
    `;
    
    const [energyResult] = await db.query(energyQuery);
    const [spaceResult] = await db.query(spaceQuery);
    const [maintenanceResult] = await db.query(maintenanceQuery);
    const [alertsResult] = await db.query(alertsQuery);
    
    return {
      energy: {
        current: `${Math.round(energyResult[0].current || 0).toLocaleString()} kWh`,
        trend: 'down',
        change: '-5.2%',
        status: 'good'
      },
      space: {
        utilization: `${spaceResult[0].utilization || 0}%`,
        trend: 'up',
        change: '+3.1%',
        status: 'optimal'
      },
      maintenance: {
        open: maintenanceResult[0].open || 0,
        trend: 'up',
        change: '+12%',
        status: maintenanceResult[0].open > 20 ? 'warning' : 'good'
      },
      alerts: {
        critical: alertsResult[0].critical || 0,
        warnings: alertsResult[0].warnings || 0,
        info: alertsResult[0].info || 0
      }
    };
  },

  // Get recent alerts
  async getRecentAlerts() {
    const query = `
      (
        SELECT 
          'danger' as type,
          CONCAT('High energy consumption detected in ', b.building_name) as message,
          CONCAT(TIMESTAMPDIFF(MINUTE, ea.timestamp, NOW()), ' minutes ago') as timestamp
        FROM energy_anomalies ea
        JOIN buildings b ON ea.building_id = b.id
        WHERE ea.severity IN ('critical', 'high')
        ORDER BY ea.timestamp DESC
        LIMIT 2
      )
      UNION ALL
      (
        SELECT 
          'warning' as type,
          CONCAT(CONCAT(b.building_code, '-', r.room_number), ' exceeding capacity limits') as message,
          CONCAT(TIMESTAMPDIFF(MINUTE, NOW(), NOW()), ' minutes ago') as timestamp
        FROM rooms r
        JOIN buildings b ON r.building_id = b.id
        WHERE r.current_occupancy > r.capacity
        LIMIT 2
      )
      UNION ALL
      (
        SELECT 
          'info' as type,
          CONCAT('Maintenance ticket resolved: ', title) as message,
          CONCAT(TIMESTAMPDIFF(HOUR, updated_at, NOW()), ' hours ago') as timestamp
        FROM tickets
        WHERE status = 'resolved' AND DATE(updated_at) = CURDATE()
        ORDER BY updated_at DESC
        LIMIT 2
      )
      LIMIT 10
    `;
    
    const [rows] = await db.query(query);
    return rows.map((row, index) => ({
      id: index + 1,
      ...row
    }));
  }
};

module.exports = DashboardModel;
