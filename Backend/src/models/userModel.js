const db = require('../../db');

const UserModel = {
  // Get all users
  async getAllUsers(filters = {}) {
    let query = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.avatar_url,
        u.email_verified_at,
        u.is_active,
        u.last_login_at,
        u.created_at,
        GROUP_CONCAT(DISTINCT r.name) as roles,
        GROUP_CONCAT(DISTINCT r.display_name) as role_names
      FROM users u
      LEFT JOIN model_has_roles mhr ON u.user_id = mhr.model_id AND mhr.model_type = 'User'
      LEFT JOIN roles r ON mhr.role_id = r.role_id
    `;

    const params = [];
    const conditions = [];

    if (filters.is_active !== undefined) {
      conditions.push('u.is_active = ?');
      params.push(filters.is_active);
    }

    if (filters.search) {
      conditions.push('(u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.user_id ORDER BY u.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows.map(row => ({
      ...row,
      roles: row.roles ? row.roles.split(',') : [],
      role_names: row.role_names ? row.role_names.split(',') : []
    }));
  },

  // Get user by ID with roles and permissions
  async getUserById(userId) {
    const userQuery = `
      SELECT 
        user_id,
        username,
        email,
        first_name,
        last_name,
        phone,
        avatar_url,
        email_verified_at,
        is_active,
        last_login_at,
        created_at
      FROM users
      WHERE user_id = ?
    `;
    
    const [userRows] = await db.query(userQuery, [userId]);
    if (userRows.length === 0) return null;

    const user = userRows[0];

    // Get user's roles
    const rolesQuery = `
      SELECT 
        r.role_id,
        r.name,
        r.display_name,
        r.description
      FROM roles r
      JOIN model_has_roles mhr ON r.role_id = mhr.role_id
      WHERE mhr.model_type = 'User' AND mhr.model_id = ?
    `;
    const [roles] = await db.query(rolesQuery, [userId]);

    // Get user's all permissions (via roles + direct)
    const permissionsQuery = `
      SELECT DISTINCT 
        p.permission_id,
        p.name,
        p.display_name,
        m.name as module_name
      FROM permissions p
      JOIN modules m ON p.module_id = m.module_id
      WHERE p.permission_id IN (
        SELECT rhp.permission_id 
        FROM role_has_permissions rhp
        JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
        WHERE mhr.model_type = 'User' AND mhr.model_id = ?
        UNION
        SELECT mhp.permission_id
        FROM model_has_permissions mhp
        WHERE mhp.model_type = 'User' AND mhp.model_id = ?
      )
      ORDER BY m.sort_order, p.name
    `;
    const [permissions] = await db.query(permissionsQuery, [userId, userId]);

    return {
      ...user,
      roles,
      permissions
    };
  },

  // Update user profile
  async updateUser(userId, userData) {
    const query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, avatar_url = ?, updated_at = NOW()
      WHERE user_id = ?
    `;
    
    const params = [
      userData.first_name || null,
      userData.last_name || null,
      userData.phone || null,
      userData.avatar_url || null,
      userId
    ];
    
    await db.query(query, params);
    return await this.getUserById(userId);
  },

  // Update user password
  async updatePassword(userId, passwordHash) {
    const query = `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?`;
    await db.query(query, [passwordHash, userId]);
    return true;
  },

  // Activate/Deactivate user
  async updateUserStatus(userId, isActive) {
    const query = `UPDATE users SET is_active = ?, updated_at = NOW() WHERE user_id = ?`;
    await db.query(query, [isActive, userId]);
    return await this.getUserById(userId);
  },

  // Delete user
  async deleteUser(userId) {
    const query = `DELETE FROM users WHERE user_id = ?`;
    await db.query(query, [userId]);
    return true;
  },

  // Get user's roles
  async getUserRoles(userId) {
    const query = `
      SELECT 
        r.role_id,
        r.name,
        r.display_name,
        r.description,
        mhr.created_at as assigned_at
      FROM roles r
      JOIN model_has_roles mhr ON r.role_id = mhr.role_id
      WHERE mhr.model_type = 'User' AND mhr.model_id = ?
      ORDER BY r.name
    `;
    
    const [rows] = await db.query(query, [userId]);
    return rows;
  }
};

module.exports = UserModel;
