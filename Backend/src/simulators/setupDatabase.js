const db = require('../../db');

/**
 * Database Schema Setup for IoT Simulators
 * Creates necessary tables for energy readings, occupancy readings, and alerts
 */

const createSimulatorTables = async () => {
  try {
    console.log('📋 Creating simulator database tables...\n');

    // Create energy_readings table
    const energyTableQuery = `
      CREATE TABLE IF NOT EXISTS energy_readings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        building_id INT NOT NULL,
        consumption_kwh DECIMAL(10, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_building (building_id),
        INDEX idx_timestamp (timestamp),
        INDEX idx_created (created_at)
      )
    `;
    
    await db.query(energyTableQuery);
    console.log('✅ Created energy_readings table');

    // Create occupancy_readings table
    const occupancyTableQuery = `
      CREATE TABLE IF NOT EXISTS occupancy_readings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        room_id INT NOT NULL,
        occupancy INT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_room (room_id),
        INDEX idx_timestamp (timestamp),
        INDEX idx_created (created_at)
      )
    `;
    
    await db.query(occupancyTableQuery);
    console.log('✅ Created occupancy_readings table');

    // Create alerts table
    const alertsTableQuery = `
      CREATE TABLE IF NOT EXISTS alerts (
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
      )
    `;
    
    await db.query(alertsTableQuery);
    console.log('✅ Created alerts table');

    console.log('\n🎉 All simulator tables created successfully!\n');
  } catch (error) {
    console.error('❌ Error creating simulator tables:', error);
    throw error;
  }
};

module.exports = { createSimulatorTables };
