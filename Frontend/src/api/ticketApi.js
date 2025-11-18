// Ticket API - Mock implementation
import { ticketData, campusData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let tickets = [...ticketData];
let nextTicketId = Math.max(...tickets.map(t => t.ticket_id)) + 1;

/**
 * Get all tickets with optional filtering
 * @param {Object} filters - Optional filters
 * @param {number} filters.campus_id - Filter by campus ID
 * @param {string} filters.priority - Filter by priority
 * @param {string} filters.status - Filter by status
 * @param {string} filters.category - Filter by category
 * @returns {Promise<Array>} Array of ticket objects
 */
export const getTickets = async (filters = {}) => {
  await delay();
  
  let filteredTickets = [...tickets];
  
  if (filters.campus_id) {
    filteredTickets = filteredTickets.filter(t => t.campus_id === parseInt(filters.campus_id));
  }
  
  if (filters.priority) {
    filteredTickets = filteredTickets.filter(t => t.priority === filters.priority);
  }
  
  if (filters.status) {
    filteredTickets = filteredTickets.filter(t => t.status === filters.status);
  }
  
  if (filters.category) {
    filteredTickets = filteredTickets.filter(t => t.category === filters.category);
  }
  
  // Sort by created_at descending (newest first)
  filteredTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  return filteredTickets;
};

/**
 * Get a single ticket by ID
 * @param {number} ticketId - The ticket ID
 * @returns {Promise<Object>} Ticket object
 */
export const getTicketById = async (ticketId) => {
  await delay();
  const ticket = tickets.find(t => t.ticket_id === ticketId);
  if (!ticket) {
    throw new Error(`Ticket with ID ${ticketId} not found`);
  }
  return { ...ticket };
};

/**
 * Get all campuses (for dropdown)
 * @returns {Promise<Array>} Array of campus objects
 */
export const getCampuses = async () => {
  await delay(300);
  return [...campusData];
};

/**
 * Create a new ticket
 * @param {Object} ticketData - Ticket data
 * @param {number} ticketData.campus_id - Campus ID
 * @param {string} ticketData.title - Ticket title
 * @param {string} ticketData.description - Ticket description
 * @param {string} ticketData.category - Category (electrical/plumbing/hvac/structural/equipment/cleaning/security/other)
 * @param {string} ticketData.priority - Priority (low/medium/high/critical)
 * @param {string} ticketData.status - Status (open/in-progress/resolved/closed)
 * @param {string} ticketData.location - Location description
 * @param {string} ticketData.building - Building name
 * @param {string} ticketData.room - Room number
 * @param {string} ticketData.reported_by - Reporter name
 * @param {string} ticketData.assigned_to - Assignee name
 * @param {number} ticketData.estimated_cost - Estimated cost
 * @returns {Promise<Object>} Created ticket object
 */
export const createTicket = async (ticketData) => {
  await delay(600);
  
  const newTicket = {
    ticket_id: nextTicketId++,
    campus_id: parseInt(ticketData.campus_id),
    title: ticketData.title,
    description: ticketData.description,
    category: ticketData.category || 'other',
    priority: ticketData.priority || 'medium',
    status: ticketData.status || 'open',
    location: ticketData.location || '',
    building: ticketData.building || '',
    room: ticketData.room || '',
    reported_by: ticketData.reported_by || 'System',
    assigned_to: ticketData.assigned_to || 'Unassigned',
    estimated_cost: parseFloat(ticketData.estimated_cost) || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  tickets.push(newTicket);
  return { ...newTicket };
};

/**
 * Update an existing ticket
 * @param {number} ticketId - The ticket ID
 * @param {Object} ticketData - Updated ticket data
 * @returns {Promise<Object>} Updated ticket object
 */
export const updateTicket = async (ticketId, ticketData) => {
  await delay(600);
  
  const index = tickets.findIndex(t => t.ticket_id === ticketId);
  if (index === -1) {
    throw new Error(`Ticket with ID ${ticketId} not found`);
  }
  
  tickets[index] = {
    ...tickets[index],
    campus_id: parseInt(ticketData.campus_id) || tickets[index].campus_id,
    title: ticketData.title || tickets[index].title,
    description: ticketData.description || tickets[index].description,
    category: ticketData.category || tickets[index].category,
    priority: ticketData.priority || tickets[index].priority,
    status: ticketData.status || tickets[index].status,
    location: ticketData.location || tickets[index].location,
    building: ticketData.building || tickets[index].building,
    room: ticketData.room || tickets[index].room,
    reported_by: ticketData.reported_by || tickets[index].reported_by,
    assigned_to: ticketData.assigned_to || tickets[index].assigned_to,
    estimated_cost: parseFloat(ticketData.estimated_cost) || tickets[index].estimated_cost,
    updated_at: new Date().toISOString()
  };
  
  return { ...tickets[index] };
};

/**
 * Delete a ticket
 * @param {number} ticketId - The ticket ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteTicket = async (ticketId) => {
  await delay(400);
  
  const index = tickets.findIndex(t => t.ticket_id === ticketId);
  if (index === -1) {
    throw new Error(`Ticket with ID ${ticketId} not found`);
  }
  
  const deletedTicket = tickets[index];
  tickets.splice(index, 1);
  
  return { 
    success: true, 
    message: `Ticket "${deletedTicket.title}" deleted successfully`,
    deleted: deletedTicket
  };
};

/**
 * Get ticket statistics
 * @param {number} campusId - Optional campus ID to filter stats
 * @returns {Promise<Object>} Ticket statistics
 */
export const getTicketStats = async (campusId = null) => {
  await delay();
  
  let filteredTickets = tickets;
  if (campusId) {
    filteredTickets = tickets.filter(t => t.campus_id === campusId);
  }
  
  return {
    total_tickets: filteredTickets.length,
    by_priority: {
      critical: filteredTickets.filter(t => t.priority === 'critical').length,
      high: filteredTickets.filter(t => t.priority === 'high').length,
      medium: filteredTickets.filter(t => t.priority === 'medium').length,
      low: filteredTickets.filter(t => t.priority === 'low').length
    },
    by_status: {
      open: filteredTickets.filter(t => t.status === 'open').length,
      'in-progress': filteredTickets.filter(t => t.status === 'in-progress').length,
      resolved: filteredTickets.filter(t => t.status === 'resolved').length,
      closed: filteredTickets.filter(t => t.status === 'closed').length
    },
    by_category: {
      electrical: filteredTickets.filter(t => t.category === 'electrical').length,
      plumbing: filteredTickets.filter(t => t.category === 'plumbing').length,
      hvac: filteredTickets.filter(t => t.category === 'hvac').length,
      structural: filteredTickets.filter(t => t.category === 'structural').length,
      equipment: filteredTickets.filter(t => t.category === 'equipment').length,
      cleaning: filteredTickets.filter(t => t.category === 'cleaning').length,
      security: filteredTickets.filter(t => t.category === 'security').length,
      other: filteredTickets.filter(t => t.category === 'other').length
    },
    total_estimated_cost: filteredTickets.reduce((sum, t) => sum + t.estimated_cost, 0),
    avg_response_time: '2.3 hours' // Mock value
  };
};

/**
 * Get high priority tickets
 * @returns {Promise<Array>} Array of high and critical priority tickets
 */
export const getHighPriorityTickets = async () => {
  await delay();
  return tickets.filter(t => t.priority === 'high' || t.priority === 'critical');
};

/**
 * Get unassigned tickets
 * @returns {Promise<Array>} Array of unassigned tickets
 */
export const getUnassignedTickets = async () => {
  await delay();
  return tickets.filter(t => t.assigned_to === 'Unassigned' || t.assigned_to === '');
};
