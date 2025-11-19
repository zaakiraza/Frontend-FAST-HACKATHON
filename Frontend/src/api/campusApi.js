// Campus API
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getCampuses = async () => {
  try {
    const response = await apiCall('/campuses');
    return response.data || response;
  } catch (error) {
    console.warn('Campus endpoint not available, returning empty array');
    return [];
  }
};

export const getCampusById = async (campusId) => {
  try {
    const response = await apiCall(`/campuses/${campusId}`);
    return response.data || response;
  } catch (error) {
    console.warn('Campus endpoint not available');
    return null;
  }
};

export const createCampus = async (campusData) => {
  const response = await apiCall('/campuses', {
    method: 'POST',
    body: JSON.stringify(campusData),
  });
  return response.data || response;
};

export const updateCampus = async (campusId, campusData) => {
  const response = await apiCall(`/campuses/${campusId}`, {
    method: 'PUT',
    body: JSON.stringify(campusData),
  });
  return response.data || response;
};

export const deleteCampus = async (campusId) => {
  const response = await apiCall(`/campuses/${campusId}`, {
    method: 'DELETE',
  });
  return response;
};

export const getCampusStats = async (campusId) => {
  try {
    const response = await apiCall(`/campuses/${campusId}/stats`);
    return response.data || response;
  } catch (error) {
    console.warn('Campus stats endpoint not available');
    return null;
  }
};
