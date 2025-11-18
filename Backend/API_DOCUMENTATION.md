# Smart Campus Management System - API Documentation

## Base URL
```
http://localhost:3000
```

## Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (successful POST) |
| 400 | Bad Request (missing required fields) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error (database or server error) |

---

## Table of Contents
- [Health & Testing](#health--testing)
- [Dashboard API](#dashboard-api)
- [Energy Monitoring API](#energy-monitoring-api)
- [Maintenance Tracking API](#maintenance-tracking-api)
- [Space Utilization API](#space-utilization-api)

---

## Health & Testing

### Health Check
Check if the server is running.

**Endpoint:** `GET /health`

**Status:** `200 OK`

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Test Database Connection
Verify MySQL database connection.

**Endpoint:** `GET /api/test-db`

**Status:** `200 OK` (success) | `500 Internal Server Error` (failure)

**Success Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "result": 2
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Database connection failed",
  "error": "getaddrinfo ENOTFOUND mysql.railway.internal"
}
```

---

## Dashboard API

### Get Dashboard Statistics
Get aggregated statistics for energy, space, maintenance, and alerts.

**Endpoint:** `GET /api/dashboard/stats`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
{
  "stats": {
    "energy": {
      "current": "152,000 kWh",
      "trend": "down",
      "change": "-5.2%",
      "status": "good"
    },
    "space": {
      "utilization": "54.7%",
      "trend": "up",
      "change": "+3.1%",
      "status": "optimal"
    },
    "maintenance": {
      "open": 24,
      "trend": "up",
      "change": "+12%",
      "status": "warning"
    },
    "alerts": {
      "critical": 3,
      "warnings": 8,
      "info": 15
    }
  }
}
```

---

### Get Recent Alerts
Get recent system alerts and notifications.

**Endpoint:** `GET /api/dashboard/alerts`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": 1,
    "type": "danger",
    "message": "High energy consumption detected in Engineering Block",
    "timestamp": "45 minutes ago"
  },
  {
    "id": 2,
    "type": "warning",
    "message": "A-201 exceeding capacity limits",
    "timestamp": "0 minutes ago"
  },
  {
    "id": 3,
    "type": "info",
    "message": "Maintenance ticket resolved: Broken Projector",
    "timestamp": "2 hours ago"
  }
]
```

---

## Energy Monitoring API

### Get Energy Summary
Get daily energy consumption summary.

**Endpoint:** `GET /api/energy/summary`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
{
  "totalConsumption": 152000,
  "totalCost": 45600,
  "avgEfficiency": 85.5,
  "anomalyCount": 3
}
```

---

### Get All Buildings
Get list of all buildings with energy monitoring.

**Endpoint:** `GET /api/energy/buildings`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Main Campus - Building A",
    "location": "Karachi, Pakistan",
    "total_rooms": 15,
    "total_capacity": 1500
  },
  {
    "id": 2,
    "name": "Main Campus - Building B",
    "location": "Karachi, Pakistan",
    "total_rooms": 12,
    "total_capacity": 800
  }
]
```

---

### Get Energy Time Series Data
Get energy consumption data over time.

**Endpoint:** `GET /api/energy/timeseries`

**Query Parameters:**
- `buildingId` (optional): Filter by specific building ID
- `timeRange` (optional): `hourly` | `daily` | `weekly` (default: `hourly`)

**Status:** `200 OK` | `500 Internal Server Error`

**Response (without buildingId):**
```json
[
  { "label": "00:00", "value": 3200 },
  { "label": "01:00", "value": 2800 },
  { "label": "02:00", "value": 2500 }
]
```

**Response (with buildingId):**
```json
{
  "building": "Main Campus - Building A",
  "data": [
    { "label": "00:00", "value": 3200 },
    { "label": "01:00", "value": 2800 }
  ]
}
```

---

### Get Energy Anomalies
Get detected energy consumption anomalies.

**Endpoint:** `GET /api/energy/anomalies`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": 1,
    "building": "Engineering Campus - Engineering Block",
    "location": "Floor 3 - Lab A",
    "timestamp": "2025-11-19T12:23:00.000Z",
    "severity": "high",
    "consumption": 12500,
    "expected": 8200,
    "deviation": "+52%"
  },
  {
    "id": 2,
    "building": "Main Campus - Main Academic Building",
    "location": "Floor 2 - Research Wing",
    "timestamp": "2025-11-19T11:45:00.000Z",
    "severity": "medium",
    "consumption": 9800,
    "expected": 7500,
    "deviation": "+31%"
  }
]
```

