const db = require('../../db');
const { v4: uuidv4 } = require('uuid');

const RoomModel = {
  // Get all rooms
  async getAll(buildingUid = null) {
    let query = `
      SELECT 
        r.uid,
        r.room_number as roomNumber,
        r.room_name as name,
        b.uid as building_uid,
        b.building_name as buildingName,
        b.building_code as buildingCode,
        c.uid as campus_uid,
        c.name as campusName,
        r.room_type as type,
        r.floor,
        r.capacity,
        r.current_occupancy as currentOccupancy,
        r.status,
        ROUND((r.current_occupancy / r.capacity) * 100) as occupancyRate,
        r.created_at as createdAt,
        r.updated_at as updatedAt
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id
      JOIN campuses c ON b.campus_id = c.id
    `;
    
    const params = [];
    
    if (buildingUid) {
      query += ' WHERE b.uid = ?';
      params.push(buildingUid);
    }
    
    query += ' ORDER BY b.building_name, r.room_number';
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get room by UID
  async getByUid(uid) {
    const query = `
      SELECT 
        r.uid,
        r.room_number as roomNumber,
        r.room_name as name,
        b.uid as building_uid,
        b.building_name as buildingName,
        b.building_code as buildingCode,
        c.uid as campus_uid,
        c.name as campusName,
        r.room_type as type,
        r.floor,
        r.capacity,
        r.current_occupancy as currentOccupancy,
        r.status,
        ROUND((r.current_occupancy / r.capacity) * 100) as occupancyRate,
        r.created_at as createdAt,
        r.updated_at as updatedAt
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id
      JOIN campuses c ON b.campus_id = c.id
      WHERE r.uid = ?
    `;
    
    const [rows] = await db.query(query, [uid]);
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },

  // Create new room
  async create(roomData) {
    const uid = uuidv4();
    
    // Get building internal ID
    const [building] = await db.query('SELECT id FROM buildings WHERE uid = ?', [roomData.building_uid]);
    
    if (building.length === 0) {
      throw new Error('Building not found');
    }

    const query = `
      INSERT INTO rooms 
      (uid, building_id, room_number, room_name, room_type, floor, capacity, current_occupancy, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      uid,
      building[0].id,
      roomData.roomNumber,
      roomData.name || null,
      roomData.type || 'other',
      roomData.floor || 1,
      roomData.capacity || 0,
      roomData.currentOccupancy || 0,
      roomData.status || 'available'
    ];
    
    await db.query(query, params);
    
    return await this.getByUid(uid);
  },

  // Update room
  async update(uid, roomData) {
    const updates = [];
    const params = [];

    if (roomData.roomNumber !== undefined) {
      updates.push('room_number = ?');
      params.push(roomData.roomNumber);
    }
    if (roomData.name !== undefined) {
      updates.push('room_name = ?');
      params.push(roomData.name);
    }
    if (roomData.type !== undefined) {
      updates.push('room_type = ?');
      params.push(roomData.type);
    }
    if (roomData.floor !== undefined) {
      updates.push('floor = ?');
      params.push(roomData.floor);
    }
    if (roomData.capacity !== undefined) {
      updates.push('capacity = ?');
      params.push(roomData.capacity);
    }
    if (roomData.currentOccupancy !== undefined) {
      updates.push('current_occupancy = ?');
      params.push(roomData.currentOccupancy);
    }
    if (roomData.status !== undefined) {
      updates.push('status = ?');
      params.push(roomData.status);
    }
    if (roomData.building_uid !== undefined) {
      // Get building internal ID
      const [building] = await db.query('SELECT id FROM buildings WHERE uid = ?', [roomData.building_uid]);
      if (building.length === 0) {
        throw new Error('Building not found');
      }
      updates.push('building_id = ?');
      params.push(building[0].id);
    }

    if (updates.length === 0) {
      return await this.getByUid(uid);
    }

    updates.push('updated_at = NOW()');
    params.push(uid);

    const query = `
      UPDATE rooms 
      SET ${updates.join(', ')}
      WHERE uid = ?
    `;
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.getByUid(uid);
  },

  // Delete room
  async delete(uid) {
    // Check if room has related records (tickets, occupancy readings, etc.)
    const ticketsQuery = `
      SELECT COUNT(*) as count
      FROM tickets
      WHERE room_id = (SELECT id FROM rooms WHERE uid = ?)
    `;
    
    const [ticketsResult] = await db.query(ticketsQuery, [uid]);
    
    if (ticketsResult[0].count > 0) {
      throw new Error('Cannot delete room with existing maintenance tickets');
    }

    const query = `DELETE FROM rooms WHERE uid = ?`;
    const [result] = await db.query(query, [uid]);
    
    return result.affectedRows > 0;
  },

  // Get room occupancy history
  async getOccupancyHistory(uid, hours = 24) {
    const query = `
      SELECT 
        DATE_FORMAT(timestamp, '%H:%i') as time,
        occupancy
      FROM occupancy_readings
      WHERE room_id = (SELECT id FROM rooms WHERE uid = ?)
        AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
      ORDER BY timestamp ASC
    `;
    
    const [rows] = await db.query(query, [uid, hours]);
    return rows;
  },

  // Update room occupancy
  async updateOccupancy(uid, occupancy) {
    // Determine status based on occupancy
    const [room] = await db.query('SELECT capacity FROM rooms WHERE uid = ?', [uid]);
    
    if (room.length === 0) {
      throw new Error('Room not found');
    }

    let status = 'available';
    if (occupancy >= room[0].capacity) {
      status = 'full';
    } else if (occupancy > 0) {
      status = 'occupied';
    }

    const query = `
      UPDATE rooms 
      SET current_occupancy = ?, status = ?, updated_at = NOW()
      WHERE uid = ?
    `;
    
    await db.query(query, [occupancy, status, uid]);
    
    return await this.getByUid(uid);
  }
};

module.exports = RoomModel;
