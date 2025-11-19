-- Smart Campus Management System - Complete Database Schema
-- Updated: November 20, 2025
-- Includes: UID columns, IoT simulator tables, and all migrations

-- =============================================
-- DROP EXISTING TABLES (if needed)
-- =============================================
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS occupancy_readings;
DROP TABLE IF EXISTS energy_anomalies;
DROP TABLE IF EXISTS energy_readings;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS campuses;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Campuses Table
CREATE TABLE campuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    total_area INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_campuses_uid (uid)
);

-- Buildings Table
CREATE TABLE buildings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(36) UNIQUE NOT NULL,
    campus_id INT NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    building_code VARCHAR(50),
    total_rooms INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_building (campus_id, building_code),
    INDEX idx_buildings_uid (uid),
    INDEX idx_buildings_campus (campus_id)
);

-- Rooms Table
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid VARCHAR(36) UNIQUE NOT NULL,
    building_id INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255),
    floor INT,
    room_type ENUM('lecture', 'lab', 'office', 'study', 'cafeteria', 'gym', 'auditorium', 'other') DEFAULT 'other',
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status ENUM('available', 'occupied', 'full', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room (building_id, room_number),
    INDEX idx_rooms_uid (uid),
    INDEX idx_rooms_building (building_id),
    INDEX idx_rooms_status (status)
);

-- Tickets Table (Maintenance)
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    room_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('hvac', 'electrical', 'plumbing', 'equipment', 'security', 'cleaning', 'structural', 'other') DEFAULT 'other',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
    location VARCHAR(255),
    reported_by VARCHAR(255),
    assigned_to VARCHAR(255) DEFAULT 'Unassigned',
    estimated_cost DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_priority (priority),
    INDEX idx_tickets_building (building_id)
);

-- Energy Readings Table (IoT Simulator)
CREATE TABLE energy_readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    consumption_kwh DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    INDEX idx_building (building_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_building_timestamp (building_id, timestamp),
    INDEX idx_created (created_at)
);

-- Occupancy Readings Table (IoT Simulator)
CREATE TABLE occupancy_readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    occupancy INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room (room_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_room_timestamp (room_id, timestamp),
    INDEX idx_created (created_at)
);

-- Alerts Table (IoT Simulator)
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    source_id INT,
    metadata JSON,
    status VARCHAR(20) DEFAULT 'active',
    acknowledged_at TIMESTAMP NULL,
    acknowledged_by INT NULL,
    resolved_at TIMESTAMP NULL,
    resolved_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_source (source, source_id),
    INDEX idx_created (created_at)
);

-- Energy Anomalies Table (Legacy - Optional)
CREATE TABLE energy_anomalies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    reading_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    anomaly_type VARCHAR(50),
    description TEXT,
    recommended_action TEXT,
    status ENUM('new', 'investigating', 'resolved', 'false_positive') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES energy_readings(id) ON DELETE SET NULL,
    INDEX idx_anomaly_building (building_id),
    INDEX idx_anomaly_timestamp (timestamp),
    INDEX idx_anomaly_severity (severity)
);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample campuses
INSERT INTO campuses (uid, name, location, total_area) VALUES
(UUID(), 'Main Campus', 'North District', 500000),
(UUID(), 'Engineering Campus', 'East District', 300000),
(UUID(), 'Business Campus', 'Downtown', 200000),
(UUID(), 'Science Campus', 'South District', 250000),
(UUID(), 'Arts Campus', 'West District', 150000);

-- Insert sample buildings
INSERT INTO buildings (uid, campus_id, building_name, building_code, total_rooms, total_capacity, status) VALUES
(UUID(), 1, 'Admin Building', 'A01', 50, 200, 'active'),
(UUID(), 1, 'Library', 'L01', 30, 300, 'active'),
(UUID(), 2, 'Engineering Lab', 'E01', 40, 250, 'active'),
(UUID(), 2, 'Computer Science Building', 'CS01', 35, 280, 'active'),
(UUID(), 3, 'Business School', 'B01', 25, 150, 'active'),
(UUID(), 4, 'Research Center', 'R01', 45, 180, 'active'),
(UUID(), 4, 'Science Lab', 'S01', 30, 200, 'active'),
(UUID(), 5, 'Arts Building', 'AR01', 20, 120, 'active'),
(UUID(), 5, 'Music Hall', 'M01', 15, 100, 'active');

