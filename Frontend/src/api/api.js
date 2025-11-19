// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const { includeAuth = true, ...fetchOptions } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...createHeaders(includeAuth),
        ...fetchOptions.headers,
      },
    });

    const data = await response.json();

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      localStorage.removeItem('roles');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API methods
export const api = {
  // GET request
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),

  // POST request
  post: (endpoint, body) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PATCH request
  patch: (endpoint, body) =>
    apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // PUT request
  put: (endpoint, body) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // DELETE request
  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: 'DELETE',
    }),
};

// Auth API
export const authApi = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    }),

  getProfile: () => api.get('/auth/profile'),

  changePassword: (passwords) => api.post('/auth/change-password', passwords),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getAlerts: () => api.get('/dashboard/alerts'),
};

// Energy API
export const energyApi = {
  getSummary: () => api.get('/energy/summary'),
  getBuildings: () => api.get('/energy/buildings'),
  getTimeSeries: (buildingId, timeRange = '24h') =>
    api.get(`/energy/timeseries/${buildingId}?timeRange=${timeRange}`),
  getAnomalies: () => api.get('/energy/anomalies'),
  getBuildingDetail: (buildingId) => api.get(`/energy/buildings/${buildingId}`),
};

// Maintenance API
export const maintenanceApi = {
  getSummary: () => api.get('/maintenance/summary'),
  getAllTickets: (filter) => {
    const params = new URLSearchParams(filter);
    return api.get(`/maintenance/tickets?${params}`);
  },
  getTicketsByPriority: (priority) =>
    api.get(`/maintenance/tickets/priority/${priority}`),
  getTicketDetails: (ticketId) => api.get(`/maintenance/tickets/${ticketId}`),
  createTicket: (ticketData) => api.post('/maintenance/tickets', ticketData),
  updateTicketStatus: (ticketId, status) =>
    api.patch(`/maintenance/tickets/${ticketId}/status`, { status }),
  assignTicket: (ticketId, assignee) =>
    api.patch(`/maintenance/tickets/${ticketId}/assign`, { assignee }),
};

// Space API
export const spaceApi = {
  getSummary: () => api.get('/space/summary'),
  getOccupancy: (filter) => {
    const params = new URLSearchParams(filter);
    return api.get(`/space/occupancy?${params}`);
  },
  getHeatmap: () => api.get('/space/heatmap'),
  getSuggestions: () => api.get('/space/suggestions'),
  getOccupancyByBuilding: (buildingName) =>
    api.get(`/space/occupancy/${buildingName}`),
  getRoomDetails: (roomName) => api.get(`/space/rooms/${roomName}`),
};

// User Management API
export const userApi = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters);
    return api.get(`/users?${params}`);
  },
  getById: (userId) => api.get(`/users/${userId}`),
  update: (userId, userData) => api.patch(`/users/${userId}`, userData),
  updatePassword: (userId, password) =>
    api.patch(`/users/${userId}/password`, { password }),
  updateStatus: (userId, isActive) =>
    api.patch(`/users/${userId}/status`, { is_active: isActive }),
  delete: (userId) => api.delete(`/users/${userId}`),
  getRoles: (userId) => api.get(`/users/${userId}/roles`),
};

// Role Management API
export const roleApi = {
  getAll: () => api.get('/roles'),
  getById: (roleId) => api.get(`/roles/${roleId}`),
  create: (roleData) => api.post('/roles', roleData),
  update: (roleId, roleData) => api.patch(`/roles/${roleId}`, roleData),
  delete: (roleId) => api.delete(`/roles/${roleId}`),
  assignPermission: (roleId, permissionId) =>
    api.post(`/roles/${roleId}/permissions`, { permission_id: permissionId }),
  syncPermissions: (roleId, permissionIds) =>
    api.put(`/roles/${roleId}/permissions`, { permission_ids: permissionIds }),
  assignToUser: (roleId, userId) =>
    api.post(`/roles/${roleId}/users`, { user_id: userId }),
  syncUserRoles: (userId, roleIds) =>
    api.put(`/roles/users/${userId}/sync`, { role_ids: roleIds }),
};

// Permission Management API
export const permissionApi = {
  getAll: () => api.get('/permissions'),
  getModules: () => api.get('/permissions/modules'),
  getByModule: (moduleId) => api.get(`/permissions/modules/${moduleId}`),
  getById: (permissionId) => api.get(`/permissions/${permissionId}`),
  assignToUser: (userId, permissionId) =>
    api.post(`/permissions/users/${userId}`, { permission_id: permissionId }),
  removeFromUser: (userId, permissionId) =>
    api.delete(`/permissions/users/${userId}/${permissionId}`),
  getUserDirectPermissions: (userId) =>
    api.get(`/permissions/users/${userId}/direct`),
};

export default api;
