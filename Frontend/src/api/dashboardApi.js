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

// Mock data for development
const mockDashboardStats = {
  totalCampuses: 4,
  totalBuildings: 8,
  totalRooms: 12,
  totalTickets: 7,
  openTickets: 3,
  energyConsumption: 145000,
  roomUtilization: 72.5,
  maintenanceCost: 12500
};

const mockAlerts = [
  {
    id: 1,
    type: 'energy',
    severity: 'high',
    title: 'High Energy Consumption',
    message: 'Building A showing 25% increase in energy usage',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'maintenance',
    severity: 'critical',
    title: 'Urgent Maintenance Required',
    message: 'HVAC system failure in Science Building',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    type: 'space',
    severity: 'medium',
    title: 'Room Over Capacity',
    message: 'Lecture Hall 301 exceeding capacity limits',
    timestamp: new Date().toISOString()
  }
];

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function getDashboardStats() {
  if (USE_MOCK_API) {
    await delay();
    return mockDashboardStats;
  }
  
  const response = await apiCall('/dashboard/stats');
  return response;
}

/**
 * Get recent alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export async function getRecentAlerts() {
  if (USE_MOCK_API) {
    await delay();
    return mockAlerts;
  }
  
  const response = await apiCall('/dashboard/alerts');
  return response;
}