-- Insert sample rooms
INSERT INTO rooms (uid, building_id, room_number, room_name, floor, room_type, capacity, current_occupancy, status) VALUES
(UUID(), 1, '101', 'Conference Room A', 1, 'office', 20, 0, 'available'),
(UUID(), 1, '102', 'Office Suite', 1, 'office', 10, 0, 'available'),
(UUID(), 2, '201', 'Reading Hall', 2, 'study', 50, 0, 'available'),
(UUID(), 2, '202', 'Computer Lab', 2, 'lab', 40, 0, 'available'),
(UUID(), 3, '301', 'Engineering Lab A', 3, 'lab', 30, 0, 'available'),
(UUID(), 3, '302', 'Workshop', 3, 'lab', 25, 0, 'available'),
(UUID(), 4, 'CS101', 'Programming Lab', 1, 'lab', 35, 0, 'available'),
(UUID(), 4, 'CS102', 'Database Lab', 1, 'lab', 30, 0, 'available'),
(UUID(), 5, 'B201', 'Lecture Hall', 2, 'lecture', 60, 0, 'available'),
(UUID(), 6, 'R101', 'Research Lab', 1, 'lab', 20, 0, 'available'),
(UUID(), 7, 'S201', 'Chemistry Lab', 2, 'lab', 25, 0, 'available'),
(UUID(), 8, 'AR101', 'Art Studio', 1, 'other', 15, 0, 'available'),
(UUID(), 9, 'M101', 'Practice Room', 1, 'other', 10, 0, 'available');

-- =============================================
-- USER MANAGEMENT & RBAC SCHEMA
-- Inspired by Spatie Laravel Permission
-- =============================================

-- Modules Table
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

-- Users Table
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
    INDEX idx_active (is_active),
    INDEX idx_users_active_email (is_active, email)
);

-- Roles Table
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

-- Permissions Table
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
    INDEX idx_module (module_id),
    INDEX idx_permissions_module_name (module_id, name)
);

-- Role Has Permissions (Many-to-Many)
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

-- Model Has Roles (Polymorphic Many-to-Many)
CREATE TABLE model_has_roles (
    role_id INT NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, model_type, model_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    INDEX idx_model (model_type, model_id),
    INDEX idx_role (role_id),
    INDEX idx_model_has_roles_lookup (model_type, model_id, role_id)
);

