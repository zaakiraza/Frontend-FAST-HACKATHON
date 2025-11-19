-- =============================================
-- USER MANAGEMENT & RBAC SCHEMA
-- Inspired by Spatie Laravel Permission
-- =============================================

-- Drop existing tables (if needed)
DROP TABLE IF EXISTS model_has_permissions;
DROP TABLE IF EXISTS model_has_roles;
DROP TABLE IF EXISTS role_has_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS modules;

-- =============================================
-- MODULES TABLE
-- =============================================
CREATE TABLE modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    email_verified_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_active (is_active)
);

-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    guard_name VARCHAR(50) DEFAULT 'web',
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_guard (guard_name)
);

-- =============================================
-- PERMISSIONS TABLE
-- =============================================
CREATE TABLE permissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    guard_name VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE,
    INDEX idx_name (name),
    INDEX idx_guard (guard_name),
    INDEX idx_module (module_id)
);

-- =============================================
-- ROLE_HAS_PERMISSIONS (Many-to-Many)
-- =============================================
CREATE TABLE role_has_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE,
    INDEX idx_role (role_id),
    INDEX idx_permission (permission_id)
);

-- =============================================
-- MODEL_HAS_ROLES (Many-to-Many: Polymorphic)
-- =============================================
CREATE TABLE model_has_roles (
    role_id INT NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, model_type, model_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    INDEX idx_model (model_type, model_id),
    INDEX idx_role (role_id)
);

