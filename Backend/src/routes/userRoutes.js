const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, hasPermission } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authenticate);

// Get all users
router.get('/', hasPermission('users.view'), UserController.getAllUsers);

// Get user by ID
router.get('/:id', hasPermission('users.view'), UserController.getUserById);

// Update user
router.patch('/:id', hasPermission('users.update'), UserController.updateUser);

// Update user password (admin)
router.patch('/:id/password', hasPermission('users.update'), UserController.updateUserPassword);

// Activate/Deactivate user
router.patch('/:id/status', hasPermission('users.update'), UserController.updateUserStatus);

// Delete user
router.delete('/:id', hasPermission('users.delete'), UserController.deleteUser);

// Get user's roles
router.get('/:id/roles', hasPermission('users.view'), UserController.getUserRoles);

module.exports = router;
