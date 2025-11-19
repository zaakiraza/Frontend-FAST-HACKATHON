import { apiCall } from '../config/apiConfig';

export const getProfile = async () => {
  const token = localStorage.getItem('authToken');
  const response = await apiCall('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateProfile = async (userData) => {
  const token = localStorage.getItem('authToken');
  const response = await apiCall('/auth/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  
  // Update stored user data
  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data;
};

export const changePassword = async (passwordData) => {
  const token = localStorage.getItem('authToken');
  const response = await apiCall('/auth/change-password', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });
  return response;
};
