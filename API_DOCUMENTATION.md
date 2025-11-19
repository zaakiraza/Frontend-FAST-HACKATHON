# Smart Campus Dashboard - API Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Campus Management](#campus-management-api)
  - [Room Management](#room-management-api)
  - [Ticket Management](#ticket-management-api)
  - [Energy Monitoring](#energy-monitoring-api)
  - [Space Utilization](#space-utilization-api)
  - [Maintenance Tracking](#maintenance-tracking-api)
- [Data Types](#data-types)
- [Backend Implementation Guide](#backend-implementation-guide)

---

## Overview

The Smart Campus Dashboard API provides endpoints for managing campus infrastructure, monitoring energy consumption, tracking space utilization, and handling maintenance requests. The backend is built with **Node.js + Express** and uses **SQL database** (MySQL/PostgreSQL recommended).

### Technology Stack
- **Backend**: Node.js 18+, Express 4.x
- **Database**: MySQL 8.0+ or PostgreSQL 14+
- **ORM**: Sequelize (recommended) or raw SQL
- **Authentication**: JWT (recommended)
- **Environment**: dotenv for configuration

---

## Architecture

```
Backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── campusController.js
│   │   ├── roomController.js
│   │   ├── ticketController.js
│   │   ├── energyController.js
│   │   ├── spaceController.js
│   │   └── maintenanceController.js
│   ├── models/
│   │   ├── Campus.js
│   │   ├── Room.js
│   │   ├── Ticket.js
│   │   ├── EnergyReading.js
│   │   └── index.js
│   ├── routes/
│   │   ├── campusRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── energyRoutes.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   └── server.js
├── .env
└── package.json
```

---

## Database Schema

### SQL Schema

```sql
-- ============================================
-- CAMPUSES TABLE
-- ============================================
CREATE TABLE campuses (
    campus_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area_sqm DECIMAL(12, 2) DEFAULT 0,
    building_count INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    energy_baseline_kwh DECIMAL(12, 2) DEFAULT 0,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- ============================================
-- ROOMS TABLE
-- ============================================
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    building VARCHAR(100),
    floor INT,
    room_type ENUM('classroom', 'lab', 'lecture-hall', 'auditorium', 'library', 'office') DEFAULT 'classroom',
    capacity INT NOT NULL DEFAULT 0,
    current_occupancy INT DEFAULT 0,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE CASCADE,
    INDEX idx_campus (campus_id),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status),
    UNIQUE KEY unique_room (campus_id, room_number)
);

-- ============================================
-- SCHEDULED_CLASSES TABLE
-- ============================================
CREATE TABLE scheduled_classes (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(255) NOT NULL,
    instructor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    INDEX idx_room (room_id),
    INDEX idx_time (start_time, end_time)
);

-- ============================================
-- TICKETS TABLE
-- ============================================
CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('electrical', 'plumbing', 'hvac', 'structural', 'equipment', 'cleaning', 'security', 'other') DEFAULT 'other',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
    location VARCHAR(255),
    building VARCHAR(100),
    room VARCHAR(50),
    reported_by VARCHAR(255),
    assigned_to VARCHAR(255),
    estimated_cost DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE CASCADE,
    INDEX idx_campus (campus_id),
    INDEX idx_priority (priority),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created (created_at)
);

-- ============================================
-- ENERGY_READINGS TABLE
-- ============================================
CREATE TABLE energy_readings (
    reading_id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    building VARCHAR(100),
    consumption_kwh DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE CASCADE,
    INDEX idx_campus_time (campus_id, timestamp),
    INDEX idx_building (building)
);

-- ============================================
-- ENERGY_ANOMALIES TABLE
-- ============================================
CREATE TABLE energy_anomalies (
    anomaly_id INT PRIMARY KEY AUTO_INCREMENT,
    campus_id INT NOT NULL,
    building VARCHAR(100),
    location VARCHAR(255),
    consumption_kwh DECIMAL(10, 2) NOT NULL,
    expected_kwh DECIMAL(10, 2) NOT NULL,
    deviation_percentage DECIMAL(5, 2) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE CASCADE,
    INDEX idx_campus (campus_id),
    INDEX idx_severity (severity),
    INDEX idx_detected (detected_at)
);
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

## Campus Management API

### 1. Get All Campuses
**GET** `/campuses`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "campus_id": 1,
      "name": "Main Campus",
      "location": "Karachi, Pakistan",
      "area_sqm": 125000.00,
      "building_count": 8,
      "total_capacity": 8500,
      "energy_baseline_kwh": 185000.00,
      "status": "active",
      "created_at": "2020-01-15T00:00:00.000Z",
      "updated_at": "2025-11-18T10:30:00.000Z"
    }
  ]
}
```

**Data Types:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| campus_id | INTEGER | Auto | Primary key |
| name | VARCHAR(255) | Yes | Campus name |
| location | VARCHAR(255) | Yes | Campus location |
| area_sqm | DECIMAL(12,2) | No | Area in square meters |
| building_count | INTEGER | No | Number of buildings |
| total_capacity | INTEGER | No | Total student capacity |
| energy_baseline_kwh | DECIMAL(12,2) | No | Energy baseline |
| status | ENUM | Yes | active/inactive/maintenance |
| created_at | TIMESTAMP | Auto | Creation timestamp |
| updated_at | TIMESTAMP | Auto | Last update timestamp |

---

### 2. Get Single Campus
**GET** `/campuses/:campusId`

**Parameters:**
- `campusId` (path parameter, INTEGER) - Campus ID

**Response:**
```json
{
  "success": true,
  "data": {
    "campus_id": 1,
    "name": "Main Campus",
    "location": "Karachi, Pakistan",
    "area_sqm": 125000.00,
    "building_count": 8,
    "total_capacity": 8500,
    "energy_baseline_kwh": 185000.00,
    "status": "active",
    "created_at": "2020-01-15T00:00:00.000Z",
    "updated_at": "2025-11-18T10:30:00.000Z"
  }
}
```

---

### 3. Create Campus
**POST** `/campuses`

**Request Body:**
```json
{
  "name": "Engineering Campus",
  "location": "Lahore, Pakistan",
  "area_sqm": 95000,
  "building_count": 6,
  "total_capacity": 6200,
  "energy_baseline_kwh": 142000,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campus created successfully",
  "data": {
    "campus_id": 2,
    "name": "Engineering Campus",
    "location": "Lahore, Pakistan",
    "area_sqm": 95000.00,
    "building_count": 6,
    "total_capacity": 6200,
    "energy_baseline_kwh": 142000.00,
    "status": "active",
    "created_at": "2025-11-18T10:45:00.000Z"
  }
}
```

---

### 4. Update Campus
**PUT** `/campuses/:campusId`

**Parameters:**
- `campusId` (path parameter, INTEGER) - Campus ID

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Campus Name",
  "status": "maintenance",
  "building_count": 9
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campus updated successfully",
  "data": {
    "campus_id": 1,
    "name": "Updated Campus Name",
    "location": "Karachi, Pakistan",
    "area_sqm": 125000.00,
    "building_count": 9,
    "total_capacity": 8500,
    "energy_baseline_kwh": 185000.00,
    "status": "maintenance",
    "created_at": "2020-01-15T00:00:00.000Z",
    "updated_at": "2025-11-18T11:00:00.000Z"
  }
}
```

---

### 5. Delete Campus
**DELETE** `/campuses/:campusId`

**Parameters:**
- `campusId` (path parameter, INTEGER) - Campus ID

**Response:**
```json
{
  "success": true,
  "message": "Campus deleted successfully"
}
```

---

### 6. Get Campus Statistics
**GET** `/campuses/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_campuses": 4,
    "active_campuses": 3,
    "total_buildings": 22,
    "total_capacity": 22700,
    "total_area_sqm": 350000.00,
    "total_energy_baseline": 541000.00
  }
}
```

---

## Room Management API

### 1. Get All Rooms
**GET** `/rooms`

**Query Parameters:** (all optional)
- `campus_id` (INTEGER) - Filter by campus
- `room_type` (STRING) - Filter by type
- `status` (STRING) - Filter by status

**Example:** `/rooms?campus_id=1&status=available`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "room_id": 1,
      "campus_id": 1,
      "room_number": "A-301",
      "room_name": "Computer Lab 1",
      "building": "Building A",
      "floor": 3,
      "room_type": "lab",
      "capacity": 50,
      "current_occupancy": 45,
      "status": "occupied",
      "scheduled_classes": [
        {
          "schedule_id": 1,
          "start_time": "08:00:00",
          "end_time": "10:00:00",
          "subject": "Data Structures",
          "instructor": "Dr. Ahmed Khan"
        }
      ],
      "created_at": "2023-01-15T00:00:00.000Z",
      "updated_at": "2025-11-18T10:30:00.000Z"
    }
  ]
}
```

**Data Types:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| room_id | INTEGER | Auto | Primary key |
| campus_id | INTEGER | Yes | Foreign key to campuses |
| room_number | VARCHAR(50) | Yes | Room identifier |
| room_name | VARCHAR(255) | Yes | Room name/description |
| building | VARCHAR(100) | No | Building name |
| floor | INTEGER | No | Floor number |
| room_type | ENUM | Yes | classroom/lab/lecture-hall/auditorium/library/office |
| capacity | INTEGER | Yes | Maximum capacity |
| current_occupancy | INTEGER | Yes | Current occupancy count |
| status | ENUM | Yes | available/occupied/maintenance/reserved |
| scheduled_classes | ARRAY | No | Array of schedule objects |
| created_at | TIMESTAMP | Auto | Creation timestamp |
| updated_at | TIMESTAMP | Auto | Last update timestamp |

---

### 2. Get Single Room
**GET** `/rooms/:roomId`

**Parameters:**
- `roomId` (path parameter, INTEGER) - Room ID

**Response:** Same as single room object above

---

### 3. Create Room
**POST** `/rooms`

**Request Body:**
```json
{
  "campus_id": 1,
  "room_number": "B-205",
  "room_name": "Physics Lab",
  "building": "Building B",
  "floor": 2,
  "room_type": "lab",
  "capacity": 35,
  "current_occupancy": 0,
  "status": "available",
  "scheduled_classes": [
    {
      "start_time": "09:00",
      "end_time": "11:00",
      "subject": "Quantum Physics",
      "instructor": "Dr. Sarah Ali"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room_id": 9,
    "campus_id": 1,
    "room_number": "B-205",
    "room_name": "Physics Lab",
    "building": "Building B",
    "floor": 2,
    "room_type": "lab",
    "capacity": 35,
    "current_occupancy": 0,
    "status": "available",
    "scheduled_classes": [
      {
        "schedule_id": 15,
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "subject": "Quantum Physics",
        "instructor": "Dr. Sarah Ali"
      }
    ],
    "created_at": "2025-11-18T11:15:00.000Z"
  }
}
```

---

### 4. Update Room
**PUT** `/rooms/:roomId`

**Request Body:** (all fields optional)
```json
{
  "current_occupancy": 30,
  "status": "occupied"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": { /* updated room object */ }
}
```

---

### 5. Delete Room
**DELETE** `/rooms/:roomId`

**Response:**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

### 6. Get Room Statistics
**GET** `/rooms/stats`

**Query Parameters:**
- `campus_id` (INTEGER, optional) - Filter by campus

**Response:**
```json
{
  "success": true,
  "data": {
    "total_rooms": 342,
    "by_type": {
      "classroom": 150,
      "lab": 80,
      "lecture-hall": 60,
      "auditorium": 15,
      "library": 20,
      "office": 17
    },
    "by_status": {
      "available": 142,
      "occupied": 187,
      "maintenance": 8,
      "reserved": 5
    },
    "total_capacity": 15250,
    "total_occupancy": 8340,
    "avg_utilization": 54.69
  }
}
```

---

### 7. Get Over-Capacity Rooms
**GET** `/rooms/over-capacity`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "room_id": 2,
      "room_name": "Lecture Hall 1",
      "capacity": 200,
      "current_occupancy": 215,
      "over_capacity_by": 15,
      "percentage": 107.5
    }
  ]
}
```

---

### 8. Get Underutilized Rooms
**GET** `/rooms/underutilized`

**Query Parameters:**
- `threshold` (INTEGER, default: 30) - Utilization percentage threshold

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "room_id": 5,
      "room_name": "CAD Lab",
      "capacity": 40,
      "current_occupancy": 12,
      "utilization": 30.0
    }
  ]
}
```

---

## Ticket Management API

### 1. Get All Tickets
**GET** `/tickets`

**Query Parameters:** (all optional)
- `campus_id` (INTEGER) - Filter by campus
- `priority` (STRING) - Filter by priority
- `status` (STRING) - Filter by status
- `category` (STRING) - Filter by category

**Example:** `/tickets?status=open&priority=high`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ticket_id": 1,
      "campus_id": 1,
      "title": "Air Conditioning Not Working",
      "description": "The AC unit in Room A-301 is not cooling properly.",
      "category": "hvac",
      "priority": "high",
      "status": "open",
      "location": "Building A, Floor 3",
      "building": "Building A",
      "room": "A-301",
      "reported_by": "Dr. Ahmed Khan",
      "assigned_to": "HVAC Team",
      "estimated_cost": 5000.00,
      "created_at": "2025-11-18T08:30:00.000Z",
      "updated_at": "2025-11-18T08:30:00.000Z",
      "resolved_at": null
    }
  ]
}
```

**Data Types:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ticket_id | INTEGER | Auto | Primary key |
| campus_id | INTEGER | Yes | Foreign key to campuses |
| title | VARCHAR(255) | Yes | Ticket title |
| description | TEXT | Yes | Detailed description |
| category | ENUM | Yes | electrical/plumbing/hvac/structural/equipment/cleaning/security/other |
| priority | ENUM | Yes | low/medium/high/critical |
| status | ENUM | Yes | open/in-progress/resolved/closed |
| location | VARCHAR(255) | No | Location description |
| building | VARCHAR(100) | No | Building name |
| room | VARCHAR(50) | No | Room number |
| reported_by | VARCHAR(255) | No | Reporter name |
| assigned_to | VARCHAR(255) | No | Assignee name |
| estimated_cost | DECIMAL(10,2) | No | Estimated repair cost |
| created_at | TIMESTAMP | Auto | Creation timestamp |
| updated_at | TIMESTAMP | Auto | Last update timestamp |
| resolved_at | TIMESTAMP | Auto | Resolution timestamp |

---

### 2. Get Single Ticket
**GET** `/tickets/:ticketId`

**Parameters:**
- `ticketId` (path parameter, INTEGER) - Ticket ID

**Response:** Same as single ticket object above

---

### 3. Create Ticket
**POST** `/tickets`

**Request Body:**
```json
{
  "campus_id": 1,
  "title": "Broken Projector",
  "description": "Projector in Lecture Hall 1 shows no display.",
  "category": "equipment",
  "priority": "medium",
  "status": "open",
  "location": "Building A, Floor 2",
  "building": "Building A",
  "room": "A-201",
  "reported_by": "Prof. Ayesha Malik",
  "assigned_to": "IT Support",
  "estimated_cost": 3500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticket_id": 11,
    "campus_id": 1,
    "title": "Broken Projector",
    "description": "Projector in Lecture Hall 1 shows no display.",
    "category": "equipment",
    "priority": "medium",
    "status": "open",
    "location": "Building A, Floor 2",
    "building": "Building A",
    "room": "A-201",
    "reported_by": "Prof. Ayesha Malik",
    "assigned_to": "IT Support",
    "estimated_cost": 3500.00,
    "created_at": "2025-11-18T11:30:00.000Z",
    "updated_at": "2025-11-18T11:30:00.000Z",
    "resolved_at": null
  }
}
```

---

### 4. Update Ticket
**PUT** `/tickets/:ticketId`

**Request Body:** (all fields optional)
```json
{
  "status": "in-progress",
  "assigned_to": "John Smith",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": { /* updated ticket object */ }
}
```

---

### 5. Delete Ticket
**DELETE** `/tickets/:ticketId`

**Response:**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

---

### 6. Get Ticket Statistics
**GET** `/tickets/stats`

**Query Parameters:**
- `campus_id` (INTEGER, optional) - Filter by campus

**Response:**
```json
{
  "success": true,
  "data": {
    "total_tickets": 245,
    "by_priority": {
      "critical": 12,
      "high": 45,
      "medium": 108,
      "low": 80
    },
    "by_status": {
      "open": 24,
      "in-progress": 12,
      "resolved": 156,
      "closed": 53
    },
    "by_category": {
      "electrical": 45,
      "plumbing": 32,
      "hvac": 28,
      "structural": 15,
      "equipment": 65,
      "cleaning": 20,
      "security": 18,
      "other": 22
    },
    "total_estimated_cost": 285000.00,
    "avg_response_time": "2.3 hours"
  }
}
```

---

### 7. Get High Priority Tickets
**GET** `/tickets/high-priority`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of high and critical priority tickets */ ]
}
```

