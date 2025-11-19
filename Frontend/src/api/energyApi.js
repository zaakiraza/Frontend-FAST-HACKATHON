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
  const params = new URLSearchParams();
  if (buildingId) params.append('building_id', buildingId);
  if (timeRange) params.append('time_range', timeRange);
  const url = `/energy/timeseries${params.toString() ? '?' + params.toString() : ''}`;
  const response = await apiCall(url);
  return response;
}

// Get energy anomalies
export async function getEnergyAnomalies() {
  const response = await apiCall('/energy/anomalies');
  return response;
}

// Get detailed energy data for a specific building
export async function getBuildingEnergyDetail(buildingId) {
  const response = await apiCall(`/energy/building/${buildingId}`);
  return response;
}
