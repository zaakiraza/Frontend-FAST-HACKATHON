const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');
const { authenticate, hasPermission } = require('../middleware/authMiddleware');

// All role routes require authentication
router.use(authenticate);

// Get all roles
router.get('/', hasPermission('roles.view'), RoleController.getAllRoles);

// Get role by ID
router.get('/:id', hasPermission('roles.view'), RoleController.getRoleById);

// Create new role
router.post('/', hasPermission('roles.create'), RoleController.createRole);

// Update role
router.patch('/:id', hasPermission('roles.update'), RoleController.updateRole);

// Delete role
router.delete('/:id', hasPermission('roles.delete'), RoleController.deleteRole);

// Assign permission to role
router.post('/:id/permissions', hasPermission('roles.assign-permissions'), RoleController.assignPermission);

// Remove permission from role
router.delete('/:id/permissions/:permissionId', hasPermission('roles.assign-permissions'), RoleController.removePermission);

// Sync role permissions
router.put('/:id/permissions', hasPermission('roles.assign-permissions'), RoleController.syncPermissions);

// Get users with role
router.get('/:id/users', hasPermission('roles.view'), RoleController.getUsersByRole);

// Assign role to user
router.post('/:id/users', hasPermission('users.manage-roles'), RoleController.assignRoleToUser);

// Remove role from user
router.delete('/:id/users/:userId', hasPermission('users.manage-roles'), RoleController.removeRoleFromUser);

// Sync user roles
router.put('/users/:userId/sync', hasPermission('users.manage-roles'), RoleController.syncUserRoles);

module.exports = router;
