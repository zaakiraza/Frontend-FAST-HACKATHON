// Building API
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

export const getBuildingById = async (buildingId) => {
  try {
    const response = await apiCall(`/buildings/${buildingId}`);
    return response.data || response;
  } catch (error) {
    console.warn('Building endpoint not available');
    return null;
  }
};

export const createBuilding = async (buildingData) => {
  // Map frontend field names to backend expected names
  const payload = {
    name: buildingData.name,
    code: buildingData.code,
    campusId: buildingData.campus_uid, // Backend expects campusId
    totalRooms: buildingData.totalRooms,
    totalCapacity: buildingData.totalCapacity,
    status: buildingData.status
  };
  
  const response = await apiCall('/buildings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.data || response;
};

export const updateBuilding = async (buildingId, buildingData) => {
  // Map frontend field names to backend expected names
  const payload = {
    name: buildingData.name,
    code: buildingData.code,
    campusId: buildingData.campus_uid, // Backend expects campusId
    totalRooms: buildingData.totalRooms,
    totalCapacity: buildingData.totalCapacity,
    status: buildingData.status
  };
  
  const response = await apiCall(`/buildings/${buildingId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data || response;
};

export const deleteBuilding = async (buildingId) => {
  const response = await apiCall(`/buildings/${buildingId}`, {
    method: 'DELETE',
  });
  return response;
};

export const getBuildingStats = async (buildingId) => {
  try {
    const response = await apiCall(`/buildings/${buildingId}/stats`);
    return response.data || response;
  } catch (error) {
    console.warn('Building stats endpoint not available');
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
