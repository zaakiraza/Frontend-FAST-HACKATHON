// Campus API
import { USE_MOCK_API, API_BASE_URL } from '../config/apiConfig';
import { campusData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data state
let campuses = [...campusData];
let nextCampusId = Math.max(...campuses.map(c => c.campus_id)) + 1;

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
 * Get all campuses
 * @returns {Promise<Array>} Array of campus objects
 */
export const getCampuses = async () => {
  if (USE_MOCK_API) {
    await delay();
    return [...campuses];
  }
  
  const response = await apiCall('/admin/campuses');
  return response.data;
};

/**
 * Get a single campus by ID
 * @param {number} campusId - The campus ID
 * @returns {Promise<Object>} Campus object
 */
export const getCampusById = async (campusId) => {
  if (USE_MOCK_API) {
    await delay();
    const campus = campuses.find(c => c.campus_id === campusId);
    if (!campus) {
      throw new Error(`Campus with ID ${campusId} not found`);
    }
    return { ...campus };
  }
  
  const response = await apiCall(`/admin/campuses/${campusId}`);
  return response.data;
};

/**
 * Create a new campus
 * @param {Object} campusData - Campus data
 * @returns {Promise<Object>} Created campus object
 */
export const createCampus = async (campusData) => {
  if (USE_MOCK_API) {
    await delay(600);
    const newCampus = {
      campus_id: nextCampusId++,
      name: campusData.name,
      location: campusData.location,
      area_sqm: parseFloat(campusData.area_sqm) || 0,
      building_count: parseInt(campusData.building_count) || 0,
      total_capacity: parseInt(campusData.total_capacity) || 0,
      energy_baseline_kwh: parseFloat(campusData.energy_baseline_kwh) || 0,
      status: campusData.status || 'active',
      created_at: new Date().toISOString()
    };
    campuses.push(newCampus);
    return { ...newCampus };
  }
  
  const response = await apiCall('/admin/campuses', {
    method: 'POST',
    body: JSON.stringify(campusData),
  });
  return response.data;
};

/**
 * Update an existing campus
 * @param {number} campusId - The campus ID
 * @param {Object} campusData - Updated campus data
 * @returns {Promise<Object>} Updated campus object
 */
export const updateCampus = async (campusId, campusData) => {
  if (USE_MOCK_API) {
    await delay(600);
    const index = campuses.findIndex(c => c.campus_id === campusId);
    if (index === -1) {
      throw new Error(`Campus with ID ${campusId} not found`);
    }
    campuses[index] = {
      ...campuses[index],
      ...campusData,
      updated_at: new Date().toISOString()
    };
    return { ...campuses[index] };
  }
  
  const response = await apiCall(`/admin/campuses/${campusId}`, {
    method: 'PUT',
    body: JSON.stringify(campusData),
  });
  return response.data;
};

/**
 * Delete a campus
 * @param {number} campusId - The campus ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteCampus = async (campusId) => {
  if (USE_MOCK_API) {
    await delay(400);
    const index = campuses.findIndex(c => c.campus_id === campusId);
    if (index === -1) {
      throw new Error(`Campus with ID ${campusId} not found`);
    }
    const deletedCampus = campuses[index];
    campuses.splice(index, 1);
    return { 
      success: true, 
      message: `Campus "${deletedCampus.name}" deleted successfully`,
      deleted: deletedCampus
    };
  }
  
  return await apiCall(`/admin/campuses/${campusId}`, {
    method: 'DELETE',
  });
};

/**
 * Get campus statistics
 * @returns {Promise<Object>} Campus statistics
 */
export const getCampusStats = async () => {
  if (USE_MOCK_API) {
    await delay();
    return {
      total_campuses: campuses.length,
      active_campuses: campuses.filter(c => c.status === 'active').length,
      total_buildings: campuses.reduce((sum, c) => sum + c.building_count, 0),
      total_capacity: campuses.reduce((sum, c) => sum + c.total_capacity, 0),
      total_area_sqm: campuses.reduce((sum, c) => sum + c.area_sqm, 0),
      total_energy_baseline: campuses.reduce((sum, c) => sum + c.energy_baseline_kwh, 0)
    };
  }
  
  // Real API doesn't have a general stats endpoint, so we calculate from all campuses
  const response = await apiCall('/admin/campuses');
  const campuses = response.data;
  return {
    total_campuses: campuses.length,
    active_campuses: campuses.filter(c => c.status === 'active').length,
    total_buildings: campuses.reduce((sum, c) => sum + (c.building_count || 0), 0),
    total_capacity: campuses.reduce((sum, c) => sum + (c.total_capacity || 0), 0),
    total_area_sqm: campuses.reduce((sum, c) => sum + (c.area_sqm || 0), 0),
    total_energy_baseline: campuses.reduce((sum, c) => sum + (c.energy_baseline_kwh || 0), 0)
  };
};
