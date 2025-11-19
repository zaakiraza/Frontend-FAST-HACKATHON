const db = require('../../db');

/**
 * Occupancy Sensor Simulator
 * Simulates real-time room occupancy data
 * Generates random occupancy values, detects anomalies, and creates alerts
 */

class OccupancySensorSimulator {
  constructor() {
    this.rooms = [
      { id: 1, name: 'Lecture Hall A', capacity: 200, type: 'lecture', building: 'Main Academic' },
      { id: 2, name: 'Lecture Hall B', capacity: 150, type: 'lecture', building: 'Main Academic' },
      { id: 3, name: 'Lab 101', capacity: 40, type: 'lab', building: 'Engineering Complex' },
      { id: 4, name: 'Lab 102', capacity: 40, type: 'lab', building: 'Engineering Complex' },
      { id: 5, name: 'Study Room 1', capacity: 20, type: 'study', building: 'Library' },
      { id: 6, name: 'Study Room 2', capacity: 20, type: 'study', building: 'Library' },
      { id: 7, name: 'Conference Room A', capacity: 50, type: 'conference', building: 'Student Center' },
      { id: 8, name: 'Cafeteria', capacity: 300, type: 'dining', building: 'Student Center' },
      { id: 9, name: 'Gym', capacity: 100, type: 'sports', building: 'Sports Complex' },
      { id: 10, name: 'Auditorium', capacity: 500, type: 'auditorium', building: 'Main Academic' }
    ];
    
    this.thresholds = {
      overcrowding: 0.95,    // 95% capacity
      highUsage: 0.80,       // 80% capacity
      suddenIncrease: 30     // 30 people sudden increase
    };
    
    this.previousReadings = new Map();
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Generate realistic occupancy reading based on time and room type
   */
  generateOccupancyReading(room) {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    // Base occupancy factor based on time and day
    let baseFactor = 0;
    
    // Weekend check
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseFactor = 0.2; // Low occupancy on weekends
    } else {
      // Weekday schedule
      if (hour >= 8 && hour <= 12) {
        baseFactor = 0.7; // Morning classes
      } else if (hour >= 13 && hour <= 17) {
        baseFactor = 0.8; // Afternoon peak
      } else if (hour >= 18 && hour <= 21) {
        baseFactor = 0.5; // Evening activities
      } else {
        baseFactor = 0.1; // Night/early morning
      }
    }
    
    // Room type adjustments
    const typeMultipliers = {
      lecture: 1.0,
      lab: 0.9,
      study: 1.2,    // Study rooms more popular
      conference: 0.6,
      dining: 1.5,   // Cafeteria peak times
      sports: 0.8,
      auditorium: 0.4 // Events are less frequent
    };
    
    // Dining peak times
    if (room.type === 'dining' && (hour === 12 || hour === 13 || hour === 18)) {
      baseFactor = 1.2; // Lunch/dinner rush
    }
    
    // Sports peak times
    if (room.type === 'sports' && (hour >= 17 && hour <= 20)) {
      baseFactor = 0.9; // Evening workout rush
    }
    
    const typeMultiplier = typeMultipliers[room.type] || 1.0;
    const randomVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    
    // Occasionally introduce anomalies (3% chance)
    let anomalyMultiplier = 1.0;
    if (Math.random() < 0.03) {
      anomalyMultiplier = 1.5 + Math.random() * 0.5; // Unexpected crowd
    }
    
    const occupancy = Math.round(
      room.capacity * baseFactor * typeMultiplier * randomVariation * anomalyMultiplier
    );
    
    // Ensure occupancy doesn't exceed capacity * 1.1 (slight overcrowding possible)
    const finalOccupancy = Math.min(occupancy, Math.round(room.capacity * 1.1));
    
    return {
      occupancy: Math.max(0, finalOccupancy),
      capacity: room.capacity,
      utilizationRate: Math.round((finalOccupancy / room.capacity) * 100) / 100,
      temperature: 20 + Math.random() * 6, // 20-26°C
      co2Level: 400 + (finalOccupancy * 5) + (Math.random() * 100) // PPM
    };
  }

