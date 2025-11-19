// API Configuration
// Set USE_MOCK_API to false to use real backend APIs
export const USE_MOCK_API = false; // Change to false when backend is ready

export const API_BASE_URL = USE_MOCK_API
  ? "" // No base URL needed for mock
  : // : 'http://localhost:3000/api'; // Backend API URL
    "https://icms-e81d285c90c1.herokuapp.com/api"; // Backend API URL

// API endpoints
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
  DASHBOARD_ALERTS: "/dashboard/alerts",

  // Energy
  ENERGY_SUMMARY: "/energy/summary",
  ENERGY_BUILDINGS: "/energy/buildings",
  ENERGY_TIMESERIES: "/energy/timeseries",
  ENERGY_ANOMALIES: "/energy/anomalies",
  ENERGY_BUILDING_DETAIL: "/energy/building",

  // Space
  SPACE_SUMMARY: "/space/summary",
  SPACE_OCCUPANCY: "/space/occupancy",
  SPACE_HEATMAP: "/space/heatmap",
  SPACE_SUGGESTIONS: "/space/suggestions",

  // Maintenance
  MAINTENANCE_SUMMARY: "/maintenance/summary",
  MAINTENANCE_TICKETS: "/maintenance/tickets",
  MAINTENANCE_TICKET_DETAILS: "/maintenance/tickets",

  // Admin - Campuses
  ADMIN_CAMPUSES: "/admin/campuses",
  ADMIN_CAMPUS_BY_ID: "/admin/campuses",
  ADMIN_CAMPUS_STATS: "/admin/campuses",

  // Admin - Buildings
  ADMIN_BUILDINGS: "/admin/buildings",
  ADMIN_BUILDING_BY_ID: "/admin/buildings",
  ADMIN_BUILDINGS_BY_CAMPUS: "/admin/campuses",

  // Admin - Rooms
  ADMIN_ROOMS: "/admin/rooms",
  ADMIN_ROOM_BY_ID: "/admin/rooms",
  ADMIN_ROOMS_BY_BUILDING: "/admin/buildings",
  ADMIN_ROOM_STATS: "/admin/rooms/stats",
  ADMIN_ROOMS_OVERCAPACITY: "/admin/rooms/overcapacity",
  ADMIN_ROOMS_UNDERUTILIZED: "/admin/rooms/underutilized",

  // Admin - Tickets
  ADMIN_TICKETS: "/admin/tickets",
  ADMIN_TICKET_BY_ID: "/admin/tickets",
  ADMIN_TICKET_STATS: "/admin/tickets/stats",
  ADMIN_TICKETS_HIGH_PRIORITY: "/admin/tickets/high-priority",
  ADMIN_TICKETS_UNASSIGNED: "/admin/tickets/unassigned",
};

// Helper function to build full URL
export const buildUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;

  // Add query parameters if any
  const queryParams = new URLSearchParams(params).toString();
  if (queryParams) {
    url += `?${queryParams}`;
  }

  return url;
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  if (USE_MOCK_API) {
    throw new Error("Mock API should be handled by mock functions");
  }

  const url = buildUrl(endpoint);

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
