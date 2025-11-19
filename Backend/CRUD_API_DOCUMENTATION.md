# CRUD API Documentation

## Overview
Complete CRUD (Create, Read, Update, Delete) operations for Campuses, Buildings, and Rooms using UIDs for secure access.

## Base URL
```
http://localhost:3000/api
```

---

## 🏫 Campuses API

### Get All Campuses
```http
GET /api/campuses
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a3f7b8c9-1234-4def-9abc-123456789abc",
      "name": "Main Campus",
      "location": "Downtown",
      "total_area": 500000,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Campus by ID
```http
GET /api/campuses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a3f7b8c9-1234-4def-9abc-123456789abc",
    "name": "Main Campus",
    "location": "Downtown",
    "total_area": 500000,
    "buildingsCount": 15,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Campus Statistics
```http
GET /api/campuses/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBuildings": 15,
    "totalRooms": 120,
    "totalCapacity": 5000,
    "currentOccupancy": 3200
  }
}
```

### Create Campus 🔒
```http
POST /api/campuses
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "North Campus",
  "location": "Northern District",
  "total_area": 350000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "b4e8c9d0-2345-5efg-0bcd-234567890bcd",
    "name": "North Campus",
    "location": "Northern District",
    "total_area": 350000,
    "buildingsCount": 0,
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  }
}
```

### Update Campus 🔒
```http
PUT /api/campuses/:id
PATCH /api/campuses/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "North Campus - Updated",
  "location": "Northern District, Building A",
  "total_area": 400000
}
```

### Delete Campus 🔒
```http
DELETE /api/campuses/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Campus deleted successfully"
}
```

**Error (has buildings):**
```json
{
  "success": false,
  "error": "Cannot delete campus with existing buildings"
}
```

---

## 🏢 Buildings API

### Get All Buildings
```http
GET /api/buildings
GET /api/buildings?campusId={campus-uid}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "uid": "c5f9d1e2-3456-6fgh-1cde-345678901cde",
      "name": "Engineering Building",
      "code": "ENG",
      "campusId": "a3f7b8c9-1234-4def-9abc-123456789abc",
      "campusName": "Main Campus",
      "totalRooms": 50,
      "totalCapacity": 2000,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Building by ID
```http
GET /api/buildings/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "c5f9d1e2-3456-6fgh-1cde-345678901cde",
    "name": "Engineering Building",
    "code": "ENG",
    "campusId": "a3f7b8c9-1234-4def-9abc-123456789abc",
    "campusName": "Main Campus",
    "campusLocation": "Downtown",
    "totalRooms": 50,
    "totalCapacity": 2000,
    "roomsCount": 50,
    "currentOccupancy": 1200,
    "occupancyRate": 60,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Building Statistics
```http
GET /api/buildings/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRooms": 50,
    "occupiedRooms": 35,
    "availableRooms": 15,
    "totalCapacity": 2000,
    "currentOccupancy": 1200,
    "occupancyRate": 60.0
  }
}
```

### Create Building 🔒
```http
POST /api/buildings
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Science Building",
  "code": "SCI",
  "campusId": "a3f7b8c9-1234-4def-9abc-123456789abc",
  "totalRooms": 40,
  "totalCapacity": 1500,
  "status": "active"
}
```

### Update Building 🔒
```http
PUT /api/buildings/:id
PATCH /api/buildings/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "name": "Science & Technology Building",
  "totalRooms": 45
}
```

### Delete Building 🔒
```http
DELETE /api/buildings/:id
Authorization: Bearer {token}
```

**Error (has rooms):**
```json
{
  "success": false,
  "error": "Cannot delete building with existing rooms"
}
```

---

## 🚪 Rooms API

### Get All Rooms
```http
GET /api/rooms
GET /api/rooms?buildingId={building-uid}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "uid": "d6g0e3f4-4567-7ghi-2def-456789012def",
      "roomNumber": "101",
      "name": "Lecture Hall A",
      "buildingId": "c5f9d1e2-3456-6fgh-1cde-345678901cde",
      "buildingName": "Engineering Building",
      "buildingCode": "ENG",
      "campusId": "a3f7b8c9-1234-4def-9abc-123456789abc",
      "campusName": "Main Campus",
      "type": "lecture",
      "floor": 1,
      "capacity": 100,
      "currentOccupancy": 75,
      "status": "occupied",
      "occupancyRate": 75,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Room by ID
```http
GET /api/rooms/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "d6g0e3f4-4567-7ghi-2def-456789012def",
    "roomNumber": "101",
    "name": "Lecture Hall A",
    "buildingId": "c5f9d1e2-3456-6fgh-1cde-345678901cde",
    "buildingName": "Engineering Building",
    "buildingCode": "ENG",
    "campusId": "a3f7b8c9-1234-4def-9abc-123456789abc",
    "campusName": "Main Campus",
    "type": "lecture",
    "floor": 1,
    "capacity": 100,
    "currentOccupancy": 75,
    "status": "occupied",
    "occupancyRate": 75,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Room Occupancy History
```http
GET /api/rooms/:id/history
GET /api/rooms/:id/history?hours=24
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "08:00",
      "occupancy": 30
    },
    {
      "time": "09:00",
      "occupancy": 75
    },
    {
      "time": "10:00",
      "occupancy": 85
    }
  ]
}
```

### Create Room 🔒
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomNumber": "205",
  "name": "Computer Lab 2",
  "buildingId": "c5f9d1e2-3456-6fgh-1cde-345678901cde",
  "type": "lab",
  "floor": 2,
  "capacity": 40,
  "currentOccupancy": 0,
  "status": "available"
}
```

**Room Types:**
- `lecture` - Lecture Hall
- `lab` - Laboratory
- `office` - Office
- `study` - Study Room
- `cafeteria` - Cafeteria
- `gym` - Gymnasium
- `auditorium` - Auditorium
- `other` - Other

**Room Status:**
- `available` - Available
- `occupied` - Occupied
- `full` - Full capacity
- `maintenance` - Under maintenance

### Update Room 🔒
```http
PUT /api/rooms/:id
PATCH /api/rooms/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (partial update):**
```json
{
  "name": "Computer Lab 2 - Updated",
  "capacity": 45
}
```

### Update Room Occupancy 🔒
```http
PATCH /api/rooms/:id/occupancy
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "occupancy": 35
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "d6g0e3f4-4567-7ghi-2def-456789012def",
    "currentOccupancy": 35,
    "status": "occupied",
    "occupancyRate": 88
  }
}
```

### Delete Room 🔒
```http
DELETE /api/rooms/:id
Authorization: Bearer {token}
```

**Error (has tickets):**
```json
{
  "success": false,
  "error": "Cannot delete room with existing maintenance tickets"
}
```

---

## 🔐 Authentication

Protected endpoints (marked with 🔒) require JWT authentication:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

To get a token, login first:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Name and location are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Campus not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## Testing with cURL

### Get all campuses
```bash
curl http://localhost:3000/api/campuses
```

### Create a campus (with auth)
```bash
curl -X POST http://localhost:3000/api/campuses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campus","location":"Test Location"}'
```

### Update a building
```bash
curl -X PUT http://localhost:3000/api/buildings/{uid} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Building Name"}'
```

### Delete a room
```bash
curl -X DELETE http://localhost:3000/api/rooms/{uid} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All IDs are UUIDs (e.g., `a3f7b8c9-1234-4def-9abc-123456789abc`)
- Internal numeric IDs are never exposed in the API
- GET requests are public; POST/PUT/PATCH/DELETE require authentication
- Cascading deletes are prevented (must delete children first)
- Status updates are automatic based on occupancy
