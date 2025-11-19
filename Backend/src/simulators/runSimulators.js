#!/usr/bin/env node

/**
 * IoT Sensor Simulator Runner
 * Runs both Energy and Occupancy simulators
 * 
 * Usage:
 *   node runSimulators.js                    // Run both simulators
 *   node runSimulators.js energy             // Run only energy simulator
 *   node runSimulators.js occupancy          // Run only occupancy simulator
 *   node runSimulators.js --setup            // Setup database tables only
 */

require('dotenv').config();
const EnergySensorSimulator = require('./energySensorSimulator');
const OccupancySensorSimulator = require('./occupancySensorSimulator');
const { createSimulatorTables } = require('./setupDatabase');

const args = process.argv.slice(2);
const mode = args[0] || 'all';

const ENERGY_INTERVAL = 5;      // 5 seconds between energy readings
const OCCUPANCY_INTERVAL = 10;  // 10 seconds between occupancy readings

let energySimulator = null;
let occupancySimulator = null;

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down simulators...');
  
  if (energySimulator) {
    energySimulator.stop();
  }
  
  if (occupancySimulator) {
    occupancySimulator.stop();
  }
  
  console.log('👋 Goodbye!\n');
  process.exit(0);
});

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧠 SMART CAMPUS IoT SENSOR SIMULATORS');
  console.log('═══════════════════════════════════════════════════════\n');

  // Setup database tables if --setup flag
  if (mode === '--setup' || mode === 'setup') {
    await createSimulatorTables();
    console.log('✅ Database setup complete!\n');
    process.exit(0);
  }

  // Initialize simulators based on mode
  if (mode === 'all' || mode === 'energy') {
    console.log('⚡ Initializing Energy Sensor Simulator...');
    energySimulator = new EnergySensorSimulator();
    energySimulator.start(ENERGY_INTERVAL);
    console.log('');
  }

  if (mode === 'all' || mode === 'occupancy') {
    console.log('👥 Initializing Occupancy Sensor Simulator...');
    occupancySimulator = new OccupancySensorSimulator();
    occupancySimulator.start(OCCUPANCY_INTERVAL);
    console.log('');
  }

  if (mode !== 'all' && mode !== 'energy' && mode !== 'occupancy') {
    console.error('❌ Invalid mode. Use: all, energy, or occupancy');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ Simulators running...');
  console.log('📊 Real-time data generation in progress');
  console.log('🚨 Anomaly detection active');
  console.log('⚠️  Press Ctrl+C to stop');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run main function
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
