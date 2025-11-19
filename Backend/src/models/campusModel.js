const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

const CampusModel = {
  // Get all campuses
  async getAll() {
    const query = `
      SELECT 
        uid,
        name,
        location,
        total_area,
        created_at as createdAt,
        updated_at as updatedAt
      FROM campuses
      ORDER BY name
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get campus by UID
  async getByUid(uid) {
    const query = `
      SELECT 
        uid,
        name,
        location,
        total_area,
        created_at as createdAt,
        updated_at as updatedAt
      FROM campuses
      WHERE uid = ?
    `;
    
    const [rows] = await db.query(query, [uid]);
    
    if (rows.length === 0) {
      return null;
    }

    const campus = rows[0];

    // Get buildings count
    const buildingsQuery = `
      SELECT COUNT(*) as count
      FROM buildings
      WHERE campus_id = (SELECT id FROM campuses WHERE uid = ?)
    `;
    
    const [buildingsResult] = await db.query(buildingsQuery, [uid]);
    campus.buildingsCount = buildingsResult[0].count;

    return campus;
  },

  // Create new campus
  async create(campusData) {
    const uid = uuidv4();
    const query = `
      INSERT INTO campuses (uid, name, location, total_area, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      uid,
      campusData.name,
      campusData.location,
      campusData.total_area || null
    ];
    
    await db.query(query, params);
    
    return await this.getByUid(uid);
  },

  // Update campus
  async update(uid, campusData) {
    const query = `
      UPDATE campuses 
      SET 
        name = ?,
        location = ?,
        total_area = ?,
        updated_at = NOW()
      WHERE uid = ?
    `;
    
    const params = [
      campusData.name,
      campusData.location,
      campusData.total_area,
      uid
    ];
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.getByUid(uid);
  },

  // Delete campus
  async delete(uid) {
    // Check if campus has buildings
    const buildingsQuery = `
      SELECT COUNT(*) as count
      FROM buildings
      WHERE campus_id = (SELECT id FROM campuses WHERE uid = ?)
    `;
    
    const [buildingsResult] = await db.query(buildingsQuery, [uid]);
    
    if (buildingsResult[0].count > 0) {
      throw new Error('Cannot delete campus with existing buildings');
    }

    const query = `DELETE FROM campuses WHERE uid = ?`;
    const [result] = await db.query(query, [uid]);
    
    return result.affectedRows > 0;
  },

  // Get campus statistics
  async getStats(uid) {
    const query = `
      SELECT 
        COUNT(DISTINCT b.id) as totalBuildings,
        COUNT(DISTINCT r.id) as totalRooms,
        COALESCE(SUM(b.total_capacity), 0) as totalCapacity,
        COALESCE(SUM(r.current_occupancy), 0) as currentOccupancy
      FROM campuses c
      LEFT JOIN buildings b ON c.id = b.campus_id
      LEFT JOIN rooms r ON b.id = r.building_id
      WHERE c.uid = ?
      GROUP BY c.id
    `;
    
    const [rows] = await db.query(query, [uid]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = CampusModel;
