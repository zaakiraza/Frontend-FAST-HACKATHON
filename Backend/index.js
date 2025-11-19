require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const energyRoutes = require('./src/routes/energyRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const spaceRoutes = require('./src/routes/spaceRoutes');
const simulatorRoutes = require('./src/routes/simulatorRoutes');
const campusRoutes = require('./src/routes/campusRoutes');
const buildingRoutes = require('./src/routes/buildingRoutes');
const roomRoutes = require('./src/routes/roomRoutes');

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      result: rows[0].result 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/space', spaceRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);

// Import and start IoT simulators
const EnergySensorSimulator = require('./src/simulators/energySensorSimulator');
const OccupancySensorSimulator = require('./src/simulators/occupancySensorSimulator');

let energySimulator = null;
let occupancySimulator = null;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  
  // Start simulators automatically
  console.log('\n🔌 Starting IoT Simulators...');
  
  energySimulator = new EnergySensorSimulator();
  occupancySimulator = new OccupancySensorSimulator();
  
  energySimulator.start(5);  // Generate energy data every 5 seconds
  occupancySimulator.start(10); // Generate occupancy data every 10 seconds
  
  console.log('✅ Simulators started successfully\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received, shutting down gracefully...');
  if (energySimulator) energySimulator.stop();
  if (occupancySimulator) occupancySimulator.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received, shutting down gracefully...');
  if (energySimulator) energySimulator.stop();
  if (occupancySimulator) occupancySimulator.stop();
  process.exit(0);
});