-- Model Has Permissions (Polymorphic Many-to-Many)
CREATE TABLE model_has_permissions (
    permission_id INT NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    model_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (permission_id, model_type, model_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE,
    INDEX idx_model (model_type, model_id),
    INDEX idx_permission (permission_id),
    INDEX idx_model_has_permissions_lookup (model_type, model_id, permission_id)
);

-- =============================================
-- AUTH SAMPLE DATA
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

-- Insert Sample Users (Password: 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, email_verified_at, is_active) VALUES
('admin', 'admin@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'System', 'Administrator', NOW(), TRUE),
('john.doe', 'john.doe@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'John', 'Doe', NOW(), TRUE),
('jane.smith', 'jane.smith@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Jane', 'Smith', NOW(), TRUE),
('mike.wilson', 'mike.wilson@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Mike', 'Wilson', NOW(), TRUE),
('sarah.jones', 'sarah.jones@smartcampus.edu', '$2b$10$DRxM1Y2oCiLehkfbsK5k..I3WCa5qzoT6P/Xxif5xhkwO3xLHzsGu', 'Sarah', 'Jones', NOW(), TRUE);

-- Assign Roles to Users
INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
(1, 'User', 1), -- admin -> super-admin
(3, 'User', 2), -- john.doe -> facility-manager
(4, 'User', 3), -- jane.smith -> energy-manager
(5, 'User', 4), -- mike.wilson -> maintenance-staff
(6, 'User', 5); -- sarah.jones -> viewer

-- Example: Give john.doe direct 'settings.view' permission
INSERT INTO model_has_permissions (permission_id, model_type, model_id) VALUES
(31, 'User', 2);
    actual_consumption DECIMAL(10, 2) NOT NULL,
    expected_consumption DECIMAL(10, 2) NOT NULL,
    deviation_percentage DECIMAL(5, 2),
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES energy_readings(id) ON DELETE SET NULL,
    INDEX idx_timestamp (timestamp),
    INDEX idx_severity (severity)
);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert Campuses
INSERT INTO campuses (name, location, area_sqm, total_capacity, energy_baseline_kwh, status) VALUES
('Main Campus', 'Karachi, Pakistan', 125000, 8500, 185000, 'active'),
('Engineering Campus', 'Lahore, Pakistan', 95000, 6200, 142000, 'active'),
('Medical Campus', 'Islamabad, Pakistan', 78000, 4800, 125000, 'active'),
('Business School Campus', 'Karachi, Pakistan', 52000, 3200, 89000, 'active');

-- Insert Buildings
INSERT INTO buildings (campus_id, building_name, building_code, floor_count, total_rooms, total_capacity, status) VALUES
(1, 'Building A', 'A', 4, 15, 1500, 'active'),
(1, 'Building B', 'B', 5, 12, 800, 'active'),
(1, 'Building C', 'C', 3, 8, 1200, 'active'),
(1, 'Main Academic Building', 'MA', 4, 20, 2500, 'active'),
(2, 'Engineering Block', 'E', 5, 18, 1200, 'active'),
(2, 'Lab Complex', 'LAB', 3, 10, 600, 'active'),
(3, 'Medical Building', 'M', 4, 15, 1000, 'active'),
(4, 'Business Building', 'BB', 3, 10, 800, 'active');

-- Insert Rooms
INSERT INTO rooms (building_id, room_number, room_name, floor, room_type, capacity, current_occupancy, status) VALUES
(1, '301', 'Computer Lab 1', 3, 'lab', 50, 45, 'occupied'),
(1, '201', 'Lecture Hall 1', 2, 'lecture-hall', 200, 185, 'occupied'),
(2, '401', 'Physics Lab', 4, 'lab', 35, 0, 'available'),
(3, '101', 'Auditorium', 1, 'auditorium', 500, 0, 'reserved'),
(5, '202', 'Engineering Lab 1', 2, 'lab', 40, 38, 'occupied'),
(5, '305', 'CAD Lab', 3, 'lab', 30, 12, 'occupied'),
(1, '101', 'Classroom 1', 1, 'classroom', 60, 55, 'occupied'),
(7, '201', 'Anatomy Lab', 2, 'lab', 45, 42, 'occupied'),
(4, '101', 'Main Lecture Hall', 1, 'lecture-hall', 150, 145, 'occupied'),
(4, '201', 'Large Lecture Hall', 2, 'lecture-hall', 200, 215, 'occupied'),
(6, 'A1', 'Engineering Lab A1', 1, 'lab', 40, 38, 'occupied'),
(6, 'A2', 'Engineering Lab A2', 1, 'lab', 40, 12, 'occupied');

-- Insert Tickets
INSERT INTO tickets (building_id, room_id, title, description, category, priority, status, location, reported_by, assigned_to, estimated_cost) VALUES
(1, 1, 'Air Conditioning Not Working', 'The AC unit in Room A-301 is not cooling properly. Temperature is 32°C.', 'hvac', 'high', 'open', 'Building A, Floor 3', 'Dr. Ahmed Khan', 'HVAC Team', 5000.00),
(1, 2, 'Broken Projector', 'Projector in Lecture Hall 1 shows no display. HDMI port seems damaged.', 'equipment', 'medium', 'in-progress', 'Building A, Floor 2', 'Prof. Ayesha Malik', 'IT Support', 3500.00),
(2, 3, 'Water Leakage', 'Water dripping from ceiling in Building B restroom near Physics Lab.', 'plumbing', 'critical', 'in-progress', 'Building B, Floor 4', 'Cleaning Staff', 'Plumbing Team', 8000.00),
(5, 5, 'Flickering Lights', 'Multiple tube lights in E-202 are flickering continuously. Causing eye strain.', 'electrical', 'medium', 'open', 'Engineering Block, Floor 2', 'Dr. Hassan Ali', 'Electrical Maintenance', 2000.00),
(3, 4, 'Door Lock Malfunction', 'Smart lock on Auditorium door not responding to access cards.', 'security', 'high', 'open', 'Building C, Floor 1', 'Security Department', 'Security Systems', 4000.00),
(7, 8, 'Microscope Not Functioning', 'Digital microscope #12 in Anatomy Lab has broken lens. Cannot be used for practicals.', 'equipment', 'high', 'in-progress', 'Medical Building, Floor 2', 'Dr. Sana Malik', 'Lab Equipment Team', 15000.00),
(5, 6, 'Network Switch Down', 'Network switch in CAD Lab is not working. Students cannot access lab computers.', 'equipment', 'critical', 'open', 'Engineering Block, Floor 3', 'IT Department', 'Network Team', 12000.00);

-- Insert Energy Readings (Sample data for today - hourly readings for Building A)
INSERT INTO energy_readings (building_id, timestamp, consumption_kwh, cost, efficiency_percentage) VALUES
(1, DATE_SUB(NOW(), INTERVAL 23 HOUR), 3200.00, 960.00, 85.5),
(1, DATE_SUB(NOW(), INTERVAL 22 HOUR), 2800.00, 840.00, 87.2),
(1, DATE_SUB(NOW(), INTERVAL 21 HOUR), 2500.00, 750.00, 88.1),
(1, DATE_SUB(NOW(), INTERVAL 20 HOUR), 2400.00, 720.00, 89.0),
(1, DATE_SUB(NOW(), INTERVAL 19 HOUR), 2600.00, 780.00, 87.5),
(1, DATE_SUB(NOW(), INTERVAL 18 HOUR), 3100.00, 930.00, 86.0),
(1, DATE_SUB(NOW(), INTERVAL 17 HOUR), 4200.00, 1260.00, 84.5),
(1, DATE_SUB(NOW(), INTERVAL 16 HOUR), 5800.00, 1740.00, 83.0),
(1, DATE_SUB(NOW(), INTERVAL 15 HOUR), 7200.00, 2160.00, 82.5),
(1, DATE_SUB(NOW(), INTERVAL 14 HOUR), 8500.00, 2550.00, 81.0),
(1, DATE_SUB(NOW(), INTERVAL 13 HOUR), 9100.00, 2730.00, 80.5),
(1, DATE_SUB(NOW(), INTERVAL 12 HOUR), 9400.00, 2820.00, 80.0),
(1, DATE_SUB(NOW(), INTERVAL 11 HOUR), 8900.00, 2670.00, 81.5),
(1, DATE_SUB(NOW(), INTERVAL 10 HOUR), 9200.00, 2760.00, 80.8),
(1, DATE_SUB(NOW(), INTERVAL 9 HOUR), 9600.00, 2880.00, 79.5),
(1, DATE_SUB(NOW(), INTERVAL 8 HOUR), 9300.00, 2790.00, 80.2),
(1, DATE_SUB(NOW(), INTERVAL 7 HOUR), 8800.00, 2640.00, 81.8),
(1, DATE_SUB(NOW(), INTERVAL 6 HOUR), 7600.00, 2280.00, 83.5),
(1, DATE_SUB(NOW(), INTERVAL 5 HOUR), 6400.00, 1920.00, 85.0),
(1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 5200.00, 1560.00, 86.5),
(1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 4500.00, 1350.00, 87.8),
(1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 4100.00, 1230.00, 88.2),
(1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 3800.00, 1140.00, 88.5),
(1, NOW(), 3400.00, 1020.00, 89.0);

-- Insert Energy Anomalies
INSERT INTO energy_anomalies (building_id, timestamp, location, severity, actual_consumption, expected_consumption, deviation_percentage) VALUES
(5, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Floor 3 - Lab A', 'high', 12500.00, 8200.00, 52.44),
(4, DATE_SUB(NOW(), INTERVAL 3 HOUR), 'Floor 2 - Research Wing', 'medium', 9800.00, 7500.00, 30.67),
(3, DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Cafeteria', 'low', 6200.00, 5100.00, 21.57);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_buildings_campus ON buildings(campus_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_building ON rooms(building_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_building ON tickets(building_id);
