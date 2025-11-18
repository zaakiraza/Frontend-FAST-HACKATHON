# Smart Campus Management System - Backend API

## Overview
Backend API for the Smart Campus Management System built with Node.js, Express, and MySQL.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MySQL (Railway hosted)
- **Connection Pool**: mysql2 with promises
- **Environment Variables**: dotenv

## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the Backend folder with your Railway MySQL credentials:
```env
DB_HOST=your-railway-host.proxy.rlwy.net
DB_PORT=your-port
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=railway
PORT=3000
NODE_ENV=development
```

### 3. Set Up Database
Run the SQL schema file to create tables and insert sample data:
```bash
# Connect to your Railway MySQL database and run:
mysql -h your-host -P your-port -u root -p railway < database_schema.sql
```

Or use a MySQL client (like MySQL Workbench, DBeaver, or TablePlus) to execute `database_schema.sql`.

### 4. Start the Server
**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

### 5. Test the Connection
```bash
curl http://localhost:3000/api/test-db
```

---

## API Endpoints

### Health Check
- **GET** `/health` - Server health check

### Database Test
- **GET** `/api/test-db` - Test MySQL connection

---

## Energy Monitoring API

### Base URL: `/api/energy`

#### Get Energy Summary
```
GET /api/energy/summary
```
**Response:**
```json
{
  "totalConsumption": 45678,
  "totalCost": 12340,
  "avgEfficiency": 87,
  "anomalyCount": 3
}
```

#### Get All Buildings
```
GET /api/energy/buildings
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Main Campus",
    "location": "Karachi, Pakistan",
    "building_count": 8,
    "total_capacity": 8500
  }
]
```

#### Get Energy Time Series Data
```
GET /api/energy/timeseries?buildingId=1&timeRange=hourly
```
**Query Parameters:**
- `buildingId` (optional): Filter by specific building
- `timeRange`: `hourly`, `daily`, or `weekly` (default: `hourly`)

**Response:**
```json
[
  { "label": "00:00", "value": 3200 },
  { "label": "01:00", "value": 2800 }
]
```

Or with buildingId:
```json
{
  "building": "Main Campus",
  "data": [
    { "label": "00:00", "value": 3200 }
  ]
}
```

#### Get Energy Anomalies
```
GET /api/energy/anomalies
```
**Response:**
```json
[
  {
    "id": 1,
    "building": "Engineering Campus",
    "location": "Floor 3 - Lab A",
    "timestamp": "2025-11-18 14:23:00",
    "severity": "high",
    "consumption": 12500,
    "expected": 8200,
    "deviation": "+52%"
  }
]
```

#### Get Building Energy Detail
```
GET /api/energy/building/:id
```
**Response:**
```json
{
  "building": "Main Campus",
  "consumption": 152000,
  "cost": 45600,
  "efficiency": 85.5,
  "anomalies": [...]
}
```

---

## Maintenance Tracking API

### Base URL: `/api/maintenance`

#### Get Maintenance Summary
```
GET /api/maintenance/summary
```
**Response:**
```json
{
  "openTickets": 24,
  "inProgress": 12,
  "resolved": 156,
  "avgResponseTime": "2.3 hours"
}
```

#### Get All Tickets
```
GET /api/maintenance/tickets?filter=all
```
**Query Parameters:**
- `filter`: `all`, `open`, `in-progress`, `resolved` (default: `all`)

**Response:**
```json
[
  {
    "id": "MT-0001",
    "title": "HVAC System Malfunction",
    "building": "Engineering Complex",
    "location": "Floor 3",
    "priority": "high",
    "status": "in-progress",
    "reportedBy": "System",
    "assignedTo": "John Smith",
    "createdAt": "2025-11-18 08:30:00",
    "description": "Cooling system not responding..."
  }
]
```

#### Get Tickets by Priority
```
GET /api/maintenance/tickets/priority/:priority
```
**Parameters:**
- `priority`: `low`, `medium`, `high`, `critical`

#### Get Ticket Details
```
GET /api/maintenance/tickets/:id
```
**Example:** `GET /api/maintenance/tickets/MT-0001`

**Response:**
```json
{
  "id": "MT-0001",
  "title": "HVAC System Malfunction",
  "building": "Engineering Complex",
  "location": "Floor 3",
  "priority": "high",
  "status": "in-progress",
  "reportedBy": "System",
  "assignedTo": "John Smith",
  "createdAt": "2025-11-18 08:30:00",
  "updatedAt": "2025-11-18 09:00:00",
  "description": "Cooling system not responding...",
  "category": "hvac",
  "estimatedCost": 5000,
  "room": "A-301",
  "updates": [
    {
      "timestamp": "2025-11-18 08:30:00",
      "user": "System",
      "action": "Ticket created",
      "description": "..."
    }
  ]
}
```

