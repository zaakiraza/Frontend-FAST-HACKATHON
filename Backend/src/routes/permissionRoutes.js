const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permissionController');
const { authenticate, hasPermission } = require('../middleware/authMiddleware');

// All permission routes require authentication
router.use(authenticate);

// Get all permissions grouped by module
router.get('/', hasPermission('roles.view'), PermissionController.getAllPermissions);

// Get all modules
router.get('/modules', hasPermission('roles.view'), PermissionController.getAllModules);

// Get permissions by module
router.get('/modules/:moduleId', hasPermission('roles.view'), PermissionController.getPermissionsByModule);

// Get permission by ID
router.get('/:id', hasPermission('roles.view'), PermissionController.getPermissionById);

// Create new permission
router.post('/', hasPermission('roles.create'), PermissionController.createPermission);

// Update permission
router.patch('/:id', hasPermission('roles.update'), PermissionController.updatePermission);

// Delete permission
router.delete('/:id', hasPermission('roles.delete'), PermissionController.deletePermission);

// Assign direct permission to user
router.post('/users/:userId', hasPermission('users.manage-roles'), PermissionController.assignPermissionToUser);

// Remove direct permission from user
router.delete('/users/:userId/:permissionId', hasPermission('users.manage-roles'), PermissionController.removePermissionFromUser);

// Get user's direct permissions
router.get('/users/:userId/direct', hasPermission('users.view'), PermissionController.getUserDirectPermissions);

module.exports = router;
