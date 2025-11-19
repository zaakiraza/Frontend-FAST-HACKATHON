const db = require('../../db');

const AuthModel = {
  // Register a new user
  async createUser(userData) {
    const query = `
      INSERT INTO users (
        username, email, password_hash, first_name, last_name, 
        phone, avatar_url, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    const params = [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.first_name || null,
      userData.last_name || null,
      userData.phone || null,
      userData.avatar_url || null
    ];
    
    const [result] = await db.query(query, params);
    return await this.getUserById(result.insertId);
  },

  // Find user by email
  async getUserByEmail(email) {
    const query = `
      SELECT 
        id,
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        avatar_url,
        email_verified_at,
        is_active,
        last_login_at,
        created_at
      FROM users
      WHERE email = ? AND is_active = 1
    `;
    
    const [rows] = await db.query(query, [email]);
    return rows[0] || null;
  },

  // Find user by username
  async getUserByUsername(username) {
    const query = `
      SELECT 
        id,
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        avatar_url,
        email_verified_at,
        is_active,
        last_login_at,
        created_at
      FROM users
      WHERE username = ? AND is_active = 1
    `;
    
    const [rows] = await db.query(query, [username]);
    return rows[0] || null;
  },

  // Get user by ID
  async getUserById(userId) {
    const query = `
      SELECT 
        id,
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
      WHERE id = ? AND is_active = TRUE
    `;
    
    const [rows] = await db.query(query, [userId]);
    return rows[0] || null;
  },

  // Update last login timestamp
  async updateLastLogin(userId) {
    const query = `UPDATE users SET last_login_at = NOW() WHERE id = ?`;
    await db.query(query, [userId]);
  },

  // Verify email
  async verifyEmail(userId) {
    const query = `UPDATE users SET email_verified_at = NOW() WHERE id = ?`;
    await db.query(query, [userId]);
  },

  // Get user with roles and permissions
  async getUserWithRolesAndPermissions(userId) {
    // Get user info
    const user = await this.getUserById(userId);
    if (!user) return null;

    // Get user's roles
    const rolesQuery = `
      SELECT 
        r.id as role_id,
        r.name,
        r.display_name,
        r.description,
        r.is_system_role
      FROM roles r
      JOIN model_has_roles mhr ON r.id = mhr.role_id
      WHERE mhr.model_type = 'User' AND mhr.model_id = ?
    `;
    const [roles] = await db.query(rolesQuery, [userId]);

    // Get user's permissions (via roles + direct permissions)
    const permissionsQuery = `
      SELECT DISTINCT 
        p.id as permission_id,
        p.name,
        p.display_name,
        p.description,
        m.name as module_name,
        m.display_name as module_display_name,
        m.sort_order
      FROM permissions p
      JOIN modules m ON p.module_id = m.id
      WHERE p.id IN (
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

  // Check if user has specific permission
  async userHasPermission(userId, permissionName) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM permissions p
        WHERE p.id IN (
          SELECT rhp.permission_id 
          FROM role_has_permissions rhp
          JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
          WHERE mhr.model_type = 'User' AND mhr.model_id = ?
          UNION
          SELECT mhp.permission_id
          FROM model_has_permissions mhp
          WHERE mhp.model_type = 'User' AND mhp.model_id = ?
        ) AND p.name = ?
      ) as has_permission
    `;
    
    const [rows] = await db.query(query, [userId, userId, permissionName]);
    return rows[0].has_permission === 1;
  },

  // Check if user has any of the specified permissions
  async userHasAnyPermission(userId, permissionNames) {
    const placeholders = permissionNames.map(() => '?').join(',');
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM permissions p
        WHERE p.id IN (
          SELECT rhp.permission_id 
          FROM role_has_permissions rhp
          JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
          WHERE mhr.model_type = 'User' AND mhr.model_id = ?
          UNION
          SELECT mhp.permission_id
          FROM model_has_permissions mhp
          WHERE mhp.model_type = 'User' AND mhp.model_id = ?
        ) AND p.name IN (${placeholders})
      ) as has_permission
    `;
    
    const [rows] = await db.query(query, [userId, userId, ...permissionNames]);
    return rows[0].has_permission === 1;
  },

  // Check if user has specific role
  async userHasRole(userId, roleName) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM roles r
        JOIN model_has_roles mhr ON r.id = mhr.role_id
        WHERE mhr.model_type = 'User' 
          AND mhr.model_id = ? 
          AND r.name = ?
      ) as has_role
    `;
    
    const [rows] = await db.query(query, [userId, roleName]);
    return rows[0].has_role === 1;
  }
};

module.exports = AuthModel;