---

### 8. Get Unassigned Tickets
**GET** `/tickets/unassigned`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of unassigned tickets */ ]
}
```

---

## Data Types

### Enums

**Campus Status:**
- `active` - Campus is operational
- `inactive` - Campus is not in use
- `maintenance` - Campus is under maintenance

**Room Type:**
- `classroom` - Standard classroom
- `lab` - Laboratory
- `lecture-hall` - Large lecture hall
- `auditorium` - Auditorium
- `library` - Library space
- `office` - Office space

**Room Status:**
- `available` - Room is available
- `occupied` - Room is currently occupied
- `maintenance` - Room is under maintenance
- `reserved` - Room is reserved

**Ticket Category:**
- `electrical` - Electrical issues
- `plumbing` - Plumbing issues
- `hvac` - Heating/cooling issues
- `structural` - Building structure issues
- `equipment` - Equipment malfunctions
- `cleaning` - Cleaning requests
- `security` - Security concerns
- `other` - Other issues

**Ticket Priority:**
- `low` - Can be addressed later
- `medium` - Normal priority
- `high` - Should be addressed soon
- `critical` - Urgent, immediate attention required

**Ticket Status:**
- `open` - Ticket is open and unassigned
- `in-progress` - Ticket is being worked on
- `resolved` - Issue has been resolved
- `closed` - Ticket is closed

---

## Backend Implementation Guide

### 1. Install Dependencies

```bash
cd Backend
npm install express mysql2 sequelize dotenv cors helmet express-validator
npm install --save-dev nodemon
```

### 2. Environment Configuration (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_campus
DB_USER=root
DB_PASSWORD=your_password

# JWT (if implementing auth)
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5174
```