-- =============================================
-- MODEL_HAS_PERMISSIONS (Many-to-Many: Polymorphic)
-- For direct permissions assigned to models
-- =============================================
CREATE TABLE model_has_permissions (
    permission_id INT NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (permission_id, model_type, model_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE,
    INDEX idx_model (model_type, model_id),
    INDEX idx_permission (permission_id)
);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert Modules
INSERT INTO modules (name, display_name, description, icon, sort_order) VALUES
('dashboard', 'Dashboard', 'Dashboard and analytics module', 'dashboard', 1),
('energy', 'Energy Monitoring', 'Energy consumption and monitoring', 'bolt', 2),
('maintenance', 'Maintenance', 'Maintenance ticket management', 'wrench', 3),
('space', 'Space Utilization', 'Room and space management', 'building', 4),
('users', 'User Management', 'User and authentication management', 'users', 5),
('roles', 'Roles & Permissions', 'Role and permission management', 'shield', 6),
('settings', 'Settings', 'System settings and configuration', 'cog', 7);

-- Insert Roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
('super-admin', 'Super Administrator', 'Full system access with all permissions', TRUE),
('admin', 'Administrator', 'Administrative access to most features', FALSE),
('facility-manager', 'Facility Manager', 'Manages facilities, maintenance, and space', FALSE),
('energy-manager', 'Energy Manager', 'Manages energy monitoring and analytics', FALSE),
('maintenance-staff', 'Maintenance Staff', 'Handles maintenance tickets and tasks', FALSE),
('viewer', 'Viewer', 'Read-only access to dashboards and reports', FALSE);

-- Insert Permissions for Dashboard Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(1, 'dashboard.view', 'View Dashboard', 'Can view dashboard and statistics'),
(1, 'dashboard.view-stats', 'View Statistics', 'Can view detailed statistics'),
(1, 'dashboard.view-alerts', 'View Alerts', 'Can view system alerts');

-- Insert Permissions for Energy Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(2, 'energy.view', 'View Energy Data', 'Can view energy consumption data'),
(2, 'energy.view-summary', 'View Energy Summary', 'Can view energy summary'),
(2, 'energy.view-buildings', 'View Buildings', 'Can view building energy data'),
(2, 'energy.view-timeseries', 'View Time Series', 'Can view energy time series data'),
(2, 'energy.view-anomalies', 'View Anomalies', 'Can view energy anomalies'),
(2, 'energy.export', 'Export Energy Data', 'Can export energy reports');

-- Insert Permissions for Maintenance Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(3, 'maintenance.view', 'View Maintenance', 'Can view maintenance tickets'),
(3, 'maintenance.view-all', 'View All Tickets', 'Can view all maintenance tickets'),
(3, 'maintenance.create', 'Create Tickets', 'Can create maintenance tickets'),
(3, 'maintenance.update', 'Update Tickets', 'Can update ticket status and details'),
(3, 'maintenance.assign', 'Assign Tickets', 'Can assign tickets to staff'),
(3, 'maintenance.delete', 'Delete Tickets', 'Can delete maintenance tickets');

-- Insert Permissions for Space Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(4, 'space.view', 'View Space Data', 'Can view space utilization data'),
(4, 'space.view-occupancy', 'View Occupancy', 'Can view room occupancy'),
(4, 'space.view-heatmap', 'View Heatmap', 'Can view space heatmap'),
(4, 'space.view-suggestions', 'View Suggestions', 'Can view optimization suggestions'),
(4, 'space.export', 'Export Space Data', 'Can export space reports');

-- Insert Permissions for Users Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(5, 'users.view', 'View Users', 'Can view user list'),
(5, 'users.create', 'Create Users', 'Can create new users'),
(5, 'users.update', 'Update Users', 'Can update user information'),
(5, 'users.delete', 'Delete Users', 'Can delete users'),
(5, 'users.manage-roles', 'Manage User Roles', 'Can assign/remove user roles');

-- Insert Permissions for Roles Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(6, 'roles.view', 'View Roles', 'Can view roles list'),
(6, 'roles.create', 'Create Roles', 'Can create new roles'),
(6, 'roles.update', 'Update Roles', 'Can update role information'),
(6, 'roles.delete', 'Delete Roles', 'Can delete roles'),
(6, 'roles.assign-permissions', 'Assign Permissions', 'Can assign permissions to roles');

-- Insert Permissions for Settings Module
INSERT INTO permissions (module_id, name, display_name, description) VALUES
(7, 'settings.view', 'View Settings', 'Can view system settings'),
(7, 'settings.update', 'Update Settings', 'Can update system settings'),
(7, 'settings.manage-system', 'Manage System', 'Can manage system configuration');

-- Assign ALL permissions to Super Admin role
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;

-- Assign permissions to Admin role (all except system management)
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 2, permission_id FROM permissions 
WHERE name NOT IN ('settings.manage-system');

-- Assign permissions to Facility Manager role
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 3, permission_id FROM permissions 
WHERE name IN (
    'dashboard.view', 'dashboard.view-stats', 'dashboard.view-alerts',
    'maintenance.view', 'maintenance.view-all', 'maintenance.create', 'maintenance.update', 'maintenance.assign',
    'space.view', 'space.view-occupancy', 'space.view-heatmap', 'space.view-suggestions', 'space.export'
);

-- Assign permissions to Energy Manager role
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 4, permission_id FROM permissions 
WHERE name IN (
    'dashboard.view', 'dashboard.view-stats',
    'energy.view', 'energy.view-summary', 'energy.view-buildings', 'energy.view-timeseries', 'energy.view-anomalies', 'energy.export'
);

-- Assign permissions to Maintenance Staff role
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 5, permission_id FROM permissions 
WHERE name IN (
    'dashboard.view',
    'maintenance.view', 'maintenance.create', 'maintenance.update'
);

-- Assign permissions to Viewer role (read-only)
INSERT INTO role_has_permissions (role_id, permission_id)
SELECT 6, permission_id FROM permissions 
WHERE name LIKE '%.view%';

-- Insert Sample Users
-- Password: 'password123' (hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, email_verified_at, is_active) VALUES
('admin', 'admin@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'System', 'Administrator', NOW(), TRUE),
('john.doe', 'john.doe@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'John', 'Doe', NOW(), TRUE),
('jane.smith', 'jane.smith@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Jane', 'Smith', NOW(), TRUE),
('mike.wilson', 'mike.wilson@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Mike', 'Wilson', NOW(), TRUE),
('sarah.jones', 'sarah.jones@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Sarah', 'Jones', NOW(), TRUE);

-- Assign Roles to Users
-- admin user -> super-admin role
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(1, 'User', 1);

-- john.doe -> facility-manager role
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(3, 'User', 2);

-- jane.smith -> energy-manager role
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(4, 'User', 3);

-- mike.wilson -> maintenance-staff role
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(5, 'User', 4);

-- sarah.jones -> viewer role
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(6, 'User', 5);

-- Example: Give john.doe a direct permission (bypassing role)
-- This demonstrates the direct permission assignment feature
INSERT INTO model_has_permissions (permission_id, model_type, model_id) VALUES
(31, 'User', 2); -- Give john.doe 'settings.view' permission directly

-- =============================================
-- USEFUL QUERIES
-- =============================================

-- Get all permissions for a user (via roles)
-- SELECT DISTINCT p.* 
-- FROM permissions p
-- JOIN role_has_permissions rhp ON p.permission_id = rhp.permission_id
-- JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
-- WHERE mhr.model_type = 'User' AND mhr.model_id = 1;

-- Get all permissions for a user (including direct permissions)
-- SELECT DISTINCT p.* 
-- FROM permissions p
-- WHERE p.permission_id IN (
--     -- Permissions via roles
--     SELECT rhp.permission_id 
--     FROM role_has_permissions rhp
--     JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
--     WHERE mhr.model_type = 'User' AND mhr.model_id = 1
--     UNION
--     -- Direct permissions
--     SELECT mhp.permission_id
--     FROM model_has_permissions mhp
--     WHERE mhp.model_type = 'User' AND mhp.model_id = 1
-- );

-- Get all roles for a user
-- SELECT r.* 
-- FROM roles r
-- JOIN model_has_roles mhr ON r.role_id = mhr.role_id
-- WHERE mhr.model_type = 'User' AND mhr.model_id = 1;

-- Get all users with a specific role
-- SELECT u.* 
-- FROM users u
-- JOIN model_has_roles mhr ON u.user_id = mhr.model_id
-- WHERE mhr.model_type = 'User' AND mhr.role_id = 1;

-- Get all users with a specific permission
-- SELECT DISTINCT u.* 
-- FROM users u
-- WHERE u.user_id IN (
--     -- Users via roles
--     SELECT mhr.model_id 
--     FROM model_has_roles mhr
--     JOIN role_has_permissions rhp ON mhr.role_id = rhp.role_id
--     WHERE mhr.model_type = 'User' AND rhp.permission_id = 1
--     UNION
--     -- Users via direct permissions
--     SELECT mhp.model_id
--     FROM model_has_permissions mhp
--     WHERE mhp.model_type = 'User' AND mhp.permission_id = 1
-- );

-- Check if user has specific permission
-- SELECT EXISTS(
--     SELECT 1 FROM permissions p
--     WHERE p.permission_id IN (
--         SELECT rhp.permission_id 
--         FROM role_has_permissions rhp
--         JOIN model_has_roles mhr ON rhp.role_id = mhr.role_id
--         WHERE mhr.model_type = 'User' AND mhr.model_id = 1
--         UNION
--         SELECT mhp.permission_id
--         FROM model_has_permissions mhp
--         WHERE mhp.model_type = 'User' AND mhp.model_id = 1
--     ) AND p.name = 'dashboard.view'
-- ) as has_permission;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_active_email ON users(is_active, email);
CREATE INDEX idx_permissions_module_name ON permissions(module_id, name);
CREATE INDEX idx_model_has_roles_lookup ON model_has_roles(model_type, model_id, role_id);
CREATE INDEX idx_model_has_permissions_lookup ON model_has_permissions(model_type, model_id, permission_id);
