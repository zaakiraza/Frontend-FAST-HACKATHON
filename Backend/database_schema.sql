-- Smart Campus Management System - Database Schema

-- =============================================
-- DROP EXISTING TABLES (if needed)
-- =============================================
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
    campus_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    area_sqm INT,
    total_capacity INT DEFAULT 0,
    energy_baseline_kwh INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings Table
CREATE TABLE buildings (
    building_id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    building_code VARCHAR(50),
    floor_count INT DEFAULT 1,
    total_rooms INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE CASCADE,
    UNIQUE KEY unique_building (campus_id, building_code)
);

-- Rooms Table
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255),
    floor INT,
    room_type ENUM('classroom', 'lab', 'lecture-hall', 'auditorium', 'office', 'other') DEFAULT 'classroom',
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,
    UNIQUE KEY unique_room (building_id, room_number)
);

-- Tickets Table (Maintenance)
CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
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
    FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

-- Energy Readings Table
CREATE TABLE energy_readings (
    reading_id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consumption_kwh DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    efficiency_percentage DECIMAL(5, 2),
    FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,
    INDEX idx_timestamp (timestamp),
    INDEX idx_building_timestamp (building_id, timestamp)
);

-- Energy Anomalies Table
CREATE TABLE energy_anomalies (
    anomaly_id INT PRIMARY KEY AUTO_INCREMENT,
    building_id INT NOT NULL,
    reading_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    actual_consumption DECIMAL(10, 2) NOT NULL,
    expected_consumption DECIMAL(10, 2) NOT NULL,
    deviation_percentage DECIMAL(5, 2),
    FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES energy_readings(reading_id) ON DELETE SET NULL,
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
