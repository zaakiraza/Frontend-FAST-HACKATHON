const db = require('../../db');

const SpaceModel = {
  // Get space utilization summary
  async getSummary() {
    const query = `
      SELECT 
        COUNT(*) as totalRooms,
        COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN current_occupancy > capacity THEN 1 END) as overCapacity
      FROM rooms
    `;
    
    const [rows] = await db.query(query);
    return rows[0];
  },

  // Get current occupancy data with optional filter
  async getOccupancy(filter = 'all') {
    let query = `
      SELECT 
        CONCAT(b.building_code, '-', r.room_number) as room,
        b.building_name as building,
        r.capacity,
        r.current_occupancy as current,
        r.status,
        ROUND((r.current_occupancy / r.capacity) * 100) as percentage
      FROM rooms r
      JOIN buildings b ON r.building_id = b.building_id
    `;
    
    const params = [];
    
    if (filter !== 'all') {
      query += ' WHERE r.status = ?';
      params.push(filter);
    }
    
    query += ' ORDER BY percentage DESC';
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get space heatmap data
  async getHeatmap() {
    const query = `
      SELECT 
        CONCAT(b.building_code, '-', r.room_number) as id,
        COALESCE(r.room_name, r.room_number) as name,
        r.current_occupancy as occupancy,
        r.capacity,
        r.status
      FROM rooms r
      JOIN buildings b ON r.building_id = b.building_id
      ORDER BY r.room_id
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get optimization suggestions
  async getSuggestions() {
    const suggestions = [];
    
    // Find underutilized rooms
    const underutilizedQuery = `
      SELECT 
        GROUP_CONCAT(CONCAT(b.building_code, '-', r.room_number) SEPARATOR ' and ') as rooms,
        b.building_name,
        COUNT(*) as count
      FROM rooms r
      JOIN buildings b ON r.building_id = b.building_id
      WHERE (r.current_occupancy / r.capacity) < 0.3 AND r.status = 'occupied'
      GROUP BY b.building_name
      HAVING count >= 2
      LIMIT 2
    `;
    
    const [underutilized] = await db.query(underutilizedQuery);
    
    underutilized.forEach((row, index) => {
      suggestions.push({
        id: suggestions.length + 1,
        type: 'merge',
        title: `Merge rooms in ${row.building_name}`,
        description: `Rooms ${row.rooms} are underutilized. Merging classes could save energy.`,
        impact: 'High',
        savings: '$450/week'
      });
    });
    
    // Find overcapacity rooms
    const overcapacityQuery = `
      SELECT 
        CONCAT(b1.building_code, '-', r1.room_number) as overcap_room,
        b1.building_name,
        r1.current_occupancy,
        r1.capacity,
        CONCAT(b2.building_code, '-', r2.room_number) as available_room,
        r2.capacity - r2.current_occupancy as available_seats
      FROM rooms r1
      JOIN buildings b1 ON r1.building_id = b1.building_id
      JOIN rooms r2 ON b1.building_id = b2.building_id
      JOIN buildings b2 ON r2.building_id = b2.building_id
      WHERE r1.current_occupancy > r1.capacity
        AND r2.current_occupancy < r2.capacity * 0.5
      LIMIT 2
    `;
    
    const [overcapacity] = await db.query(overcapacityQuery);
    
    overcapacity.forEach((row) => {
      suggestions.push({
        id: suggestions.length + 1,
        type: 'relocate',
        title: `Relocate Class from ${row.overcap_room}`,
        description: `${row.overcap_room} is over capacity. Move to ${row.available_room} which has ${row.available_seats} empty seats.`,
        impact: 'Critical',
        savings: 'Safety improvement'
      });
    });
    
    // Add generic optimization suggestions if needed
    if (suggestions.length < 3) {
      suggestions.push({
        id: suggestions.length + 1,
        type: 'optimize',
        title: 'Optimize Lab Schedules',
        description: 'Some labs are underutilized. Consolidate time slots for better efficiency.',
        impact: 'Medium',
        savings: '$320/week'
      });
    }
    
    return suggestions;
  },

  // Get occupancy by building
  async getOccupancyByBuilding(buildingName) {
    const query = `
      SELECT 
        CONCAT(b.building_code, '-', r.room_number) as room,
        b.building_name as building,
        r.capacity,
        r.current_occupancy as current,
        r.status,
        ROUND((r.current_occupancy / r.capacity) * 100) as percentage
      FROM rooms r
      JOIN buildings b ON r.building_id = b.building_id
      WHERE b.building_name LIKE ? OR b.building_code LIKE ?
      ORDER BY percentage DESC
    `;
    
    const [rows] = await db.query(query, [`%${buildingName}%`, `%${buildingName}%`]);
    return rows;
  },

  // Get room details
  async getRoomDetails(roomName) {
    const query = `
      SELECT 
        CONCAT(b.building_code, '-', r.room_number) as room,
        b.building_name as building,
        r.capacity,
        r.current_occupancy as current,
        r.status,
        ROUND((r.current_occupancy / r.capacity) * 100) as percentage,
        r.room_type as type,
        r.floor
      FROM rooms r
      JOIN buildings b ON r.building_id = b.building_id
      WHERE r.room_number = ? OR r.room_name = ? OR CONCAT(b.building_code, '-', r.room_number) = ?
    `;
    
    const [rows] = await db.query(query, [roomName, roomName, roomName]);
    
    if (rows.length === 0) {
      return null;
    }

    const room = rows[0];
    
    // Generate mock history data (you can create an occupancy_history table later)
    room.history = [
      { time: '08:00', occupancy: Math.floor(room.current * 0.3) },
      { time: '09:00', occupancy: Math.floor(room.current * 0.6) },
      { time: '10:00', occupancy: Math.floor(room.current * 0.9) },
      { time: '11:00', occupancy: room.current },
      { time: '12:00', occupancy: Math.floor(room.current * 0.8) }
    ];
    
    return room;
  }
};

module.exports = SpaceModel;
