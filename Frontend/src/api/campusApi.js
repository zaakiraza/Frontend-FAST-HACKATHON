// Campus API - Mock implementation
import { campusData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let campuses = [...campusData];
let nextCampusId = Math.max(...campuses.map(c => c.id)) + 1;

/**
 * Get all campuses
 * @returns {Promise<Array>} Array of campus objects
 */
export const getCampuses = async () => {
  await delay();
  return [...campuses];
};

/**
 * Get a single campus by ID
 * @param {number} campusId - The campus ID
 * @returns {Promise<Object>} Campus object
 */
export const getCampusById = async (campusId) => {
  await delay();
  const campus = campuses.find(c => c.id === campusId);
  if (!campus) {
    throw new Error(`Campus with ID ${campusId} not found`);
  }
  return { ...campus };
};

/**
 * Create a new campus
 * @param {Object} campusData - Campus data
 * @param {string} campusData.name - Campus name
 * @param {string} campusData.location - Campus location
 * @param {number} campusData.area_sqm - Area in square meters
 * @param {number} campusData.building_count - Number of buildings
 * @param {number} campusData.total_capacity - Total capacity
 * @param {number} campusData.energy_baseline_kwh - Energy baseline in kWh
 * @param {string} campusData.status - Status (active/inactive/maintenance)
 * @returns {Promise<Object>} Created campus object
 */
export const createCampus = async (campusData) => {
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
};

/**
 * Update an existing campus
 * @param {number} campusId - The campus ID
 * @param {Object} campusData - Updated campus data
 * @returns {Promise<Object>} Updated campus object
 */
export const updateCampus = async (campusId, campusData) => {
  await delay(600);
  
  const index = campuses.findIndex(c => c.id === campusId);
  if (index === -1) {
    throw new Error(`Campus with ID ${campusId} not found`);
  }
  
  campuses[index] = {
    ...campuses[index],
    name: campusData.name || campuses[index].name,
    location: campusData.location || campuses[index].location,
    area_sqm: parseFloat(campusData.area_sqm) || campuses[index].area_sqm,
    building_count: parseInt(campusData.building_count) || campuses[index].building_count,
    total_capacity: parseInt(campusData.total_capacity) || campuses[index].total_capacity,
    energy_baseline_kwh: parseFloat(campusData.energy_baseline_kwh) || campuses[index].energy_baseline_kwh,
    status: campusData.status || campuses[index].status,
    updated_at: new Date().toISOString()
  };
  
  return { ...campuses[index] };
};

/**
 * Delete a campus
 * @param {number} campusId - The campus ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteCampus = async (campusId) => {
  await delay(400);
  
  const index = campuses.findIndex(c => c.id === campusId);
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
};

/**
 * Get campus statistics
 * @returns {Promise<Object>} Campus statistics
 */
export const getCampusStats = async () => {
  await delay();
  
  return {
    total_campuses: campuses.length,
    active_campuses: campuses.filter(c => c.status === 'active').length,
    total_buildings: campuses.reduce((sum, c) => sum + c.building_count, 0),
    total_capacity: campuses.reduce((sum, c) => sum + c.total_capacity, 0),
    total_area_sqm: campuses.reduce((sum, c) => sum + c.area_sqm, 0),
    total_energy_baseline: campuses.reduce((sum, c) => sum + c.energy_baseline_kwh, 0)
  };
};
