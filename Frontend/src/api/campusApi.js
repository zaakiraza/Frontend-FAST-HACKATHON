// Campus API
import { API_BASE_URL } from '../config/apiConfig';

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

export const getCampuses = async () => {
  // No campus endpoint exists - return empty array
  // Backend team needs to implement /api/campus or /api/admin/campuses
  return [];
};

export const getCampusById = async (campusId) => {
  return null;
};

export const createCampus = async (campusData) => {
  throw new Error('Campus creation not implemented on backend. Contact backend team.');
};

export const updateCampus = async (campusId, campusData) => {
  throw new Error('Campus update not implemented on backend. Contact backend team.');
};

export const deleteCampus = async (campusId) => {
  throw new Error('Campus deletion not implemented on backend. Contact backend team.');
};

export const getCampusStats = async () => {
  // Since no campus endpoint exists, calculate from buildings
  const buildingsResponse = await apiCall('/energy/buildings');
  const buildings = Array.isArray(buildingsResponse) ? buildingsResponse : buildingsResponse.data || [];
  
  return {
    total_campuses: 0,
    active_campuses: 0,
    total_buildings: buildings.length,
    total_capacity: 0,
    total_area_sqm: 0,
    total_energy_baseline: buildings.reduce((sum, b) => sum + (b.energy_consumption || 0), 0)
  };
};
