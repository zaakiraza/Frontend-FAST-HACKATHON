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

-- Insert Campuses (with UIDs)
INSERT INTO campuses (uid, name, location, total_area) VALUES
(UUID(), 'Main Campus', 'Karachi, Pakistan', 125000),
(UUID(), 'Engineering Campus', 'Lahore, Pakistan', 95000),
(UUID(), 'Medical Campus', 'Islamabad, Pakistan', 78000),
(UUID(), 'Business School Campus', 'Karachi, Pakistan', 52000),
(UUID(), 'Science Campus', 'Peshawar, Pakistan', 68000);

-- Insert Buildings (with UIDs)
INSERT INTO buildings (uid, campus_id, building_name, building_code, total_rooms, total_capacity, status) VALUES
(UUID(), 1, 'Main Academic Building', 'MA', 20, 2500, 'active'),
(UUID(), 1, 'Engineering Complex', 'EC', 18, 2000, 'active'),
(UUID(), 1, 'Student Center', 'SC', 15, 1200, 'active'),
(UUID(), 1, 'Library', 'LIB', 10, 800, 'active'),
(UUID(), 1, 'Sports Complex', 'SP', 8, 1800, 'active'),
(UUID(), 2, 'Engineering Block A', 'EA', 15, 1200, 'active'),
(UUID(), 2, 'Lab Complex', 'LC', 12, 600, 'active'),
(UUID(), 3, 'Medical Building', 'MB', 18, 1000, 'active'),
(UUID(), 4, 'Business Building', 'BB', 12, 800, 'active');

-- Insert Rooms (with UIDs)
INSERT INTO rooms (uid, building_id, room_number, room_name, floor, room_type, capacity, current_occupancy, status) VALUES
(UUID(), 1, '101', 'Lecture Hall A', 1, 'lecture', 200, 160, 'occupied'),
(UUID(), 1, '102', 'Lecture Hall B', 1, 'lecture', 150, 135, 'occupied'),
(UUID(), 2, '201', 'Computer Lab 1', 2, 'lab', 40, 38, 'occupied'),
(UUID(), 2, '202', 'Computer Lab 2', 2, 'lab', 40, 35, 'occupied'),
(UUID(), 3, '101', 'Study Room A', 1, 'study', 20, 15, 'occupied'),
(UUID(), 3, '102', 'Study Room B', 1, 'study', 20, 18, 'occupied'),
(UUID(), 3, '201', 'Conference Room', 2, 'other', 50, 45, 'occupied'),
(UUID(), 3, '301', 'Cafeteria', 3, 'cafeteria', 300, 250, 'occupied'),
(UUID(), 5, 'G01', 'Main Gym', 1, 'gym', 100, 75, 'occupied'),
(UUID(), 1, 'A01', 'Auditorium', 1, 'auditorium', 500, 450, 'occupied'),
(UUID(), 6, '101', 'Engineering Lab 1', 1, 'lab', 40, 36, 'occupied'),
(UUID(), 7, 'L01', 'Research Lab', 1, 'lab', 30, 28, 'occupied'),
(UUID(), 8, '201', 'Anatomy Lab', 2, 'lab', 45, 42, 'occupied');

-- Insert Tickets
INSERT INTO tickets (building_id, room_id, title, description, category, priority, status, location, reported_by, assigned_to, estimated_cost) VALUES
(1, 1, 'Air Conditioning Not Working', 'The AC unit in Lecture Hall A is not cooling properly.', 'hvac', 'high', 'open', 'Main Academic Building, Floor 1', 'Dr. Ahmed Khan', 'HVAC Team', 5000.00),
(2, 3, 'Broken Projector', 'Projector shows no display. HDMI port damaged.', 'equipment', 'medium', 'in-progress', 'Engineering Complex, Floor 2', 'Prof. Ayesha Malik', 'IT Support', 3500.00),
(3, 8, 'Water Leakage', 'Water dripping from ceiling in Cafeteria.', 'plumbing', 'critical', 'in-progress', 'Student Center, Floor 3', 'Facilities Manager', 'Plumbing Team', 8000.00),
(6, 11, 'Flickering Lights', 'Multiple lights flickering in Engineering Lab.', 'electrical', 'medium', 'open', 'Engineering Block A', 'Dr. Hassan Ali', 'Electrical Team', 2000.00),
(1, 10, 'Door Lock Malfunction', 'Smart lock not responding to access cards.', 'security', 'high', 'open', 'Auditorium', 'Security Department', 'Security Team', 4000.00);

-- =============================================
-- NOTES
-- =============================================
-- 1. UIDs are automatically generated using UUID() function
-- 2. IoT simulator tables (energy_readings, occupancy_readings, alerts) are populated by simulators
-- 3. Run 'npm run simulator:setup' to ensure all tables exist
-- 4. Run 'npm run migrate:uid' if upgrading from old schema without UIDs
-- 5. All foreign keys have CASCADE or SET NULL for data integrity
