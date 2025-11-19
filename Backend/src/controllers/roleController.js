const RoleModel = require('../models/roleModel');

const RoleController = {
  // Get all roles
  async getAllRoles(req, res) {
    try {
      const roles = await RoleModel.getAllRoles();

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Get all roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch roles',
        error: error.message
      });
    }
  },

  // Get role by ID
  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleModel.getRoleById(id);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      res.json({
        success: true,
        data: role
      });
    } catch (error) {
      console.error('Get role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      });
    }
  },

  // Create new role
  async createRole(req, res) {
    try {
      const { name, display_name, description, guard_name } = req.body;

      if (!name || !display_name) {
        return res.status(400).json({
          success: false,
          message: 'Name and display name are required'
        });
      }

      // Check if role name already exists
      const existingRole = await RoleModel.getRoleByName(name);
      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: 'Role name already exists'
        });
      }

      const role = await RoleModel.createRole({
        name,
        display_name,
        description,
        guard_name
      });

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role
      });
    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create role',
        error: error.message
      });
    }
  },

  // Update role
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { display_name, description } = req.body;

      if (!display_name) {
        return res.status(400).json({
          success: false,
          message: 'Display name is required'
        });
      }

      const role = await RoleModel.updateRole(id, {
        display_name,
        description
      });

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      res.json({
        success: true,
        message: 'Role updated successfully',
        data: role
      });
    } catch (error) {
      console.error('Update role error:', error);
      
      if (error.message === 'Cannot update system role') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update role',
        error: error.message
      });
    }
  },

  // Delete role
  async deleteRole(req, res) {
    try {
      const { id } = req.params;

      await RoleModel.deleteRole(id);

      res.json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      console.error('Delete role error:', error);
      
      if (error.message.includes('Cannot delete')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete role',
        error: error.message
      });
    }
  },

  // Assign permission to role
  async assignPermission(req, res) {
    try {
      const { id } = req.params;
      const { permission_id } = req.body;

      if (!permission_id) {
        return res.status(400).json({
          success: false,
          message: 'Permission ID is required'
        });
      }

      await RoleModel.assignPermissionToRole(id, permission_id);

      res.json({
        success: true,
        message: 'Permission assigned to role successfully'
      });
    } catch (error) {
      console.error('Assign permission error:', error);
      
      if (error.message.includes('Cannot modify system role')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to assign permission',
        error: error.message
      });
    }
  },

  // Remove permission from role
  async removePermission(req, res) {
    try {
      const { id, permissionId } = req.params;

      await RoleModel.removePermissionFromRole(id, permissionId);

      res.json({
        success: true,
        message: 'Permission removed from role successfully'
      });
    } catch (error) {
      console.error('Remove permission error:', error);
      
      if (error.message.includes('Cannot modify system role')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove permission',
        error: error.message
      });
    }
  },

  // Sync role permissions
  async syncPermissions(req, res) {
    try {
      const { id } = req.params;
      const { permission_ids } = req.body;

      if (!Array.isArray(permission_ids)) {
        return res.status(400).json({
          success: false,
          message: 'Permission IDs must be an array'
        });
      }

      const role = await RoleModel.syncRolePermissions(id, permission_ids);

      res.json({
        success: true,
        message: 'Role permissions synced successfully',
        data: role
      });
    } catch (error) {
      console.error('Sync permissions error:', error);
      
      if (error.message.includes('Cannot modify system role')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to sync permissions',
        error: error.message
      });
    }
  },

  // Get users with role
  async getUsersByRole(req, res) {
    try {
      const { id } = req.params;
      const users = await RoleModel.getUsersByRole(id);

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users by role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  },

  // Assign role to user
  async assignRoleToUser(req, res) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      await RoleModel.assignRoleToUser(user_id, id);

      res.json({
        success: true,
        message: 'Role assigned to user successfully'
      });
    } catch (error) {
      console.error('Assign role to user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign role',
        error: error.message
      });
    }
  },

  // Remove role from user
  async removeRoleFromUser(req, res) {
    try {
      const { id, userId } = req.params;

      await RoleModel.removeRoleFromUser(userId, id);

      res.json({
        success: true,
        message: 'Role removed from user successfully'
      });
    } catch (error) {
      console.error('Remove role from user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove role',
        error: error.message
      });
    }
  },

  // Sync user roles
  async syncUserRoles(req, res) {
    try {
      const { userId } = req.params;
      const { role_ids } = req.body;

      if (!Array.isArray(role_ids)) {
        return res.status(400).json({
          success: false,
          message: 'Role IDs must be an array'
        });
      }

      await RoleModel.syncUserRoles(userId, role_ids);

      res.json({
        success: true,
        message: 'User roles synced successfully'
      });
    } catch (error) {
      console.error('Sync user roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync user roles',
        error: error.message
      });
    }
  }
};

module.exports = RoleController;
