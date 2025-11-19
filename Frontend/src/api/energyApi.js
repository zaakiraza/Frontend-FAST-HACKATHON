import { API_BASE_URL } from '../config/apiConfig';

// API call helper
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
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Get energy summary
export async function getEnergySummary() {
  const response = await apiCall('/energy/summary');
  return response;
}

// Get list of buildings
export async function getBuildings() {
  const response = await apiCall('/energy/buildings');
  return response;
}

// Get energy time series data
export async function getEnergyTimeSeries(buildingId = null, timeRange = 'hourly') {
  try {
    const params = new URLSearchParams();
    if (buildingId) params.append('buildingId', buildingId);
    if (timeRange) params.append('timeRange', timeRange);
    const url = `/energy/timeseries${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Requesting energy timeseries:', url, { buildingId, timeRange });
    const response = await apiCall(url);
    console.log('Energy timeseries response:', response);
    return response;
  } catch (error) {
    console.error('Energy timeseries API error:', error);
    // Return empty array instead of throwing error
    return [];
  }
}

// Get energy anomalies
export async function getEnergyAnomalies(page = 1, limit = 10) {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  const response = await apiCall(`/energy/anomalies?${params.toString()}`);
  return response;
}

// Get detailed energy data for a specific building
export async function getBuildingEnergyDetail(buildingId) {
  const response = await apiCall(`/energy/building/${buildingId}`);
  return response;
}
