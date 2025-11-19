const db = require('../../db');

const EnergyModel = {
  // Get energy summary
  async getSummary() {
    const query = `
      SELECT 
        SUM(e.consumption_kwh) as totalConsumption,
        SUM(e.cost) as totalCost,
        AVG(e.efficiency_percentage) as avgEfficiency,
        COUNT(DISTINCT ea.id) as anomalyCount
      FROM energy_readings e
      LEFT JOIN energy_anomalies ea ON e.id = ea.reading_id
      WHERE DATE(e.timestamp) = CURDATE()
    `;
    
    const [rows] = await db.query(query);
    return rows[0];
  },

  // Get all buildings
  async getBuildings() {
    const query = `
      SELECT 
        b.uid as id,
        CONCAT(c.name, ' - ', b.building_name) as name,
        c.location,
        b.total_rooms,
        b.total_capacity
      FROM buildings b
      JOIN campuses c ON b.campus_id = c.id
      WHERE b.status = 'active'
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get energy time series data
  async getTimeSeriesData(buildingUid = null, timeRange = 'hourly') {
    let query;
    let params = [];

    if (timeRange === 'hourly') {
      query = `
        SELECT 
          DATE_FORMAT(e.timestamp, '%H:00') as label,
          SUM(e.consumption_kwh) as value
        FROM energy_readings e
        ${buildingUid ? 'JOIN buildings b ON e.building_id = b.id' : ''}
        WHERE DATE(e.timestamp) = CURDATE()
        ${buildingUid ? 'AND b.uid = ?' : ''}
        GROUP BY DATE_FORMAT(e.timestamp, '%H:00')
        ORDER BY DATE_FORMAT(e.timestamp, '%H:00')
      `;
    } else if (timeRange === 'daily') {
      query = `
        SELECT 
          DATE_FORMAT(e.timestamp, '%a') as label,
          SUM(e.consumption_kwh) as value
        FROM energy_readings e
        ${buildingUid ? 'JOIN buildings b ON e.building_id = b.id' : ''}
        WHERE e.timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ${buildingUid ? 'AND b.uid = ?' : ''}
        GROUP BY DATE(e.timestamp)
        ORDER BY DATE(e.timestamp)
      `;
    } else if (timeRange === 'weekly') {
      query = `
        SELECT 
          CONCAT('Week ', WEEK(e.timestamp, 1)) as label,
          SUM(e.consumption_kwh) as value
        FROM energy_readings e
        ${buildingUid ? 'JOIN buildings b ON e.building_id = b.id' : ''}
        WHERE e.timestamp >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
        ${buildingUid ? 'AND b.uid = ?' : ''}
        GROUP BY WEEK(e.timestamp, 1)
        ORDER BY WEEK(e.timestamp, 1)
      `;
    }

    if (buildingUid) {
      params.push(buildingUid);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get energy anomalies
  async getAnomalies() {
    const query = `
      SELECT 
        ea.id,
        CONCAT(c.name, ' - ', b.building_name) as building,
        ea.location,
        ea.timestamp,
        ea.severity,
        ea.actual_consumption as consumption,
        ea.expected_consumption as expected,
        CONCAT('+', ROUND(((ea.actual_consumption - ea.expected_consumption) / ea.expected_consumption) * 100), '%') as deviation
      FROM energy_anomalies ea
      JOIN buildings b ON ea.building_id = b.id
      JOIN campuses c ON b.campus_id = c.id
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
  async getBuildingDetail(buildingUid) {
    const query = `
      SELECT 
        CONCAT(c.name, ' - ', b.building_name) as building,
        SUM(e.consumption_kwh) as consumption,
        SUM(e.cost) as cost,
        AVG(e.efficiency_percentage) as efficiency
      FROM energy_readings e
      JOIN buildings b ON e.building_id = b.id
      JOIN campuses c ON b.campus_id = c.id
      WHERE b.uid = ? AND DATE(e.timestamp) = CURDATE()
      GROUP BY b.id, c.name, b.building_name
    `;
    
    const [rows] = await db.query(query, [buildingUid]);
    
    if (rows.length === 0) {
      return null;
    }

    // Get anomalies for this building
    const anomalyQuery = `
      SELECT 
        ea.id,
        ea.location,
        ea.timestamp,
        ea.severity,
        ea.actual_consumption as consumption
      FROM energy_anomalies ea
      JOIN buildings b ON ea.building_id = b.id
      WHERE b.uid = ? AND DATE(ea.timestamp) = CURDATE()
    `;
    
    const [anomalies] = await db.query(anomalyQuery, [buildingUid]);
    
    return {
      ...rows[0],
      anomalies
    };
  }
};

module.exports = EnergyModel;
