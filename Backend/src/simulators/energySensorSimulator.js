const db = require('../../db');

/**
 * Energy Sensor Simulator
 * Simulates real-time energy consumption data for buildings
 * Generates random values, detects anomalies, and creates alerts
 */

class EnergySensorSimulator {
  constructor() {
    this.buildings = [
      { id: 1, name: 'Main Academic Building', baseConsumption: 150, variation: 30 },
      { id: 2, name: 'Engineering Complex', baseConsumption: 200, variation: 40 },
      { id: 3, name: 'Student Center', baseConsumption: 120, variation: 25 },
      { id: 4, name: 'Library', baseConsumption: 80, variation: 15 },
      { id: 5, name: 'Sports Complex', baseConsumption: 180, variation: 35 }
    ];
    
    this.thresholds = {
      high: 250,      // kWh - High consumption threshold
      critical: 300,  // kWh - Critical threshold for anomaly
      spike: 50       // kWh - Sudden spike detection
    };
    
    this.previousReadings = new Map();
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Generate realistic energy consumption value
   */
  generateEnergyReading(building) {
    const hour = new Date().getHours();
    
    // Time-based multiplier (higher during day, lower at night)
    let timeMultiplier = 1.0;
    if (hour >= 8 && hour <= 18) {
      timeMultiplier = 1.3; // Peak hours
    } else if (hour >= 19 && hour <= 22) {
      timeMultiplier = 1.1; // Evening
    } else {
      timeMultiplier = 0.7; // Night
    }
    
    // Random variation
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    // Occasionally introduce anomalies (5% chance)
    const anomalyChance = Math.random();
    let anomalyMultiplier = 1.0;
    if (anomalyChance < 0.05) {
      anomalyMultiplier = 1.5 + Math.random() * 0.5; // 1.5x to 2x spike
    }
    
    const consumption = building.baseConsumption * timeMultiplier * randomFactor * anomalyMultiplier;
    
    return {
      consumption: Math.round(consumption * 100) / 100,
      voltage: 220 + (Math.random() * 10 - 5), // 215-225V
      current: Math.round((consumption / 0.22) * 100) / 100, // Amperes
      powerFactor: 0.85 + Math.random() * 0.12 // 0.85-0.97
    };
  }

  /**
   * Detect anomalies in energy consumption
   */
  detectAnomaly(buildingId, currentReading) {
    const previous = this.previousReadings.get(buildingId);
    const consumption = currentReading.consumption;
    
    let anomalyType = null;
    let severity = 'normal';
    let message = null;

    // Check for critical threshold
    if (consumption > this.thresholds.critical) {
      anomalyType = 'critical_threshold';
      severity = 'critical';
      message = `Critical energy consumption: ${consumption} kWh exceeds critical threshold (${this.thresholds.critical} kWh)`;
    }
    // Check for high threshold
    else if (consumption > this.thresholds.high) {
      anomalyType = 'high_consumption';
      severity = 'high';
      message = `High energy consumption detected: ${consumption} kWh`;
    }
    // Check for sudden spike
    else if (previous && (consumption - previous.consumption) > this.thresholds.spike) {
      anomalyType = 'sudden_spike';
      severity = 'high';
      message = `Sudden energy spike detected: ${Math.round(consumption - previous.consumption)} kWh increase`;
    }
    // Check for voltage issues
    else if (currentReading.voltage < 210 || currentReading.voltage > 230) {
      anomalyType = 'voltage_anomaly';
      severity = 'medium';
      message = `Voltage anomaly detected: ${Math.round(currentReading.voltage)}V`;
    }
    // Check for low power factor
    else if (currentReading.powerFactor < 0.80) {
      anomalyType = 'low_power_factor';
      severity = 'medium';
      message = `Low power factor detected: ${Math.round(currentReading.powerFactor * 100)}%`;
    }

    return { anomalyType, severity, message };
  }

  /**
   * Save energy reading to database
   */
  async saveEnergyReading(buildingId, buildingName, reading) {
    try {
      const query = `
        INSERT INTO energy_readings 
        (building_id, consumption_kwh, timestamp)
        VALUES (?, ?, NOW())
      `;
      
      await db.query(query, [
        buildingId,
        reading.consumption
      ]);
    } catch (error) {
      console.error(`Error saving energy reading for building ${buildingId}:`, error.message);
    }
  }

  /**
   * Create alert in database
   */
  async createAlert(buildingId, buildingName, anomaly, reading) {
    try {
      const query = `
        INSERT INTO alerts 
        (type, severity, title, message, source, source_id, metadata, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `;
      
      const title = `Energy ${anomaly.anomalyType.replace(/_/g, ' ').toUpperCase()}`;
      const metadata = JSON.stringify({
        building_id: buildingId,
        building_name: buildingName,
        consumption: reading.consumption,
        voltage: reading.voltage,
        current: reading.current,
        power_factor: reading.powerFactor,
        anomaly_type: anomaly.anomalyType
      });
      
      await db.query(query, [
        'energy',
        anomaly.severity,
        title,
        anomaly.message,
        'energy_sensor',
        buildingId,
        metadata
      ]);
      
      console.log(`🚨 ALERT CREATED: ${title} - ${anomaly.message}`);
    } catch (error) {
      console.error(`Error creating alert for building ${buildingId}:`, error.message);
    }
  }

  /**
   * Process one sensor reading cycle
   */
  async processSensorCycle() {
    for (const building of this.buildings) {
      const reading = this.generateEnergyReading(building);
      const anomaly = this.detectAnomaly(building.id, reading);
      
      // Save reading to database
      await this.saveEnergyReading(building.id, building.name, reading);
      
      // Log reading
      const icon = anomaly.severity === 'critical' ? '🔴' : 
                   anomaly.severity === 'high' ? '🟠' : 
                   anomaly.severity === 'medium' ? '🟡' : '🟢';
      
      console.log(
        `${icon} [${building.name}] ${reading.consumption} kWh | ` +
        `${Math.round(reading.voltage)}V | ${Math.round(reading.current)}A | ` +
        `PF: ${Math.round(reading.powerFactor * 100)}%`
      );
      
      // Create alert if anomaly detected
      if (anomaly.anomalyType) {
        await this.createAlert(building.id, building.name, anomaly, reading);
      }
      
      // Store for next comparison
      this.previousReadings.set(building.id, reading);
    }
  }

  /**
   * Start the simulator
   */
  start(intervalSeconds = 5) {
    if (this.isRunning) {
      console.log('⚠️  Energy sensor simulator is already running');
      return;
    }

    console.log('⚡ Starting Energy Sensor Simulator...');
    console.log(`📊 Monitoring ${this.buildings.length} buildings`);
    console.log(`⏱️  Reading interval: ${intervalSeconds} seconds`);
    console.log(`🎯 Thresholds: High=${this.thresholds.high}kWh, Critical=${this.thresholds.critical}kWh\n`);

    this.isRunning = true;
    
    // Initial reading
    this.processSensorCycle();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.processSensorCycle();
    }, intervalSeconds * 1000);
  }

  /**
   * Stop the simulator
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Energy sensor simulator is not running');
      return;
    }

    console.log('\n🛑 Stopping Energy Sensor Simulator...');
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.previousReadings.clear();
  }
}

module.exports = EnergySensorSimulator;
