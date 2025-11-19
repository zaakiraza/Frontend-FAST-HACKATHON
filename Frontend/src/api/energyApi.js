import { energyData } from './mockData';
import { USE_MOCK_API, API_BASE_URL } from '../config/apiConfig';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Get energy summary
export async function getEnergySummary() {
  if (USE_MOCK_API) {
    await delay();
    return energyData.summary;
  }
  
  const response = await apiCall('/energy/summary');
  return response;
}

// Get list of buildings
export async function getBuildings() {
  if (USE_MOCK_API) {
    await delay();
    return energyData.buildings;
  }
  
  const response = await apiCall('/energy/buildings');
  return response;
}

// Get energy time series data
export async function getEnergyTimeSeries(buildingId = null, timeRange = 'hourly') {
  if (USE_MOCK_API) {
    await delay();
    if (buildingId) {
      const building = energyData.buildings.find(b => b.id === buildingId);
      return {
        building: building?.name,
        data: energyData.timeSeriesData[timeRange].map(item => ({
          ...item,
          value: Math.floor(item.value * (0.8 + Math.random() * 0.4))
        }))
      };
    }
    return energyData.timeSeriesData[timeRange];
  }
  
  const params = new URLSearchParams();
  if (buildingId) params.append('building_id', buildingId);
  if (timeRange) params.append('time_range', timeRange);
  const url = `/energy/timeseries${params.toString() ? '?' + params.toString() : ''}`;
  const response = await apiCall(url);
  return response;
}

// Get energy anomalies
export async function getEnergyAnomalies() {
  if (USE_MOCK_API) {
    await delay();
    return energyData.anomalies;
  }
  
  const response = await apiCall('/energy/anomalies');
  return response;
}

// Get detailed energy data for a specific building
export async function getBuildingEnergyDetail(buildingId) {
  if (USE_MOCK_API) {
    await delay();
    const building = energyData.buildings.find(b => b.id === buildingId);
    return {
      building: building?.name,
      consumption: Math.floor(Math.random() * 50000 + 100000),
      cost: Math.floor(Math.random() * 15000 + 25000),
      efficiency: Math.floor(Math.random() * 20 + 75),
      anomalies: energyData.anomalies.filter(() => Math.random() > 0.5)
    };
  }
  
  const response = await apiCall(`/energy/building/${buildingId}`);
  return response;
}
