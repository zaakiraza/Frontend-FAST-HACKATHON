import { maintenanceData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get maintenance summary
export async function getMaintenanceSummary() {
  await delay();
  return maintenanceData.summary;
}

// Get all tickets
export async function getAllTickets(filter = 'all') {
  await delay();
  
  if (filter === 'all') {
    return maintenanceData.tickets;
  }
  
  return maintenanceData.tickets.filter(ticket => ticket.status === filter);
}

// Get tickets by priority
export async function getTicketsByPriority(priority) {
  await delay();
  return maintenanceData.tickets.filter(ticket => ticket.priority === priority);
}

// Get ticket details
export async function getTicketDetails(ticketId) {
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

// Create new ticket
export async function createTicket(ticketData) {
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

// Update ticket status
export async function updateTicketStatus(ticketId, newStatus) {
  await delay();
  
  const ticket = maintenanceData.tickets.find(t => t.id === ticketId);
  if (ticket) {
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    
    // Update summary counts
    if (oldStatus === 'open') maintenanceData.summary.openTickets -= 1;
    if (oldStatus === 'in-progress') maintenanceData.summary.inProgress -= 1;
    if (newStatus === 'open') maintenanceData.summary.openTickets += 1;
    if (newStatus === 'in-progress') maintenanceData.summary.inProgress += 1;
    if (newStatus === 'resolved') maintenanceData.summary.resolved += 1;
    
    return ticket;
  }
  
  return null;
}

// Assign ticket
export async function assignTicket(ticketId, assignee) {
  await delay();
  
  const ticket = maintenanceData.tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.assignedTo = assignee;
    return ticket;
  }
  
  return null;
}
