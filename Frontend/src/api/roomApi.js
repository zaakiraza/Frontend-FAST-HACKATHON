// Room API - Mock implementation
import { roomData, campusData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let rooms = [...roomData];
let nextRoomId = Math.max(...rooms.map(r => r.id)) + 1;

/**
 * Get all rooms with optional filtering
 * @param {Object} filters - Optional filters
 * @param {number} filters.campus_id - Filter by campus ID
 * @param {string} filters.room_type - Filter by room type
 * @param {string} filters.status - Filter by status
 * @returns {Promise<Array>} Array of room objects
 */
export const getRooms = async (filters = {}) => {
  await delay();
  
  let filteredRooms = [...rooms];
  
  if (filters.campus_id) {
    filteredRooms = filteredRooms.filter(r => r.campus_id === parseInt(filters.campus_id));
  }
  
  if (filters.room_type) {
    filteredRooms = filteredRooms.filter(r => r.room_type === filters.room_type);
  }
  
  if (filters.status) {
    filteredRooms = filteredRooms.filter(r => r.status === filters.status);
  }
  
  return filteredRooms;
};

/**
 * Get a single room by ID
 * @param {number} roomId - The room ID
 * @returns {Promise<Object>} Room object
 */
export const getRoomById = async (roomId) => {
  await delay();
  const room = rooms.find(r => r.id === roomId);
  if (!room) {
    throw new Error(`Room with ID ${roomId} not found`);
  }
  return { ...room };
};

/**
 * Get all campuses (for dropdown)
 * @returns {Promise<Array>} Array of campus objects
 */
export const getCampuses = async () => {
  await delay(300);
  return [...campusData];
};

/**
 * Create a new room
 * @param {Object} roomData - Room data
 * @param {number} roomData.campus_id - Campus ID
 * @param {string} roomData.room_number - Room number
 * @param {string} roomData.room_name - Room name
 * @param {string} roomData.building - Building name
 * @param {number} roomData.floor - Floor number
 * @param {string} roomData.room_type - Room type (classroom/lab/lecture-hall/etc)
 * @param {number} roomData.capacity - Room capacity
 * @param {number} roomData.current_occupancy - Current occupancy
 * @param {string} roomData.status - Status (available/occupied/maintenance/reserved)
 * @param {Array} roomData.scheduled_classes - Array of scheduled classes
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = async (roomData) => {
  await delay(600);
  
  const newRoom = {
    room_id: nextRoomId++,
    campus_id: parseInt(roomData.campus_id),
    room_number: roomData.room_number,
    room_name: roomData.room_name,
    building: roomData.building || '',
    floor: parseInt(roomData.floor) || 0,
    room_type: roomData.room_type || 'classroom',
    capacity: parseInt(roomData.capacity) || 0,
    current_occupancy: parseInt(roomData.current_occupancy) || 0,
    status: roomData.status || 'available',
    scheduled_classes: roomData.scheduled_classes || [],
    created_at: new Date().toISOString()
  };
  
  rooms.push(newRoom);
  return { ...newRoom };
};

/**
 * Update an existing room
 * @param {number} roomId - The room ID
 * @param {Object} roomData - Updated room data
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoom = async (roomId, roomData) => {
  await delay(600);
  
  const index = rooms.findIndex(r => r.id === roomId);
  if (index === -1) {
    throw new Error(`Room with ID ${roomId} not found`);
  }
  
  rooms[index] = {
    ...rooms[index],
    campus_id: parseInt(roomData.campus_id) || rooms[index].campus_id,
    room_number: roomData.room_number || rooms[index].room_number,
    room_name: roomData.room_name || rooms[index].room_name,
    building: roomData.building || rooms[index].building,
    floor: parseInt(roomData.floor) || rooms[index].floor,
    room_type: roomData.room_type || rooms[index].room_type,
    capacity: parseInt(roomData.capacity) || rooms[index].capacity,
    current_occupancy: parseInt(roomData.current_occupancy) || rooms[index].current_occupancy,
    status: roomData.status || rooms[index].status,
    scheduled_classes: roomData.scheduled_classes || rooms[index].scheduled_classes,
    updated_at: new Date().toISOString()
  };
  
  return { ...rooms[index] };
};

/**
 * Delete a room
 * @param {number} roomId - The room ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRoom = async (roomId) => {
  await delay(400);
  
  const index = rooms.findIndex(r => r.id === roomId);
  if (index === -1) {
    throw new Error(`Room with ID ${roomId} not found`);
  }
  
  const deletedRoom = rooms[index];
  rooms.splice(index, 1);
  
  return { 
    success: true, 
    message: `Room "${deletedRoom.room_name}" deleted successfully`,
    deleted: deletedRoom
  };
};

/**
 * Get room statistics
 * @param {number} campusId - Optional campus ID to filter stats
 * @returns {Promise<Object>} Room statistics
 */
export const getRoomStats = async (campusId = null) => {
  await delay();
  
  let filteredRooms = rooms;
  if (campusId) {
    filteredRooms = rooms.filter(r => r.campus_id === campusId);
  }
  
  return {
    total_rooms: filteredRooms.length,
    by_type: {
      classroom: filteredRooms.filter(r => r.room_type === 'classroom').length,
      lab: filteredRooms.filter(r => r.room_type === 'lab').length,
      'lecture-hall': filteredRooms.filter(r => r.room_type === 'lecture-hall').length,
      auditorium: filteredRooms.filter(r => r.room_type === 'auditorium').length,
      library: filteredRooms.filter(r => r.room_type === 'library').length,
      office: filteredRooms.filter(r => r.room_type === 'office').length
    },
    by_status: {
      available: filteredRooms.filter(r => r.status === 'available').length,
      occupied: filteredRooms.filter(r => r.status === 'occupied').length,
      maintenance: filteredRooms.filter(r => r.status === 'maintenance').length,
      reserved: filteredRooms.filter(r => r.status === 'reserved').length
    },
    total_capacity: filteredRooms.reduce((sum, r) => sum + r.capacity, 0),
    total_occupancy: filteredRooms.reduce((sum, r) => sum + r.current_occupancy, 0),
    avg_utilization: (filteredRooms.reduce((sum, r) => sum + (r.current_occupancy / r.capacity), 0) / filteredRooms.length * 100).toFixed(2)
  };
};

/**
 * Get rooms with over-capacity issues
 * @returns {Promise<Array>} Array of over-capacity rooms
 */
export const getOverCapacityRooms = async () => {
  await delay();
  return rooms.filter(r => r.current_occupancy > r.capacity);
};

/**
 * Get rooms with low utilization
 * @param {number} threshold - Utilization threshold percentage (default 30)
 * @returns {Promise<Array>} Array of underutilized rooms
 */
export const getUnderutilizedRooms = async (threshold = 30) => {
  await delay();
  return rooms.filter(r => {
    if (r.capacity === 0) return false;
    const utilization = (r.current_occupancy / r.capacity) * 100;
    return utilization < threshold && r.status === 'occupied';
  });
};
