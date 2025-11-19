const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

const BuildingModel = {
  // Get all buildings
  async getAll(campusUid = null) {
    let query = `
      SELECT 
        b.uid,
        b.building_name as name,
        b.building_code as code,
        c.uid as campus_uid,
        c.name as campusName,
        b.total_rooms as totalRooms,
        b.total_capacity as totalCapacity,
        b.status,
        b.created_at as createdAt,
        b.updated_at as updatedAt
      FROM buildings b
      JOIN campuses c ON b.campus_id = c.id
    `;
    
    const params = [];
    
    if (campusUid) {
      query += ' WHERE c.uid = ?';
      params.push(campusUid);
    }
    
    query += ' ORDER BY b.building_name';
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get building by UID
  async getByUid(uid) {
    const query = `
      SELECT 
        b.uid,
        b.building_name as name,
        b.building_code as code,
        c.uid as campus_uid,
        c.name as campusName,
        c.location as campusLocation,
        b.total_rooms as totalRooms,
        b.total_capacity as totalCapacity,
        b.status,
        b.created_at as createdAt,
        b.updated_at as updatedAt
      FROM buildings b
      JOIN campuses c ON b.campus_id = c.id
      WHERE b.uid = ?
    `;
    
    const [rows] = await db.query(query, [uid]);
    
    if (rows.length === 0) {
      return null;
    }

    const building = rows[0];

    // Get rooms count and current occupancy
    const roomsQuery = `
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(current_occupancy), 0) as currentOccupancy,
        COALESCE(SUM(capacity), 0) as totalCapacity
      FROM rooms
      WHERE building_id = (SELECT id FROM buildings WHERE uid = ?)
    `;
    
    const [roomsResult] = await db.query(roomsQuery, [uid]);
    building.roomsCount = roomsResult[0].count;
    building.currentOccupancy = roomsResult[0].currentOccupancy;
    building.occupancyRate = building.totalCapacity > 0 
      ? Math.round((roomsResult[0].currentOccupancy / roomsResult[0].totalCapacity) * 100)
      : 0;

    return building;
  },

  // Create new building
  async create(buildingData) {
    const uid = uuidv4();
    
    // Get campus internal ID
    const [campus] = await db.query('SELECT id FROM campuses WHERE uid = ?', [buildingData.campus_uid]);
    
    if (campus.length === 0) {
      throw new Error('Campus not found');
    }

    const query = `
      INSERT INTO buildings 
      (uid, campus_id, building_name, building_code, total_rooms, total_capacity, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      uid,
      campus[0].id,
      buildingData.name,
      buildingData.code,
      buildingData.totalRooms || 0,
      buildingData.totalCapacity || 0,
      buildingData.status || 'active'
    ];
    
    await db.query(query, params);
    
    return await this.getByUid(uid);
  },

  // Update building
  async update(uid, buildingData) {
    const updates = [];
    const params = [];

    if (buildingData.name !== undefined) {
      updates.push('building_name = ?');
      params.push(buildingData.name);
    }
    if (buildingData.code !== undefined) {
      updates.push('building_code = ?');
      params.push(buildingData.code);
    }
    if (buildingData.totalRooms !== undefined) {
      updates.push('total_rooms = ?');
      params.push(buildingData.totalRooms);
    }
    if (buildingData.totalCapacity !== undefined) {
      updates.push('total_capacity = ?');
      params.push(buildingData.totalCapacity);
    }
    if (buildingData.status !== undefined) {
      updates.push('status = ?');
      params.push(buildingData.status);
    }
    if (buildingData.campus_uid !== undefined) {
      // Get campus internal ID
      const [campus] = await db.query('SELECT id FROM campuses WHERE uid = ?', [buildingData.campus_uid]);
      if (campus.length === 0) {
        throw new Error('Campus not found');
      }
      updates.push('campus_id = ?');
      params.push(campus[0].id);
    }

    if (updates.length === 0) {
      return await this.getByUid(uid);
    }

    updates.push('updated_at = NOW()');
    params.push(uid);

    const query = `
      UPDATE buildings 
      SET ${updates.join(', ')}
      WHERE uid = ?
    `;
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.getByUid(uid);
  },

  // Delete building
  async delete(uid) {
    // Check if building has rooms
    const roomsQuery = `
      SELECT COUNT(*) as count
      FROM rooms
      WHERE building_id = (SELECT id FROM buildings WHERE uid = ?)
    `;
    
    const [roomsResult] = await db.query(roomsQuery, [uid]);
    
    if (roomsResult[0].count > 0) {
      throw new Error('Cannot delete building with existing rooms');
    }

    const query = `DELETE FROM buildings WHERE uid = ?`;
    const [result] = await db.query(query, [uid]);
    
    return result.affectedRows > 0;
  },

  // Get building statistics
  async getStats(uid) {
    const query = `
      SELECT 
        COUNT(r.id) as totalRooms,
        COUNT(CASE WHEN r.status = 'occupied' THEN 1 END) as occupiedRooms,
        COUNT(CASE WHEN r.status = 'available' THEN 1 END) as availableRooms,
        COALESCE(SUM(r.capacity), 0) as totalCapacity,
        COALESCE(SUM(r.current_occupancy), 0) as currentOccupancy,
        ROUND((COALESCE(SUM(r.current_occupancy), 0) / NULLIF(SUM(r.capacity), 0)) * 100, 1) as occupancyRate
      FROM buildings b
      LEFT JOIN rooms r ON b.id = r.building_id
      WHERE b.uid = ?
      GROUP BY b.id
    `;
    
    const [rows] = await db.query(query, [uid]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = BuildingModel;
