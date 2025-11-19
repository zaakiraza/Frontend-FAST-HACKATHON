const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const UserController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const { is_active, search } = req.query;
      
      const filters = {};
      if (is_active !== undefined) {
        filters.is_active = is_active === 'true';
      }
      if (search) {
        filters.search = search;
      }

      const users = await UserModel.getAllUsers(filters);

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);

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
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { first_name, last_name, phone, avatar_url } = req.body;

      const user = await UserModel.updateUser(id, {
        first_name,
        last_name,
        phone,
        avatar_url
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  },

  // Update user password (admin)
  async updateUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      await UserModel.updatePassword(id, passwordHash);

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update password',
        error: error.message
      });
    }
  },

  // Activate/Deactivate user
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      if (is_active === undefined) {
        return res.status(400).json({
          success: false,
          message: 'is_active status is required'
        });
      }

      const user = await UserModel.updateUserStatus(id, is_active);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
        data: user
      });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: error.message
      });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await UserModel.deleteUser(id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  },

  // Get user's roles
  async getUserRoles(req, res) {
    try {
      const { id } = req.params;
      const roles = await UserModel.getUserRoles(id);

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Get user roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user roles',
        error: error.message
      });
    }
  }
};

module.exports = UserController;
