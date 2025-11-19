const db = require('../../db');

const EnergyModel = {
  // Get energy summary
  async getSummary() {
    const query = `
      SELECT 
        SUM(e.consumption_kwh) as totalConsumption,
        SUM(e.cost) as totalCost,
        AVG(e.efficiency_percentage) as avgEfficiency,
        COUNT(DISTINCT ea.anomaly_id) as anomalyCount
      FROM energy_readings e
      LEFT JOIN energy_anomalies ea ON e.reading_id = ea.reading_id
      WHERE DATE(e.timestamp) = CURDATE()
    `;
    
    const [rows] = await db.query(query);
    return rows[0];
  },

  // Get all buildings
  async getBuildings() {
    const query = `
      SELECT 
        b.id,
        CONCAT(c.name, ' - ', b.building_name) as name,
        c.location,
        b.total_rooms,
        b.total_capacity
      FROM buildings b
      JOIN campuses c ON b.campus_id = c.campus_id
      WHERE b.status = 'active'
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get energy time series data
  async getTimeSeriesData(buildingId = null, timeRange = 'hourly') {
    let query;
    let params = [];

    if (timeRange === 'hourly') {
      query = `
        SELECT 
          DATE_FORMAT(timestamp, '%H:00') as label,
          SUM(consumption_kwh) as value
        FROM energy_readings
        WHERE DATE(timestamp) = CURDATE()
        ${buildingId ? 'AND building_id = ?' : ''}
        GROUP BY DATE_FORMAT(timestamp, '%H:00')
        ORDER BY timestamp
      `;
    } else if (timeRange === 'daily') {
      query = `
        SELECT 
          DATE_FORMAT(timestamp, '%a') as label,
          SUM(consumption_kwh) as value
        FROM energy_readings
        WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ${buildingId ? 'AND building_id = ?' : ''}
        GROUP BY DATE(timestamp)
        ORDER BY timestamp
      `;
    } else if (timeRange === 'weekly') {
      query = `
        SELECT 
          CONCAT('Week ', WEEK(timestamp, 1)) as label,
          SUM(consumption_kwh) as value
        FROM energy_readings
        WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
        ${buildingId ? 'AND building_id = ?' : ''}
        GROUP BY WEEK(timestamp, 1)
        ORDER BY timestamp
      `;
    }

    if (buildingId) {
      params.push(buildingId);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get energy anomalies
  async getAnomalies() {
    const query = `
      SELECT 
        ea.anomaly_id as id,
        CONCAT(c.name, ' - ', b.building_name) as building,
        ea.location,
        ea.timestamp,
        ea.severity,
        ea.actual_consumption as consumption,
        ea.expected_consumption as expected,
        CONCAT('+', ROUND(((ea.actual_consumption - ea.expected_consumption) / ea.expected_consumption) * 100), '%') as deviation
      FROM energy_anomalies ea
      JOIN buildings b ON ea.building_id = b.id
      JOIN campuses c ON b.campus_id = c.campus_id
      WHERE DATE(ea.timestamp) = CURDATE()
      ORDER BY 
        CASE ea.severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        ea.timestamp DESC
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get building energy details
  async getBuildingDetail(buildingId) {
    const query = `
      SELECT 
        CONCAT(c.name, ' - ', b.building_name) as building,
        SUM(e.consumption_kwh) as consumption,
        SUM(e.cost) as cost,
        AVG(e.efficiency_percentage) as efficiency
      FROM energy_readings e
      JOIN buildings b ON e.building_id = b.id
      JOIN campuses c ON b.campus_id = c.campus_id
      WHERE e.building_id = ? AND DATE(e.timestamp) = CURDATE()
      GROUP BY b.id, c.name, b.building_name
    `;
    
    const [rows] = await db.query(query, [buildingId]);
    
    if (rows.length === 0) {
      return null;
    }

    // Get anomalies for this building
    const anomalyQuery = `
      SELECT 
        anomaly_id as id,
        location,
        timestamp,
        severity,
        actual_consumption as consumption
      FROM energy_anomalies
      WHERE building_id = ? AND DATE(timestamp) = CURDATE()
    `;
    
    const [anomalies] = await db.query(anomalyQuery, [buildingId]);
    
    return {
      ...rows[0],
      anomalies
    };
  }
};

module.exports = EnergyModel;
