require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const energyRoutes = require('./routes/energyRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const spaceRoutes = require('./routes/spaceRoutes');

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/space', spaceRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
