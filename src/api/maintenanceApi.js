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

// Get maintenance summary
export async function getMaintenanceSummary() {
  const response = await apiCall('/maintenance/summary');
  return response;
}

// Get all tickets
export async function getAllTickets(filter = 'all') {
  const url = filter !== 'all' ? `/maintenance/tickets?filter=${filter}` : '/maintenance/tickets';
  const response = await apiCall(url);
  return response;
}

// Get tickets by priority
export async function getTicketsByPriority(priority) {
  const response = await apiCall(`/maintenance/tickets/priority/${priority}`);
  return response;
}

// Get ticket details
export async function getTicketDetails(ticketId) {
  const response = await apiCall(`/maintenance/tickets/${ticketId}`);
  return response;
}

// Create new ticket
export async function createTicket(ticketData) {
  const response = await apiCall('/maintenance/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
  return response;
}

// Update ticket status
export async function updateTicketStatus(ticketId, newStatus) {
  const response = await apiCall(`/maintenance/tickets/${ticketId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });
  return response;
}

// Assign ticket
export async function assignTicket(ticketId, assignee) {
  const response = await apiCall(`/maintenance/tickets/${ticketId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignee }),
  });
  return response;
}