### 3. Database Connection (config/database.js)

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

### 4. Example Controller (controllers/campusController.js)

```javascript
const Campus = require('../models/Campus');

// @desc    Get all campuses
// @route   GET /api/campuses
// @access  Public
exports.getCampuses = async (req, res) => {
  try {
    const campuses = await Campus.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: campuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create campus
// @route   POST /api/campuses
// @access  Private/Admin
exports.createCampus = async (req, res) => {
  try {
    const campus = await Campus.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Campus created successfully',
      data: campus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error.message
    });
  }
};

// Add more controller methods...
```

### 5. Example Route (routes/campusRoutes.js)

```javascript
const express = require('express');
const router = express.Router();
const {
  getCampuses,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
  getCampusStats
} = require('../controllers/campusController');

router.get('/', getCampuses);
router.get('/stats', getCampusStats);
router.get('/:id', getCampusById);
router.post('/', createCampus);
router.put('/:id', updateCampus);
router.delete('/:id', deleteCampus);

module.exports = router;
```

### 6. Main Server (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./config/database');
const campusRoutes = require('./routes/campusRoutes');
const roomRoutes = require('./routes/roomRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/campuses', campusRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tickets', ticketRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database connection error:', err);
});
```

### 7. Package.json Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:migrate": "node src/scripts/migrate.js",
    "db:seed": "node src/scripts/seed.js"
  }
}
```

---

## Testing APIs

### Using cURL

```bash
# Get all campuses
curl http://localhost:5000/api/campuses

# Create campus
curl -X POST http://localhost:5000/api/campuses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campus",
    "location": "Test Location",
    "area_sqm": 50000,
    "building_count": 5,
    "total_capacity": 3000,
    "energy_baseline_kwh": 85000,
    "status": "active"
  }'

# Update campus
curl -X PUT http://localhost:5000/api/campuses/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "maintenance"}'

# Delete campus
curl -X DELETE http://localhost:5000/api/campuses/1
```

---

## Frontend Integration

Update the API base URL in your frontend API files:

```javascript
// src/api/campusApi.js
const API_BASE_URL = 'http://localhost:5000/api';

export const getCampuses = async () => {
  const response = await fetch(`${API_BASE_URL}/campuses`);
  const result = await response.json();
  return result.data;
};

export const createCampus = async (campusData) => {
  const response = await fetch(`${API_BASE_URL}/campuses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campusData)
  });
  const result = await response.json();
  return result.data;
};
```

---

## License

This API documentation is part of the Smart Campus Dashboard project.

**Last Updated:** November 18, 2025  
**Version:** 1.0.0
