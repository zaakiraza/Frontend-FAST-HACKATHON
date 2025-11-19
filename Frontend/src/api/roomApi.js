// Room API
import { USE_MOCK_API, API_BASE_URL } from '../config/apiConfig';
import { roomData, campusData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data state
let rooms = [...roomData];
let nextRoomId = Math.max(...rooms.map(r => r.room_id)) + 1;

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get all rooms with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of room objects
 */
export const getRooms = async (filters = {}) => {
  if (USE_MOCK_API) {
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
  }
  
  const response = await apiCall('/admin/rooms');
  return response.data;
};

/**
 * Get a single room by ID
 * @param {number} roomId - The room ID
 * @returns {Promise<Object>} Room object
 */
export const getRoomById = async (roomId) => {
  if (USE_MOCK_API) {
    await delay();
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) {
      throw new Error(`Room with ID ${roomId} not found`);
    }
    return { ...room };
  }
  
  const response = await apiCall(`/admin/rooms/${roomId}`);
  return response.data;
};

/**
 * Get all campuses (for dropdown)
 * @returns {Promise<Array>} Array of campus objects
 */
export const getCampuses = async () => {
  if (USE_MOCK_API) {
    await delay(300);
    return [...campusData];
  }
  
  const response = await apiCall('/admin/campuses');
  return response.data;
};

/**
 * Get buildings by campus ID (for dropdown)
 * @param {number} campusId - The campus ID
 * @returns {Promise<Array>} Array of building objects
 */
export const getBuildings = async (campusId = null) => {
  if (USE_MOCK_API) {
    await delay(300);
    return [];
  }
  
  const endpoint = campusId ? `/admin/buildings/campus/${campusId}` : '/admin/buildings';
  const response = await apiCall(endpoint);
  return response.data;
};

/**
 * Create a new room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = async (roomData) => {
  if (USE_MOCK_API) {
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
  }
  
  const response = await apiCall('/admin/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  });
  return response.data;
};

/**
 * Update an existing room
 * @param {number} roomId - The room ID
 * @param {Object} roomData - Updated room data
 * @returns {Promise<Object>} Updated room object
 */
export const updateRoom = async (roomId, roomData) => {
  if (USE_MOCK_API) {
    await delay(600);
    const index = rooms.findIndex(r => r.room_id === roomId);
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
  }
  
  const response = await apiCall(`/admin/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  });
  return response.data;
};

/**
 * Delete a room
 * @param {number} roomId - The room ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteRoom = async (roomId) => {
  if (USE_MOCK_API) {
    await delay(400);
    const index = rooms.findIndex(r => r.room_id === roomId);
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
  }
  
  const response = await apiCall(`/admin/rooms/${roomId}`, {
    method: 'DELETE',
  });
  return response;
};

/**
 * Get room statistics
 * @param {number} campusId - Optional campus ID to filter stats
 * @returns {Promise<Object>} Room statistics
 */
export const getRoomStats = async (campusId = null) => {
  if (USE_MOCK_API) {
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
  }
  
  const url = campusId ? `/admin/rooms/stats?campus_id=${campusId}` : '/admin/rooms/stats';
  const response = await apiCall(url);
  return response.data;
};

/**
 * Get rooms with over-capacity issues
 * @returns {Promise<Array>} Array of over-capacity rooms
 */
export const getOverCapacityRooms = async () => {
  if (USE_MOCK_API) {
    await delay();
    return rooms.filter(r => r.current_occupancy > r.capacity);
  }
  
  const response = await apiCall('/admin/rooms/overcapacity');
  return response.data;
};

/**
 * Get rooms with low utilization
 * @param {number} threshold - Utilization threshold percentage (default 30)
 * @returns {Promise<Array>} Array of underutilized rooms
 */
export const getUnderutilizedRooms = async (threshold = 30) => {
  if (USE_MOCK_API) {
    await delay();
    return rooms.filter(r => {
      if (r.capacity === 0) return false;
      const utilization = (r.current_occupancy / r.capacity) * 100;
      return utilization < threshold && r.status === 'occupied';
    });
  }
  
  const response = await apiCall(`/admin/rooms/underutilized?threshold=${threshold}`);
  return response.data;
};
