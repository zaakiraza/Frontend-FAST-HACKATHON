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

// Get space utilization summary
export async function getSpaceSummary() {
  const response = await apiCall('/space/summary');
  return response;
}

// Get current occupancy data
export async function getSpaceOccupancy(filter = 'all') {
  const url = filter !== 'all' ? `/space/occupancy?filter=${filter}` : '/space/occupancy';
  const response = await apiCall(url);
  return response;
}

// Get space heatmap data
export async function getSpaceHeatmap() {
  const response = await apiCall('/space/heatmap');
  return response;
}

// Get optimization suggestions
export async function getSpaceSuggestions() {
  const response = await apiCall('/space/suggestions');
  return response;
}

// Get occupancy by building
export async function getOccupancyByBuilding(buildingName) {
  const response = await apiCall(`/space/building/${encodeURIComponent(buildingName)}`);
  return response;
}

// Get room details
export async function getRoomDetails(roomName) {
  const response = await apiCall(`/space/room/${encodeURIComponent(roomName)}`);
  return response;
}
