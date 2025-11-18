const MaintenanceModel = require('../models/maintenanceModel');

const MaintenanceController = {
  // GET /api/maintenance/summary
  async getMaintenanceSummary(req, res) {
    try {
      const summary = await MaintenanceModel.getSummary();
      res.json(summary);
    } catch (error) {
      console.error('Error fetching maintenance summary:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch maintenance summary',
        error: error.message 
      });
    }
  },

  // GET /api/maintenance/tickets?filter=all
  async getAllTickets(req, res) {
    try {
      const { filter = 'all' } = req.query;
      const tickets = await MaintenanceModel.getAllTickets(filter);
      res.json(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch tickets',
        error: error.message 
      });
    }
  },

  // GET /api/maintenance/tickets/priority/:priority
  async getTicketsByPriority(req, res) {
    try {
      const { priority } = req.params;
      const tickets = await MaintenanceModel.getTicketsByPriority(priority);
      res.json(tickets);
    } catch (error) {
      console.error('Error fetching tickets by priority:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch tickets by priority',
        error: error.message 
      });
    }
  },

  // GET /api/maintenance/tickets/:id
  async getTicketDetails(req, res) {
    try {
      const { id } = req.params;
      const ticket = await MaintenanceModel.getTicketDetails(id);
      
      if (!ticket) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ticket not found' 
        });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch ticket details',
        error: error.message 
      });
    }
  },

  // POST /api/maintenance/tickets
  async createTicket(req, res) {
    try {
      const ticketData = req.body;
      
      // Validate required fields
      if (!ticketData.title || !ticketData.building || !ticketData.priority) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: title, building, priority' 
        });
      }
      
      const newTicket = await MaintenanceModel.createTicket(ticketData);
      res.status(201).json({ 
        success: true, 
        message: 'Ticket created successfully',
        ticket: newTicket 
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create ticket',
        error: error.message 
      });
    }
  },

  // PATCH /api/maintenance/tickets/:id/status
  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ 
          success: false, 
          message: 'Status is required' 
        });
      }
      
      const updatedTicket = await MaintenanceModel.updateTicketStatus(id, status);
      
      if (!updatedTicket) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ticket not found' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Ticket status updated',
        ticket: updatedTicket 
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update ticket status',
        error: error.message 
      });
    }
  },

  // PATCH /api/maintenance/tickets/:id/assign
  async assignTicket(req, res) {
    try {
      const { id } = req.params;
      const { assignee } = req.body;
      
      if (!assignee) {
        return res.status(400).json({ 
          success: false, 
          message: 'Assignee is required' 
        });
      }
      
      const updatedTicket = await MaintenanceModel.assignTicket(id, assignee);
      
      if (!updatedTicket) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ticket not found' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Ticket assigned successfully',
        ticket: updatedTicket 
      });
    } catch (error) {
      console.error('Error assigning ticket:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to assign ticket',
        error: error.message 
      });
    }
  }
};

module.exports = MaintenanceController;
