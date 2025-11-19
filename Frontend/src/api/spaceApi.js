import { spaceData } from './mockData';
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

// Get space utilization summary
export async function getSpaceSummary() {
  if (USE_MOCK_API) {
    await delay();
    return spaceData.summary;
  }
  
  const response = await apiCall('/space/summary');
  return response;
}

// Get current occupancy data
export async function getSpaceOccupancy(filter = 'all') {
  if (USE_MOCK_API) {
    await delay();
    if (filter === 'all') {
      return spaceData.occupancy;
    }
    return spaceData.occupancy.filter(room => room.status === filter);
  }
  
  const url = filter !== 'all' ? `/space/occupancy?filter=${filter}` : '/space/occupancy';
  const response = await apiCall(url);
  return response;
}

// Get space heatmap data
export async function getSpaceHeatmap() {
  if (USE_MOCK_API) {
    await delay();
    return spaceData.heatmap;
  }
  
  const response = await apiCall('/space/heatmap');
  return response;
}

// Get optimization suggestions
export async function getSpaceSuggestions() {
  if (USE_MOCK_API) {
    await delay();
    return spaceData.suggestions;
  }
  
  const response = await apiCall('/space/suggestions');
  return response;
}

// Get occupancy by building
export async function getOccupancyByBuilding(buildingName) {
  if (USE_MOCK_API) {
    await delay();
    return spaceData.occupancy.filter(room => room.building === buildingName);
  }
  
  const response = await apiCall(`/space/building/${encodeURIComponent(buildingName)}`);
  return response;
}

// Get room details
export async function getRoomDetails(roomName) {
  if (USE_MOCK_API) {
    await delay();
    const room = spaceData.occupancy.find(r => r.room === roomName);
    if (room) {
      return {
        ...room,
        history: [
          { time: '08:00', occupancy: Math.floor(room.current * 0.3) },
          { time: '09:00', occupancy: Math.floor(room.current * 0.6) },
          { time: '10:00', occupancy: Math.floor(room.current * 0.9) },
          { time: '11:00', occupancy: room.current },
          { time: '12:00', occupancy: Math.floor(room.current * 0.8) }
        ]
      };
    }
    return null;
  }
  
  const response = await apiCall(`/space/room/${encodeURIComponent(roomName)}`);
  return response;
}