---

### Get Building Energy Detail
Get detailed energy data for a specific building.

**Endpoint:** `GET /api/energy/building/:id`

**Status:** `200 OK` | `404 Not Found` | `500 Internal Server Error`

**Success Response:**
```json
{
  "building": "Main Campus - Building A",
  "consumption": 152000,
  "cost": 45600,
  "efficiency": 85.5,
  "anomalies": [
    {
      "id": 2,
      "location": "Floor 2 - Research Wing",
      "timestamp": "2025-11-19T11:45:00.000Z",
      "severity": "medium",
      "consumption": 9800
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Building not found"
}
```

---

## Maintenance Tracking API

### Get Maintenance Summary
Get maintenance statistics summary.

**Endpoint:** `GET /api/maintenance/summary`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
{
  "openTickets": 24,
  "inProgress": 12,
  "resolved": 156,
  "avgResponseTime": "2.3 hours"
}
```

---

### Get All Tickets
Get list of maintenance tickets.

**Endpoint:** `GET /api/maintenance/tickets`

**Query Parameters:**
- `filter` (optional): `all` | `open` | `in-progress` | `resolved` | `closed` (default: `all`)

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": "MT-0001",
    "title": "Air Conditioning Not Working",
    "building": "Building A",
    "location": "Building A, Floor 3",
    "priority": "high",
    "status": "open",
    "reportedBy": "Dr. Ahmed Khan",
    "assignedTo": "HVAC Team",
    "createdAt": "2025-11-19T08:30:00.000Z",
    "description": "The AC unit in Room A-301 is not cooling properly. Temperature is 32°C."
  },
  {
    "id": "MT-0002",
    "title": "Broken Projector",
    "building": "Building A",
    "location": "Building A, Floor 2",
    "priority": "medium",
    "status": "in-progress",
    "reportedBy": "Prof. Ayesha Malik",
    "assignedTo": "IT Support",
    "createdAt": "2025-11-18T14:20:00.000Z",
    "description": "Projector shows no display. HDMI port seems damaged."
  }
]
```

---

### Get Tickets by Priority
Get tickets filtered by priority level.

**Endpoint:** `GET /api/maintenance/tickets/priority/:priority`

