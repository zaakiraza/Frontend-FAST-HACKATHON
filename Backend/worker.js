#!/usr/bin/env node

/**
 * IronWorker Entry Point
 * Runs the IoT simulators continuously
 */

require('dotenv').config();
const EnergySensorSimulator = require('./src/simulators/energySensorSimulator');
const OccupancySensorSimulator = require('./src/simulators/occupancySensorSimulator');

console.log('🚀 Starting IronWorker - IoT Simulators');

const energySimulator = new EnergySensorSimulator();
const occupancySimulator = new OccupancySensorSimulator();

// Start both simulators
energySimulator.start(5);  // Every 5 seconds
occupancySimulator.start(10); // Every 10 seconds

// Keep process alive
process.on('SIGTERM', () => {
  console.log('\n📴 Received SIGTERM, shutting down gracefully...');
  energySimulator.stop();
  occupancySimulator.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 Received SIGINT, shutting down gracefully...');
  energySimulator.stop();
  occupancySimulator.stop();
  process.exit(0);
});

console.log('✅ IronWorker simulators are running...');
