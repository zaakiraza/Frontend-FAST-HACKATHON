const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

const AuthController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, email, password, first_name, last_name, phone } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUserByEmail = await AuthModel.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      const existingUserByUsername = await AuthModel.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const user = await AuthModel.createUser({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone
      });

      // Remove password hash from response
      delete user.password_hash;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register user',
        error: error.message
      });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { login, password } = req.body;

      // Validate required fields
      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: 'Login (email/username) and password are required'
        });
      }

      // Find user by email or username
      let user = await AuthModel.getUserByEmail(login);
      if (!user) {
        user = await AuthModel.getUserByUsername(login);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await AuthModel.updateLastLogin(user.id);

      // Get user with roles and permissions
      const userWithAuth = await AuthModel.getUserWithRolesAndPermissions(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username,
          email: user.email
        },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '24h' }
      );

      // Remove password hash from response
      delete userWithAuth.password_hash;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: userWithAuth
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to login',
        error: error.message
      });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const user = await AuthModel.getUserWithRolesAndPermissions(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  },

  // Verify email
  async verifyEmail(req, res) {
    try {
      const userId = req.user.userId;

      await AuthModel.verifyEmail(userId);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify email',
        error: error.message
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      // Get user with password hash
      const user = await AuthModel.getUserByEmail(req.user.email);
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(new_password, 10);
      
      // Update password
      await AuthModel.updatePassword(userId, newPasswordHash);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }
};

module.exports = AuthController;
