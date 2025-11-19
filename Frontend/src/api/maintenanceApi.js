import { maintenanceData } from './mockData';
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

// Get maintenance summary
export async function getMaintenanceSummary() {
  if (USE_MOCK_API) {
    await delay();
    return maintenanceData.summary;
  }
  
  const response = await apiCall('/maintenance/summary');
  return response;
}

// Get all tickets
export async function getAllTickets(filter = 'all') {
  if (USE_MOCK_API) {
    await delay();
    if (filter === 'all') {
      return maintenanceData.tickets;
    }
    return maintenanceData.tickets.filter(ticket => ticket.status === filter);
  }
  
  const url = filter !== 'all' ? `/maintenance/tickets?filter=${filter}` : '/maintenance/tickets';
  const response = await apiCall(url);
  return response;
}

// Get tickets by priority
export async function getTicketsByPriority(priority) {
  if (USE_MOCK_API) {
    await delay();
    return maintenanceData.tickets.filter(ticket => ticket.priority === priority);
  }
  
  const response = await apiCall(`/maintenance/tickets/priority/${priority}`);
  return response;
}

// Get ticket details
export async function getTicketDetails(ticketId) {
  if (USE_MOCK_API) {
    await delay();
    const ticket = maintenanceData.tickets.find(t => t.id === ticketId);
    if (ticket) {
      return {
        ...ticket,
        updates: [
          {
            timestamp: ticket.createdAt,
            user: ticket.reportedBy,
            action: 'Ticket created',
            description: ticket.description
          },
          {
            timestamp: '2025-11-18 09:00:00',
            user: 'System',
            action: 'Ticket assigned',
            description: `Assigned to ${ticket.assignedTo}`
          }
        ]
      };
    }
    return null;
  }
  
  const response = await apiCall(`/maintenance/tickets/${ticketId}`);
  return response;
}

// Create new ticket
export async function createTicket(ticketData) {
  if (USE_MOCK_API) {
    await delay(800);
    const newTicket = {
      id: `MT-${Math.floor(Math.random() * 9000) + 1000}`,
      title: ticketData.title,
      building: ticketData.building,
      location: ticketData.location,
      priority: ticketData.priority,
      status: 'open',
      reportedBy: ticketData.reportedBy || 'User',
      assignedTo: 'Unassigned',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      description: ticketData.description
    };
    maintenanceData.tickets.unshift(newTicket);
    maintenanceData.summary.openTickets += 1;
    return newTicket;
  }
  
  const response = await apiCall('/maintenance/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
  return response;
}

// Update ticket status
export async function updateTicketStatus(ticketId, newStatus) {
  if (USE_MOCK_API) {
    await delay();
    const ticket = maintenanceData.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const oldStatus = ticket.status;
      ticket.status = newStatus;
      if (oldStatus === 'open') maintenanceData.summary.openTickets -= 1;
      if (oldStatus === 'in-progress') maintenanceData.summary.inProgress -= 1;
      if (newStatus === 'open') maintenanceData.summary.openTickets += 1;
      if (newStatus === 'in-progress') maintenanceData.summary.inProgress += 1;
      if (newStatus === 'resolved') maintenanceData.summary.resolved += 1;
      return ticket;
    }
    return null;
  }
  
  const response = await apiCall(`/maintenance/tickets/${ticketId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });
  return response;
}

// Assign ticket
export async function assignTicket(ticketId, assignee) {
  if (USE_MOCK_API) {
    await delay();
    const ticket = maintenanceData.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.assignedTo = assignee;
      return ticket;
    }
    return null;
  }
  
  const response = await apiCall(`/maintenance/tickets/${ticketId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignee }),
  });
  return response;
}
