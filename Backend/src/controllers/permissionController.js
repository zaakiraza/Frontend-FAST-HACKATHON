const PermissionModel = require('../models/permissionModel');

const PermissionController = {
  // Get all permissions grouped by module
  async getAllPermissions(req, res) {
    try {
      const permissions = await PermissionModel.getAllPermissions();

      res.json({
        success: true,
        data: permissions
      });
    } catch (error) {
      console.error('Get all permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      });
    }
  },

  // Get all modules
  async getAllModules(req, res) {
    try {
      const modules = await PermissionModel.getAllModules();

      res.json({
        success: true,
        data: modules
      });
    } catch (error) {
      console.error('Get all modules error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch modules',
        error: error.message
      });
    }
  },

  // Get permissions by module
  async getPermissionsByModule(req, res) {
    try {
      const { moduleId } = req.params;
      const permissions = await PermissionModel.getPermissionsByModule(moduleId);

      res.json({
        success: true,
        data: permissions
      });
    } catch (error) {
      console.error('Get permissions by module error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions',
        error: error.message
      });
    }
  },

  // Get permission by ID
  async getPermissionById(req, res) {
    try {
      const { id } = req.params;
      const permission = await PermissionModel.getPermissionById(id);

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }

      res.json({
        success: true,
        data: permission
      });
    } catch (error) {
      console.error('Get permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch permission',
        error: error.message
      });
    }
  },

  // Create new permission
  async createPermission(req, res) {
    try {
      const { module_id, name, display_name, description, guard_name } = req.body;

      if (!module_id || !name || !display_name) {
        return res.status(400).json({
          success: false,
          message: 'Module ID, name, and display name are required'
        });
      }

      // Check if permission name already exists
      const existingPermission = await PermissionModel.getPermissionByName(name);
      if (existingPermission) {
        return res.status(409).json({
          success: false,
          message: 'Permission name already exists'
        });
      }

      const permission = await PermissionModel.createPermission({
        module_id,
        name,
        display_name,
        description,
        guard_name
      });

      res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: permission
      });
    } catch (error) {
      console.error('Create permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create permission',
        error: error.message
      });
    }
  },

  // Update permission
  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { display_name, description } = req.body;

      if (!display_name) {
        return res.status(400).json({
          success: false,
          message: 'Display name is required'
        });
      }

      const permission = await PermissionModel.updatePermission(id, {
        display_name,
        description
      });

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found'
        });
      }

      res.json({
        success: true,
        message: 'Permission updated successfully',
        data: permission
      });
    } catch (error) {
      console.error('Update permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update permission',
        error: error.message
      });
    }
  },

  // Delete permission
  async deletePermission(req, res) {
    try {
      const { id } = req.params;

      await PermissionModel.deletePermission(id);

      res.json({
        success: true,
        message: 'Permission deleted successfully'
      });
    } catch (error) {
      console.error('Delete permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete permission',
        error: error.message
      });
    }
  },

  // Assign direct permission to user
  async assignPermissionToUser(req, res) {
    try {
      const { userId } = req.params;
      const { permission_id } = req.body;

      if (!permission_id) {
        return res.status(400).json({
          success: false,
          message: 'Permission ID is required'
        });
      }

      await PermissionModel.assignPermissionToUser(userId, permission_id);

      res.json({
        success: true,
        message: 'Permission assigned to user successfully'
      });
    } catch (error) {
      console.error('Assign permission to user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign permission',
        error: error.message
      });
    }
  },

  // Remove direct permission from user
  async removePermissionFromUser(req, res) {
    try {
      const { userId, permissionId } = req.params;

      await PermissionModel.removePermissionFromUser(userId, permissionId);

      res.json({
        success: true,
        message: 'Permission removed from user successfully'
      });
    } catch (error) {
      console.error('Remove permission from user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove permission',
        error: error.message
      });
    }
  },

  // Get user's direct permissions
  async getUserDirectPermissions(req, res) {
    try {
      const { userId } = req.params;
      const permissions = await PermissionModel.getUserDirectPermissions(userId);

      res.json({
        success: true,
        data: permissions
      });
    } catch (error) {
      console.error('Get user direct permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user permissions',
        error: error.message
      });
    }
  }
};

module.exports = PermissionController;
