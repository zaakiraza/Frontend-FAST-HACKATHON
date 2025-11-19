const db = require('../../db');

const RoleModel = {
  // Get all roles
  async getAllRoles() {
    const query = `
      SELECT 
        r.role_id,
        r.name,
        r.display_name,
        r.description,
        r.guard_name,
        r.is_system_role,
        r.created_at,
        COUNT(DISTINCT mhr.model_id) as user_count,
        COUNT(DISTINCT rhp.permission_id) as permission_count
      FROM roles r
      LEFT JOIN model_has_roles mhr ON r.role_id = mhr.role_id AND mhr.model_type = 'User'
      LEFT JOIN role_has_permissions rhp ON r.role_id = rhp.role_id
      GROUP BY r.role_id
      ORDER BY r.role_id
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get role by ID with permissions
  async getRoleById(roleId) {
    const roleQuery = `
      SELECT 
        r.role_id,
        r.name,
        r.display_name,
        r.description,
        r.guard_name,
        r.is_system_role,
        r.created_at
      FROM roles r
      WHERE r.role_id = ?
    `;
    
    const [roleRows] = await db.query(roleQuery, [roleId]);
    if (roleRows.length === 0) return null;

    const role = roleRows[0];

    // Get role's permissions
    const permissionsQuery = `
      SELECT 
        p.permission_id,
        p.name,
        p.display_name,
        p.description,
        m.name as module_name,
        m.display_name as module_display_name,
        m.sort_order
      FROM permissions p
      JOIN modules m ON p.module_id = m.module_id
      JOIN role_has_permissions rhp ON p.permission_id = rhp.permission_id
      WHERE rhp.role_id = ?
      ORDER BY m.sort_order, p.name
    `;
    
    const [permissions] = await db.query(permissionsQuery, [roleId]);

    return {
      ...role,
      permissions
    };
  },

  // Get role by name
  async getRoleByName(name) {
    const query = `
      SELECT 
        role_id,
        name,
        display_name,
        description,
        guard_name,
        is_system_role
      FROM roles
      WHERE name = ?
    `;
    
    const [rows] = await db.query(query, [name]);
    return rows[0] || null;
  },

  // Create new role
  async createRole(roleData) {
    const query = `
      INSERT INTO roles (name, display_name, description, guard_name, is_system_role)
      VALUES (?, ?, ?, ?, FALSE)
    `;
    
    const params = [
      roleData.name,
      roleData.display_name,
      roleData.description || null,
      roleData.guard_name || 'web'
    ];
    
    const [result] = await db.query(query, params);
    return await this.getRoleById(result.insertId);
  },

  // Update role
  async updateRole(roleId, roleData) {
    // Check if role is system role
    const role = await this.getRoleById(roleId);
    if (!role) return null;
    if (role.is_system_role) {
      throw new Error('Cannot update system role');
    }

    const query = `
      UPDATE roles 
      SET display_name = ?, description = ?, updated_at = NOW()
      WHERE role_id = ?
    `;
    
    const params = [
      roleData.display_name,
      roleData.description || null,
      roleId
    ];
    
    await db.query(query, params);
    return await this.getRoleById(roleId);
  },

  // Delete role
  async deleteRole(roleId) {
    // Check if role is system role
    const role = await this.getRoleById(roleId);
    if (!role) return null;
    if (role.is_system_role) {
      throw new Error('Cannot delete system role');
    }

    // Check if role is assigned to users
    const checkQuery = `
      SELECT COUNT(*) as user_count 
      FROM model_has_roles 
      WHERE role_id = ? AND model_type = 'User'
    `;
    const [countRows] = await db.query(checkQuery, [roleId]);
    
    if (countRows[0].user_count > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    const query = `DELETE FROM roles WHERE role_id = ?`;
    await db.query(query, [roleId]);
    return true;
  },

  // Assign permission to role
  async assignPermissionToRole(roleId, permissionId) {
    // Check if role exists and is not system role
    const role = await this.getRoleById(roleId);
    if (!role) throw new Error('Role not found');
    if (role.is_system_role) {
      throw new Error('Cannot modify system role permissions');
    }

    const query = `
      INSERT IGNORE INTO role_has_permissions (role_id, permission_id)
      VALUES (?, ?)
    `;
    
    await db.query(query, [roleId, permissionId]);
    return true;
  },

  // Remove permission from role
  async removePermissionFromRole(roleId, permissionId) {
    // Check if role exists and is not system role
    const role = await this.getRoleById(roleId);
    if (!role) throw new Error('Role not found');
    if (role.is_system_role) {
      throw new Error('Cannot modify system role permissions');
    }

    const query = `
      DELETE FROM role_has_permissions 
      WHERE role_id = ? AND permission_id = ?
    `;
    
    await db.query(query, [roleId, permissionId]);
    return true;
  },

  // Sync permissions for role (replace all permissions)
  async syncRolePermissions(roleId, permissionIds) {
    // Check if role exists and is not system role
    const role = await this.getRoleById(roleId);
    if (!role) throw new Error('Role not found');
    if (role.is_system_role) {
      throw new Error('Cannot modify system role permissions');
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Remove all existing permissions
      await connection.query(
        'DELETE FROM role_has_permissions WHERE role_id = ?',
        [roleId]
      );

      // Add new permissions
      if (permissionIds && permissionIds.length > 0) {
        const values = permissionIds.map(permId => [roleId, permId]);
        await connection.query(
          'INSERT INTO role_has_permissions (role_id, permission_id) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      return await this.getRoleById(roleId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get users with specific role
  async getUsersByRole(roleId) {
    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.is_active,
        mhr.created_at as assigned_at
      FROM users u
      JOIN model_has_roles mhr ON u.user_id = mhr.model_id
      WHERE mhr.model_type = 'User' AND mhr.role_id = ?
      ORDER BY u.username
    `;
    
    const [rows] = await db.query(query, [roleId]);
    return rows;
  },

  // Assign role to user
  async assignRoleToUser(userId, roleId) {
    const query = `
      INSERT IGNORE INTO model_has_roles (role_id, model_type, model_id)
      VALUES (?, 'User', ?)
    `;
    
    await db.query(query, [roleId, userId]);
    return true;
  },

  // Remove role from user
  async removeRoleFromUser(userId, roleId) {
    const query = `
      DELETE FROM model_has_roles 
      WHERE role_id = ? AND model_type = 'User' AND model_id = ?
    `;
    
    await db.query(query, [roleId, userId]);
    return true;
  },

  // Sync user roles (replace all roles)
  async syncUserRoles(userId, roleIds) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Remove all existing roles
      await connection.query(
        "DELETE FROM model_has_roles WHERE model_type = 'User' AND model_id = ?",
        [userId]
      );

      // Add new roles
      if (roleIds && roleIds.length > 0) {
        const values = roleIds.map(roleId => [roleId, 'User', userId]);
        await connection.query(
          'INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = RoleModel;
