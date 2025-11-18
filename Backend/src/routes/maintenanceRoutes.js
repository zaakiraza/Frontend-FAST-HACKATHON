const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');

// Maintenance routes
router.get('/summary', MaintenanceController.getMaintenanceSummary);
router.get('/tickets', MaintenanceController.getAllTickets);
router.get('/tickets/priority/:priority', MaintenanceController.getTicketsByPriority);
router.get('/tickets/:id', MaintenanceController.getTicketDetails);
router.post('/tickets', MaintenanceController.createTicket);
router.patch('/tickets/:id/status', MaintenanceController.updateTicketStatus);
router.patch('/tickets/:id/assign', MaintenanceController.assignTicket);

module.exports = router;
