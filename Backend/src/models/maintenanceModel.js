const db = require('../../db');

const MaintenanceModel = {
  // Get maintenance summary
  async getSummary() {
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'open' THEN 1 END) as openTickets,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as inProgress,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        CONCAT(
          ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, 
            CASE WHEN updated_at > created_at THEN updated_at ELSE NOW() END)) / 60, 1
          ), ' hours'
        ) as avgResponseTime
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    
    const [rows] = await db.query(query);
    return rows[0];
  },

  // Get all tickets with optional filter
  async getAllTickets(filter = 'all') {
    let query = `
      SELECT 
        CONCAT('MT-', LPAD(t.ticket_id, 4, '0')) as id,
        t.title,
        b.building_name as building,
        t.location,
        t.priority,
        t.status,
        t.reported_by as reportedBy,
        t.assigned_to as assignedTo,
        t.created_at as createdAt,
        t.description
      FROM tickets t
      JOIN buildings b ON t.building_id = b.building_id
    `;
    
    const params = [];
    
    if (filter !== 'all') {
      query += ' WHERE t.status = ?';
      params.push(filter);
    }
    
    query += ' ORDER BY t.created_at DESC';
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get tickets by priority
  async getTicketsByPriority(priority) {
    const query = `
      SELECT 
        CONCAT('MT-', LPAD(t.ticket_id, 4, '0')) as id,
        t.title,
        b.building_name as building,
        t.location,
        t.priority,
        t.status,
        t.reported_by as reportedBy,
        t.assigned_to as assignedTo,
        t.created_at as createdAt,
        t.description
      FROM tickets t
      JOIN buildings b ON t.building_id = b.building_id
      WHERE t.priority = ?
      ORDER BY t.created_at DESC
    `;
    
    const [rows] = await db.query(query, [priority]);
    return rows;
  },

  // Get ticket details
  async getTicketDetails(ticketId) {
    // Extract numeric ID from format like "MT-1001"
    const numericId = ticketId.replace(/^MT-/, '');
    
    const query = `
      SELECT 
        CONCAT('MT-', LPAD(t.ticket_id, 4, '0')) as id,
        t.title,
        b.building_name as building,
        t.location,
        t.priority,
        t.status,
        t.reported_by as reportedBy,
        t.assigned_to as assignedTo,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        t.description,
        t.category,
        t.estimated_cost as estimatedCost,
        r.room_number as room
      FROM tickets t
      JOIN buildings b ON t.building_id = b.building_id
      LEFT JOIN rooms r ON t.room_id = r.room_id
      WHERE t.ticket_id = ?
    `;
    
    const [rows] = await db.query(query, [numericId]);
    
    if (rows.length === 0) {
      return null;
    }

    const ticket = rows[0];
    
    // Add mock updates for now (you can create a ticket_updates table later)
    ticket.updates = [
      {
        timestamp: ticket.createdAt,
        user: ticket.reportedBy,
        action: 'Ticket created',
        description: ticket.description
      },
      {
        timestamp: ticket.updatedAt,
        user: 'System',
        action: 'Ticket assigned',
        description: `Assigned to ${ticket.assignedTo}`
      }
    ];
    
    return ticket;
  },

  // Create new ticket
  async createTicket(ticketData) {
    const query = `
      INSERT INTO tickets (
        building_id, room_id, title, description, category, priority, 
        status, location, reported_by, assigned_to, estimated_cost, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, 'Unassigned', ?, NOW(), NOW())
    `;
    
    const params = [
      ticketData.building_id,
      ticketData.room_id || null,
      ticketData.title,
      ticketData.description,
      ticketData.category || 'other',
      ticketData.priority,
      ticketData.location,
      ticketData.reportedBy || 'User',
      ticketData.estimatedCost || 0
    ];
    
    const [result] = await db.query(query, params);
    
    // Return the created ticket
    return await this.getTicketDetails(`MT-${result.insertId}`);
  },

  // Update ticket status
  async updateTicketStatus(ticketId, newStatus) {
    const numericId = ticketId.replace(/^MT-/, '');
    
    const query = `
      UPDATE tickets 
      SET status = ?, updated_at = NOW()
      WHERE ticket_id = ?
    `;
    
    await db.query(query, [newStatus, numericId]);
    
    return await this.getTicketDetails(ticketId);
  },

  // Assign ticket
  async assignTicket(ticketId, assignee) {
    const numericId = ticketId.replace(/^MT-/, '');
    
    const query = `
      UPDATE tickets 
      SET assigned_to = ?, updated_at = NOW()
      WHERE ticket_id = ?
    `;
    
    await db.query(query, [assignee, numericId]);
    
    return await this.getTicketDetails(ticketId);
  }
};

module.exports = MaintenanceModel;