#### Create New Ticket
```
POST /api/maintenance/tickets
```
**Request Body:**
```json
{
  "title": "Broken Light",
  "building": "Building A",
  "location": "Floor 2",
  "priority": "medium",
  "description": "Light not working in room A-202",
  "category": "electrical",
  "room": "A-202",
  "reportedBy": "Staff Member",
  "estimatedCost": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": { ... }
}
```

#### Update Ticket Status
```
PATCH /api/maintenance/tickets/:id/status
```
**Request Body:**
```json
{
  "status": "in-progress"
}
```

#### Assign Ticket
```
PATCH /api/maintenance/tickets/:id/assign
```
**Request Body:**
```json
{
  "assignee": "John Smith"
}
```

---

## Space Utilization API

### Base URL: `/api/space`

#### Get Space Summary
```
GET /api/space/summary
```
**Response:**
```json
{
  "totalRooms": 342,
  "occupied": 187,
  "available": 142,
  "overCapacity": 13
}
```

#### Get Space Occupancy
```
GET /api/space/occupancy?filter=all
```
**Query Parameters:**
- `filter`: `all`, `available`, `occupied`, `reserved`, `maintenance` (default: `all`)

**Response:**
```json
[
  {
    "room": "LH-101",
    "building": "Main Academic",
    "capacity": 150,
    "current": 145,
    "status": "occupied",
    "percentage": 97
  }
]
```

#### Get Space Heatmap
```
GET /api/space/heatmap
```
**Response:**
```json
[
  {
    "id": "A-301-Computer Lab 1",
    "name": "Computer Lab 1",
    "occupancy": 45,
    "capacity": 50,
    "status": "occupied"
  }
]
```

#### Get Space Optimization Suggestions
```
GET /api/space/suggestions
```
**Response:**
```json
[
  {
    "id": 1,
    "type": "merge",
    "title": "Merge rooms in Building A",
    "description": "Rooms are underutilized. Merging classes could save energy.",
    "impact": "High",
    "savings": "$450/week"
  }
]
```

#### Get Occupancy by Building
```
GET /api/space/building/:buildingName
```
**Example:** `GET /api/space/building/Main Academic`

#### Get Room Details
```
GET /api/space/room/:roomName
```
**Example:** `GET /api/space/room/A-301`

**Response:**
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
    { "time": "08:00", "occupancy": 15 },
    { "time": "09:00", "occupancy": 30 },
    { "time": "10:00", "occupancy": 42 }
  ]
}
```

---

## Database Schema

The database consists of 5 main tables:

1. **campuses** - Campus/building information
2. **rooms** - Room details and occupancy
3. **tickets** - Maintenance tickets
4. **energy_readings** - Energy consumption data
5. **energy_anomalies** - Detected energy anomalies

See `database_schema.sql` for the complete schema and sample data.

---

## Project Structure
```
Backend/
├── controllers/          # Request handlers
│   ├── energyController.js
│   ├── maintenanceController.js
│   └── spaceController.js
├── models/              # Database queries
│   ├── energyModel.js
│   ├── maintenanceModel.js
│   └── spaceModel.js
├── routes/              # API routes
│   ├── energyRoutes.js
│   ├── maintenanceRoutes.js
│   └── spaceRoutes.js
├── db.js                # Database connection pool
├── index.js             # Express server entry point
├── .env                 # Environment variables (not committed)
├── database_schema.sql  # Database schema
└── package.json         # Dependencies
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## CORS Configuration

CORS is enabled for all origins in development. Update `index.js` for production deployment.

---

## Development

### Running Tests
```bash
npm test
```

### Code Structure
- **Models** - Handle database queries
- **Controllers** - Process requests and responses
- **Routes** - Define API endpoints

### Adding New Endpoints
1. Create model functions in `models/`
2. Create controller methods in `controllers/`
3. Define routes in `routes/`
4. Import and mount routes in `index.js`

---

## Deployment

### Railway Deployment
1. Push code to GitHub
2. Connect Railway to your repository
3. Add environment variables in Railway dashboard
4. Railway will auto-deploy on push

### Environment Variables for Production
Make sure to set these in Railway:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT` (Railway provides this automatically)
- `NODE_ENV=production`

---

## Contributing
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## License
MIT
