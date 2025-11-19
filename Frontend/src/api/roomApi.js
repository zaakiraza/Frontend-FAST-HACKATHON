// Room API
import { API_BASE_URL } from '../config/apiConfig';

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

export const getRooms = async (filters = {}) => {
  // Use existing space API endpoint
  const response = await apiCall('/space/occupancy');
  return Array.isArray(response) ? response : response.data || [];
};

export const getRoomById = async (roomId) => {
  // Get all rooms and filter by ID
  const rooms = await getRooms();
  return rooms.find(room => room.id === parseInt(roomId));
};

export const getCampuses = async () => {
  // No campus endpoint - return mock for now
  return [];
};

export const getBuildings = async (campusId = null) => {
  // Use existing energy API endpoint for buildings
  const response = await apiCall('/energy/buildings');
  return Array.isArray(response) ? response : response.data || [];
};

export const createRoom = async (roomData) => {
  // Backend doesn't have admin endpoints yet
  throw new Error('Room creation not implemented on backend. Contact backend team.');
};

export const updateRoom = async (roomId, roomData) => {
  throw new Error('Room update not implemented on backend. Contact backend team.');
};

export const deleteRoom = async (roomId) => {
  throw new Error('Room deletion not implemented on backend. Contact backend team.');
};

export const getRoomStats = async (campusId = null) => {
  // Calculate from existing room data
  const rooms = await getRooms();
  return {
    total_rooms: rooms.length,
    occupied_rooms: rooms.filter(r => r.current_occupancy > 0).length,
    total_capacity: rooms.reduce((sum, r) => sum + (r.capacity || 0), 0),
    total_occupancy: rooms.reduce((sum, r) => sum + (r.current_occupancy || 0), 0),
  };
};

export const getOverCapacityRooms = async () => {
  const rooms = await getRooms();
  return rooms.filter(r => (r.current_occupancy / r.capacity) > 1);
};

export const getUnderutilizedRooms = async (threshold = 30) => {
  const rooms = await getRooms();
  return rooms.filter(r => (r.current_occupancy / r.capacity * 100) < threshold);
};
