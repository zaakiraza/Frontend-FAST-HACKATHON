// Ticket API
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

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

export const getTickets = async (filters = {}) => {
  const filter = filters.status || 'all';
  const url = filter !== 'all' ? `/maintenance/tickets?filter=${filter}` : '/maintenance/tickets';
  const response = await apiCall(url);
  return Array.isArray(response) ? response : response.data || [];
};

export const getTicketById = async (ticketId) => {
  const response = await apiCall(`/maintenance/tickets/${ticketId}`);
  return response.ticket || response.data || response;
};

export const getCampuses = async () => {
  return await apiCall('/campuses');
};

export const createTicket = async (ticketData) => {
  const response = await apiCall('/maintenance/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
  return response.ticket || response.data || response;
};

export const updateTicket = async (ticketId, ticketData) => {
  // Use PUT for full update
  const response = await apiCall(`/maintenance/tickets/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify(ticketData),
  });
  return response.ticket || response.data || response;
};

export const deleteTicket = async (ticketId) => {
  return await apiCall(`/maintenance/tickets/${ticketId}`, {
    method: 'DELETE',
  });
};

export const getTicketStats = async (campusId = null) => {
  const tickets = await getTickets();
  return {
    total_tickets: tickets.length,
    open_tickets: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    high_priority: tickets.filter(t => t.priority === 'high').length,
  };
};

export const getHighPriorityTickets = async () => {
  const tickets = await getTickets();
  return tickets.filter(t => t.priority === 'high');
};

export const getUnassignedTickets = async () => {
  const tickets = await getTickets();
  return tickets.filter(t => !t.assigned_to || t.assigned_to === 'Unassigned');
};
