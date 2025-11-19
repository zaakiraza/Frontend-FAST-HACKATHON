const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/verify-email', authenticate, AuthController.verifyEmail);
router.post('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
