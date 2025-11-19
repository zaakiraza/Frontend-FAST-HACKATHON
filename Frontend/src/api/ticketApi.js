// Ticket API
import { API_BASE_URL } from '../config/apiConfig';

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

export const getTickets = async (filters = {}) => {
  // Use existing maintenance API endpoint
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
  // No campus endpoint - return empty for now
  return [];
};

export const createTicket = async (ticketData) => {
  // Use existing maintenance API endpoint
  const response = await apiCall('/maintenance/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
  return response.ticket || response.data || response;
};

export const updateTicket = async (ticketId, ticketData) => {
  // Backend only has PATCH for status and assign, not full update
  if (ticketData.status) {
    const response = await apiCall(`/maintenance/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ticketData.status }),
    });
    return response.ticket || response.data || response;
  }
  throw new Error('Full ticket update not implemented. Use status/assign endpoints.');
};

export const deleteTicket = async (ticketId) => {
  throw new Error('Ticket deletion not implemented on backend. Contact backend team.');
};

export const getTicketStats = async (campusId = null) => {
  // Calculate from existing ticket data
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