**URL Parameters:**
- `priority`: `low` | `medium` | `high` | `critical`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": "MT-0001",
    "title": "Air Conditioning Not Working",
    "building": "Building A",
    "location": "Building A, Floor 3",
    "priority": "high",
    "status": "open",
    "reportedBy": "Dr. Ahmed Khan",
    "assignedTo": "HVAC Team",
    "createdAt": "2025-11-19T08:30:00.000Z",
    "description": "The AC unit in Room A-301 is not cooling properly."
  }
]
```

---

### Get Ticket Details
Get detailed information about a specific ticket.

**Endpoint:** `GET /api/maintenance/tickets/:id`

**URL Parameters:**
- `id`: Ticket ID (e.g., `MT-0001`)

**Status:** `200 OK` | `404 Not Found` | `500 Internal Server Error`

**Success Response:**
```json
{
  "id": "MT-0001",
  "title": "Air Conditioning Not Working",
  "building": "Building A",
  "location": "Building A, Floor 3",
  "priority": "high",
  "status": "open",
  "reportedBy": "Dr. Ahmed Khan",
  "assignedTo": "HVAC Team",
  "createdAt": "2025-11-19T08:30:00.000Z",
  "updatedAt": "2025-11-19T08:30:00.000Z",
  "description": "The AC unit in Room A-301 is not cooling properly. Temperature is 32°C.",
  "category": "hvac",
  "estimatedCost": 5000,
  "room": "301",
  "updates": [
    {
      "timestamp": "2025-11-19T08:30:00.000Z",
      "user": "Dr. Ahmed Khan",
      "action": "Ticket created",
      "description": "The AC unit in Room A-301 is not cooling properly. Temperature is 32°C."
    },
    {
      "timestamp": "2025-11-19T08:30:00.000Z",
      "user": "System",
      "action": "Ticket assigned",
      "description": "Assigned to HVAC Team"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Ticket not found"
}
```

---

### Create New Ticket
Create a new maintenance ticket.

**Endpoint:** `POST /api/maintenance/tickets`

**Status:** `201 Created` | `400 Bad Request` | `500 Internal Server Error`

**Request Body:**
```json
{
  "building_id": 1,
  "room_id": 5,
  "title": "Broken Light",
  "description": "Light not working in room A-202",
  "category": "electrical",
  "priority": "medium",
  "location": "Building A, Floor 2",
  "reportedBy": "Staff Member",
  "estimatedCost": 500
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": {
    "id": "MT-0008",
    "title": "Broken Light",
    "building": "Building A",
    "location": "Building A, Floor 2",
    "priority": "medium",
    "status": "open",
    "reportedBy": "Staff Member",
    "assignedTo": "Unassigned",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z",
    "description": "Light not working in room A-202",
    "category": "electrical",
    "estimatedCost": 500,
    "room": "202",
    "updates": [...]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Missing required fields: title, building, priority"
}
```

---

### Update Ticket Status
Update the status of a ticket.

**Endpoint:** `PATCH /api/maintenance/tickets/:id/status`

**URL Parameters:**
- `id`: Ticket ID (e.g., `MT-0001`)

**Status:** `200 OK` | `400 Bad Request` | `404 Not Found` | `500 Internal Server Error`

**Request Body:**
```json
{
  "status": "in-progress"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Ticket status updated",
  "ticket": {
    "id": "MT-0001",
    "title": "Air Conditioning Not Working",
    "status": "in-progress",
    ...
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Status is required"
}
```

```json
{
  "success": false,
  "message": "Ticket not found"
}
```

---

### Assign Ticket
Assign a ticket to a team member.

**Endpoint:** `PATCH /api/maintenance/tickets/:id/assign`

**URL Parameters:**
- `id`: Ticket ID (e.g., `MT-0001`)

**Status:** `200 OK` | `400 Bad Request` | `404 Not Found` | `500 Internal Server Error`

**Request Body:**
```json
{
  "assignee": "John Smith"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "ticket": {
    "id": "MT-0001",
    "title": "Air Conditioning Not Working",
    "assignedTo": "John Smith",
    ...
  }
}
```

---

## Space Utilization API

### Get Space Summary
Get space utilization statistics.

**Endpoint:** `GET /api/space/summary`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
{
  "totalRooms": 342,
  "occupied": 187,
  "available": 142,
  "overCapacity": 13
}
```

---

### Get Space Occupancy
Get current room occupancy data.

**Endpoint:** `GET /api/space/occupancy`

**Query Parameters:**
- `filter` (optional): `all` | `available` | `occupied` | `reserved` | `maintenance` (default: `all`)

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "room": "A-301",
    "building": "Building A",
    "capacity": 50,
    "current": 45,
    "status": "occupied",
    "percentage": 90
  },
  {
    "room": "A-201",
    "building": "Building A",
    "capacity": 200,
    "current": 185,
    "status": "occupied",
    "percentage": 93
  },
  {
    "room": "B-401",
    "building": "Building B",
    "capacity": 35,
    "current": 0,
    "status": "available",
    "percentage": 0
  }
]
```

---

### Get Space Heatmap
Get heatmap data for space visualization.

**Endpoint:** `GET /api/space/heatmap`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": "A-301",
    "name": "Computer Lab 1",
    "occupancy": 45,
    "capacity": 50,
    "status": "occupied"
  },
  {
    "id": "A-201",
    "name": "Lecture Hall 1",
    "occupancy": 185,
    "capacity": 200,
    "status": "occupied"
  }
]
```

---

### Get Space Optimization Suggestions
Get AI-powered suggestions for space optimization.

**Endpoint:** `GET /api/space/suggestions`

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "id": 1,
    "type": "merge",
    "title": "Merge rooms in Building A",
    "description": "Rooms A-301 and A-302 are underutilized. Merging classes could save energy.",
    "impact": "High",
    "savings": "$450/week"
  },
  {
    "id": 2,
    "type": "relocate",
    "title": "Relocate Class from A-201",
    "description": "A-201 is over capacity. Move to A-301 which has 135 empty seats.",
    "impact": "Critical",
    "savings": "Safety improvement"
  },
  {
    "id": 3,
    "type": "optimize",
    "title": "Optimize Lab Schedules",
    "description": "Some labs are underutilized. Consolidate time slots for better efficiency.",
    "impact": "Medium",
    "savings": "$320/week"
  }
]
```

---

### Get Occupancy by Building
Get room occupancy for a specific building.

**Endpoint:** `GET /api/space/building/:buildingName`

**URL Parameters:**
- `buildingName`: Building name or code (e.g., `Building A` or `A`)

**Status:** `200 OK` | `500 Internal Server Error`

**Response:**
```json
[
  {
    "room": "A-301",
    "building": "Building A",
    "capacity": 50,
    "current": 45,
    "status": "occupied",
    "percentage": 90
  },
  {
    "room": "A-201",
    "building": "Building A",
    "capacity": 200,
    "current": 185,
    "status": "occupied",
    "percentage": 93
  }
]
```

---

### Get Room Details
Get detailed information about a specific room.

**Endpoint:** `GET /api/space/room/:roomName`

**URL Parameters:**
- `roomName`: Room number or name (e.g., `A-301` or `Computer Lab 1`)

**Status:** `200 OK` | `404 Not Found` | `500 Internal Server Error`

**Success Response:**
```json
{
  "room": "A-301",
  "building": "Building A",
  "capacity": 50,
  "current": 45,
  "status": "occupied",
  "percentage": 90,
  "type": "lab",
  "floor": 3,
  "history": [
    { "time": "08:00", "occupancy": 14 },
    { "time": "09:00", "occupancy": 27 },
    { "time": "10:00", "occupancy": 41 },
    { "time": "11:00", "occupancy": 45 },
    { "time": "12:00", "occupancy": 36 }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Room not found"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (only in development mode)"
}
```

### Common Error Scenarios

**400 Bad Request:**
- Missing required fields in POST/PATCH requests
- Invalid data format

**404 Not Found:**
- Requested resource (ticket, room, building) doesn't exist

**500 Internal Server Error:**
- Database connection issues
- Query execution failures
- Server-side errors

---

## Testing with cURL

### Test Dashboard Stats
```bash
curl http://localhost:3000/api/dashboard/stats
```

### Test Energy Summary
```bash
curl http://localhost:3000/api/energy/summary
```

### Test Create Ticket
```bash
curl -X POST http://localhost:3000/api/maintenance/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": 1,
    "title": "Test Ticket",
    "description": "This is a test",
    "priority": "medium",
    "location": "Test Location",
    "reportedBy": "Test User"
  }'
```

### Test Get Space Occupancy
```bash
curl http://localhost:3000/api/space/occupancy?filter=occupied
```

---

## CORS Configuration

CORS is enabled for all origins in development mode. Update `index.js` for production deployment.

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production deployment using packages like `express-rate-limit`.

---

## Authentication

Currently not implemented. All endpoints are publicly accessible. Consider adding JWT authentication for production.

---

## Database Schema Reference

For complete database schema including tables, relationships, and constraints, refer to `database_schema.sql`.

---

## Support

For issues or questions, contact the development team or create an issue in the repository.