  /**
   * Detect anomalies in occupancy
   */
  detectAnomaly(roomId, room, currentReading) {
    const previous = this.previousReadings.get(roomId);
    const occupancy = currentReading.occupancy;
    const utilizationRate = currentReading.utilizationRate;
    
    let anomalyType = null;
    let severity = 'normal';
    let message = null;

    // Check for overcrowding (>95% capacity)
    if (utilizationRate >= this.thresholds.overcrowding) {
      anomalyType = 'overcrowding';
      severity = 'critical';
      message = `Overcrowding detected: ${occupancy}/${room.capacity} people (${Math.round(utilizationRate * 100)}% capacity)`;
    }
    // Check for high usage (>80% capacity)
    else if (utilizationRate >= this.thresholds.highUsage) {
      anomalyType = 'high_usage';
      severity = 'high';
      message = `High occupancy: ${occupancy}/${room.capacity} people (${Math.round(utilizationRate * 100)}% capacity)`;
    }
    // Check for sudden increase
    else if (previous && (occupancy - previous.occupancy) >= this.thresholds.suddenIncrease) {
      anomalyType = 'sudden_increase';
      severity = 'medium';
      message = `Sudden crowd increase: +${occupancy - previous.occupancy} people in ${room.name}`;
    }
    // Check for high CO2 levels (>1000 PPM)
    else if (currentReading.co2Level > 1000) {
      anomalyType = 'poor_air_quality';
      severity = 'medium';
      message = `Poor air quality: CO2 level at ${Math.round(currentReading.co2Level)} PPM`;
    }
    // Check for high temperature (>25°C with high occupancy)
    else if (currentReading.temperature > 25 && utilizationRate > 0.6) {
      anomalyType = 'high_temperature';
      severity = 'low';
      message = `High temperature: ${Math.round(currentReading.temperature)}°C with ${occupancy} people`;
    }

    return { anomalyType, severity, message };
  }

  /**
   * Save occupancy reading to database
   */
  async saveOccupancyReading(roomId, room, reading) {
    try {
      const query = `
        INSERT INTO occupancy_readings 
        (room_id, occupancy, timestamp)
        VALUES (?, ?, NOW())
      `;
      
      await db.query(query, [
        roomId,
        reading.occupancy
      ]);
    } catch (error) {
      console.error(`Error saving occupancy reading for room ${roomId}:`, error.message);
    }
  }

  /**
   * Create alert in database
   */
  async createAlert(roomId, room, anomaly, reading) {
    try {
      const query = `
        INSERT INTO alerts 
        (type, severity, title, message, source, source_id, metadata, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `;
      
      const title = `Occupancy ${anomaly.anomalyType.replace(/_/g, ' ').toUpperCase()}`;
      const metadata = JSON.stringify({
        room_id: roomId,
        room_name: room.name,
        building: room.building,
        occupancy: reading.occupancy,
        capacity: reading.capacity,
        utilization_rate: reading.utilizationRate,
        temperature: reading.temperature,
        co2_level: reading.co2Level,
        anomaly_type: anomaly.anomalyType
      });
      
      await db.query(query, [
        'occupancy',
        anomaly.severity,
        title,
        anomaly.message,
        'occupancy_sensor',
        roomId,
        metadata
      ]);
      
      console.log(`🚨 ALERT CREATED: ${title} - ${anomaly.message}`);
    } catch (error) {
      console.error(`Error creating alert for room ${roomId}:`, error.message);
    }
  }

  /**
   * Process one sensor reading cycle
   */
  async processSensorCycle() {
    for (const room of this.rooms) {
      const reading = this.generateOccupancyReading(room);
      const anomaly = this.detectAnomaly(room.id, room, reading);
      
      // Save reading to database
      await this.saveOccupancyReading(room.id, room, reading);
      
      // Log reading
      const utilizationPercent = Math.round(reading.utilizationRate * 100);
      const icon = anomaly.severity === 'critical' ? '🔴' : 
                   anomaly.severity === 'high' ? '🟠' : 
                   anomaly.severity === 'medium' ? '🟡' : 
                   anomaly.severity === 'low' ? '🟢' : '🟢';
      
      const occupancyBar = this.generateOccupancyBar(reading.utilizationRate);
      
      console.log(
        `${icon} [${room.name}] ${reading.occupancy}/${room.capacity} people ${occupancyBar} ${utilizationPercent}% | ` +
        `${Math.round(reading.temperature)}°C | CO2: ${Math.round(reading.co2Level)} PPM`
      );
      
      // Create alert if anomaly detected
      if (anomaly.anomalyType) {
        await this.createAlert(room.id, room, anomaly, reading);
      }
      
      // Store for next comparison
      this.previousReadings.set(room.id, reading);
    }
  }

  /**
   * Generate visual occupancy bar
   */
  generateOccupancyBar(rate) {
    const bars = 10;
    const safeRate = Math.max(0, Math.min(1, rate)); // Clamp between 0 and 1
    const filled = Math.round(safeRate * bars);
    const empty = bars - filled;
    return '[' + '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty)) + ']';
  }

  /**
   * Start the simulator
   */
  start(intervalSeconds = 10) {
    if (this.isRunning) {
      console.log('⚠️  Occupancy sensor simulator is already running');
      return;
    }

    console.log('👥 Starting Occupancy Sensor Simulator...');
    console.log(`🏢 Monitoring ${this.rooms.length} rooms across campus`);
    console.log(`⏱️  Reading interval: ${intervalSeconds} seconds`);
    console.log(`🎯 Thresholds: High Usage=${this.thresholds.highUsage * 100}%, Overcrowding=${this.thresholds.overcrowding * 100}%\n`);

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
      console.log('⚠️  Occupancy sensor simulator is not running');
      return;
    }

    console.log('\n🛑 Stopping Occupancy Sensor Simulator...');
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.previousReadings.clear();
  }
}

module.exports = OccupancySensorSimulator;
