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

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function getDashboardStats() {
  const response = await apiCall('/dashboard/stats');
  return response;
}

/**
 * Get recent alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export async function getRecentAlerts() {
  const response = await apiCall('/dashboard/alerts');
  return response;
}
