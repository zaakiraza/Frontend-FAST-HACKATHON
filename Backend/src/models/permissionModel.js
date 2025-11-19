const db = require('../../db');

const PermissionModel = {
  // Get all permissions grouped by module
  async getAllPermissions() {
    const query = `
      SELECT 
        m.module_id,
        m.name as module_name,
        m.display_name as module_display_name,
        m.icon as module_icon,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'permission_id', p.permission_id,
            'name', p.name,
            'display_name', p.display_name,
            'description', p.description
          )
        ) as permissions
      FROM modules m
      LEFT JOIN permissions p ON m.module_id = p.module_id
      WHERE m.is_active = TRUE
      GROUP BY m.module_id
      ORDER BY m.sort_order
    `;
    
    const [rows] = await db.query(query);
    return rows.map(row => ({
      ...row,
      permissions: JSON.parse(row.permissions)
    }));
  },

  // Get all modules
  async getAllModules() {
    const query = `
      SELECT 
        module_id,
        name,
        display_name,
        description,
        icon,
        sort_order,
        is_active
      FROM modules
      WHERE is_active = TRUE
      ORDER BY sort_order
    `;
    
    const [rows] = await db.query(query);
    return rows;
  },

  // Get permissions by module
  async getPermissionsByModule(moduleId) {
    const query = `
      SELECT 
        permission_id,
        name,
        display_name,
        description,
        guard_name
      FROM permissions
      WHERE module_id = ?
      ORDER BY name
    `;
    
    const [rows] = await db.query(query, [moduleId]);
    return rows;
  },

  // Get permission by ID
  async getPermissionById(permissionId) {
    const query = `
      SELECT 
        p.permission_id,
        p.module_id,
        p.name,
        p.display_name,
        p.description,
        p.guard_name,
        m.name as module_name,
        m.display_name as module_display_name
      FROM permissions p
      JOIN modules m ON p.module_id = m.module_id
      WHERE p.permission_id = ?
    `;
    
    const [rows] = await db.query(query, [permissionId]);
    return rows[0] || null;
  },

  // Get permission by name
  async getPermissionByName(name) {
    const query = `
      SELECT 
        permission_id,
        module_id,
        name,
        display_name,
        description,
        guard_name
      FROM permissions
      WHERE name = ?
    `;
    
    const [rows] = await db.query(query, [name]);
    return rows[0] || null;
  },

  // Create new permission
  async createPermission(permissionData) {
    const query = `
      INSERT INTO permissions (module_id, name, display_name, description, guard_name)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      permissionData.module_id,
      permissionData.name,
      permissionData.display_name,
      permissionData.description || null,
      permissionData.guard_name || 'web'
    ];
    
    const [result] = await db.query(query, params);
    return await this.getPermissionById(result.insertId);
  },

  // Update permission
  async updatePermission(permissionId, permissionData) {
    const query = `
      UPDATE permissions 
      SET display_name = ?, description = ?, updated_at = NOW()
      WHERE permission_id = ?
    `;
    
    const params = [
      permissionData.display_name,
      permissionData.description || null,
      permissionId
    ];
    
    await db.query(query, params);
    return await this.getPermissionById(permissionId);
  },

  // Delete permission
  async deletePermission(permissionId) {
    const query = `DELETE FROM permissions WHERE permission_id = ?`;
    await db.query(query, [permissionId]);
    return true;
  },

  // Assign direct permission to user
  async assignPermissionToUser(userId, permissionId) {
    const query = `
      INSERT IGNORE INTO model_has_permissions (permission_id, model_type, model_id)
      VALUES (?, 'User', ?)
    `;
    
    await db.query(query, [permissionId, userId]);
    return true;
  },

  // Remove direct permission from user
  async removePermissionFromUser(userId, permissionId) {
    const query = `
      DELETE FROM model_has_permissions 
      WHERE permission_id = ? AND model_type = 'User' AND model_id = ?
    `;
    
    await db.query(query, [permissionId, userId]);
    return true;
  },

  // Get user's direct permissions
  async getUserDirectPermissions(userId) {
    const query = `
      SELECT 
        p.permission_id,
        p.name,
        p.display_name,
        p.description,
        m.name as module_name,
        m.display_name as module_display_name
      FROM permissions p
      JOIN modules m ON p.module_id = m.module_id
      JOIN model_has_permissions mhp ON p.permission_id = mhp.permission_id
      WHERE mhp.model_type = 'User' AND mhp.model_id = ?
      ORDER BY m.sort_order, p.name
    `;
    
    const [rows] = await db.query(query, [userId]);
    return rows;
  }
};

module.exports = PermissionModel;
