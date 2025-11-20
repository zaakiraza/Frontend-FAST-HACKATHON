// Room API
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getRooms = async (filters = {}) => {
  try {
    const endpoint = filters.buildingId ? `/rooms?buildingId=${filters.buildingId}` : '/rooms';
    const response = await apiCall(endpoint);
    return response.data || response;
  } catch (error) {
    // Fallback to existing space API endpoint
    console.warn('Rooms endpoint not available, using space API');
    const response = await apiCall('/space/occupancy');
    return Array.isArray(response) ? response : response.data || [];
  }
};

export const getRoomById = async (roomId) => {
  try {
    const response = await apiCall(`/rooms/${roomId}`);
    return response.data || response;
  } catch (error) {
    console.warn('Room endpoint not available');
    return null;
  }
};

export const getCampuses = async () => {
  try {
    const response = await apiCall('/campuses');
    return response.data || response;
  } catch (error) {
    console.warn('Campuses endpoint not available');
    return [];
  }
};

export const getBuildings = async (campusId = null) => {
  try {
    const endpoint = campusId ? `/buildings?campusUid=${campusId}` : '/buildings';
    const response = await apiCall(endpoint);
    return response.data || response;
  } catch (error) {
    // Fallback to energy API
    console.warn('Buildings endpoint not available, using energy API');
    const response = await apiCall('/energy/buildings');
    return Array.isArray(response) ? response : response.data || [];
  }
};

export const createRoom = async (roomData) => {
  // Map frontend field names to backend expected names
  const payload = {
    roomNumber: roomData.room_number || roomData.roomNumber,
    name: roomData.room_name || roomData.name,
    buildingId: roomData.building_id || roomData.building_uid, // Controller expects buildingId
    building_uid: roomData.building_id || roomData.building_uid, // Model expects building_uid
    type: roomData.room_type || roomData.type,
    floor: roomData.floor,
    capacity: roomData.capacity,
    currentOccupancy: roomData.current_occupancy || roomData.currentOccupancy,
    status: roomData.status
  };
  
  const response = await apiCall('/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data || response;
};

export const updateRoom = async (roomId, roomData) => {
  // Map frontend field names to backend expected names
  const payload = {
    roomNumber: roomData.room_number || roomData.roomNumber,
    name: roomData.room_name || roomData.name,
    buildingId: roomData.building_id || roomData.building_uid, // Controller expects buildingId
    building_uid: roomData.building_id || roomData.building_uid, // Model expects building_uid
    type: roomData.room_type || roomData.type,
    floor: roomData.floor,
    capacity: roomData.capacity,
    currentOccupancy: roomData.current_occupancy || roomData.currentOccupancy,
    status: roomData.status
  };
  
  const response = await apiCall(`/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data || response;
};

export const deleteRoom = async (roomId) => {
  const response = await apiCall(`/rooms/${roomId}`, {
    method: 'DELETE',
  });
  return response;
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
