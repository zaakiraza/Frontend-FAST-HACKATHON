# 🧠 Smart Campus IoT Sensor Simulators - Implementation Summary

## 📦 What Was Created

### Core Simulator Files
1. **energySensorSimulator.js** - Energy consumption simulator
2. **occupancySensorSimulator.js** - Space occupancy simulator  
3. **runSimulators.js** - Main runner script
4. **setupDatabase.js** - Database schema creator

### API Layer
5. **simulatorController.js** - API controller with 8 endpoints
6. **simulatorRoutes.js** - Express routes configuration

### Documentation
7. **README.md** - Complete simulator documentation
8. **SIMULATOR_QUICKSTART.md** - Quick start guide

### Configuration
9. **package.json** - Added 4 npm scripts
10. **index.js** - Integrated simulator routes

## ⚡ Energy Sensor Simulator Features

### Monitored Buildings (5)
- Main Academic Building (150 kWh base)
- Engineering Complex (200 kWh base)
- Student Center (120 kWh base)
- Library (80 kWh base)
- Sports Complex (180 kWh base)

### Metrics Tracked
- ⚡ Energy consumption (kWh)
- 🔌 Voltage (V)
- ⚡ Current (Amperes)
- 📊 Power factor (0-1)

### Anomaly Detection
- 🔴 Critical threshold: >300 kWh
- 🟠 High consumption: >250 kWh
- ⚠️ Sudden spikes: >50 kWh increase
- ⚡ Voltage anomalies: <210V or >230V
- 📉 Low power factor: <0.80

### Time-Based Patterns
- **Peak hours (8am-6pm)**: 1.3x multiplier
- **Evening (7pm-10pm)**: 1.1x multiplier
- **Night (11pm-7am)**: 0.7x multiplier
- **Random variation**: ±20%
- **Anomaly chance**: 5%

## 👥 Occupancy Sensor Simulator Features

### Monitored Spaces (10)
- Lecture Hall A (200 capacity)
- Lecture Hall B (150 capacity)
- Lab 101 & 102 (40 each)
- Study Room 1 & 2 (20 each)
- Conference Room A (50 capacity)
- Cafeteria (300 capacity)
- Gym (100 capacity)
- Auditorium (500 capacity)

### Metrics Tracked
- 👥 Occupancy count
- 📊 Capacity
- 📈 Utilization rate (%)
- 🌡️ Temperature (°C)
- 💨 CO2 levels (PPM)

### Anomaly Detection
- 🔴 Overcrowding: >95% capacity
- 🟠 High usage: >80% capacity
- ⚠️ Sudden increase: +30 people
- 💨 Poor air quality: >1000 PPM CO2
- 🌡️ High temperature: >25°C with high occupancy

### Time-Based Patterns
- **Weekday peak (8am-5pm)**: 70-80% utilization
- **Weekend**: 20% utilization
- **Night**: 10% utilization
- **Cafeteria lunch (12-1pm)**: 120% multiplier
- **Gym evening (5-8pm)**: 90% utilization

## 🗄️ Database Schema

### energy_readings
```sql
- id (PK)
- building_id
- building_name
- consumption_kwh
- voltage
- current_amps
- power_factor
- timestamp
- created_at
```

### occupancy_readings
```sql
- id (PK)
- room_id
- room_name
- building
- room_type
- occupancy
- capacity
- utilization_rate
- temperature
- co2_level
- timestamp
- created_at
```

### alerts
```sql
- id (PK)
- type (energy/occupancy)
- severity (low/medium/high/critical)
- title
- message
- source
- source_id
- metadata (JSON)
- status (active/resolved)
- acknowledged_at
- acknowledged_by
- resolved_at
- resolved_by
- created_at
- updated_at
```

## 🔌 API Endpoints

### Energy Endpoints
```
GET  /api/simulator/energy/latest
GET  /api/simulator/energy/building/:buildingId?hours=1
```

### Occupancy Endpoints
```
GET  /api/simulator/occupancy/latest
GET  /api/simulator/occupancy/room/:roomId?hours=1
```

### Alert Endpoints
```
GET  /api/simulator/alerts?type=energy&severity=high
GET  /api/simulator/alerts/:id
PUT  /api/simulator/alerts/:id/acknowledge
PUT  /api/simulator/alerts/:id/resolve
```

### Dashboard Stats
```
GET  /api/simulator/stats
```

## 🎯 How It Works

### 1. Data Generation Flow
```
Simulator Class
    ↓
Generate Reading (based on time/patterns)
    ↓
Detect Anomaly (check thresholds)
    ↓
Save to Database (energy_readings/occupancy_readings)
    ↓
Create Alert (if anomaly detected)
    ↓
Log to Console (with visual indicators)
```

### 2. Reading Intervals
- **Energy**: Every 5 seconds
- **Occupancy**: Every 10 seconds

### 3. Anomaly Trigger Logic
```javascript
// Random anomaly chance
if (Math.random() < 0.05) {  // 5% chance
  anomalyMultiplier = 1.5 + Math.random() * 0.5;  // 1.5x-2x spike
}

// Threshold checks
if (consumption > thresholds.critical) {
  createAlert('critical', message);
}
```

## 🚀 Usage Commands

```bash
# Setup database tables (run once)
npm run simulator:setup

# Run both simulators
npm run simulator

# Run only energy simulator
npm run simulator:energy

# Run only occupancy simulator
npm run simulator:occupancy
```

## 📊 Real-Time Console Output

### Energy Example
```
🟢 [Main Academic Building] 195.42 kWh | 222V | 888A | PF: 92%
🟠 [Student Center] 267.33 kWh | 223V | 1215A | PF: 91%
🚨 ALERT: Energy HIGH CONSUMPTION - High energy consumption: 267.33 kWh
```

### Occupancy Example
```
🟢 [Lecture Hall A] 142/200 people [███████░░░] 71% | 23°C | CO2: 815 PPM
🔴 [Cafeteria] 285/300 people [█████████░] 95% | 25°C | CO2: 1525 PPM
🚨 ALERT: Occupancy OVERCROWDING - Overcrowding: 285/300 people (95%)
```

## 🎨 Visual Indicators

- 🟢 Green = Normal (0-79% utilization, <250 kWh)
- 🟡 Yellow = Medium alerts
- 🟠 Orange = High alerts (80-94% utilization, 250-300 kWh)
- 🔴 Red = Critical alerts (95%+ utilization, 300+ kWh)
- 🚨 = New alert created

## 🔧 Configuration Points

### Adjustable Parameters

#### Energy Simulator
```javascript
this.buildings = [...];  // Add/remove buildings
this.thresholds = {
  high: 250,
  critical: 300,
  spike: 50
};
```

#### Occupancy Simulator
```javascript
this.rooms = [...];  // Add/remove rooms
this.thresholds = {
  overcrowding: 0.95,
  highUsage: 0.80,
  suddenIncrease: 30
};
```

#### Reading Intervals
```javascript
const ENERGY_INTERVAL = 5;      // seconds
const OCCUPANCY_INTERVAL = 10;  // seconds
```

## 💡 Smart Campus Brain Demonstration

### What It Demonstrates

1. **Real-Time Monitoring** 
   - Live sensor data every 5-10 seconds
   - Realistic patterns based on time of day

2. **Anomaly Detection**
   - Automatic threshold checking
   - Pattern-based anomalies
   - Multi-factor analysis

3. **Alert Generation**
   - Auto-created in database
   - Severity classification
   - Rich metadata

4. **Historical Analysis**
   - All readings stored
   - Queryable by time range
   - Building/room specific

5. **Dashboard Integration**
   - REST API endpoints
   - Real-time data access
   - Alert management

## 📈 Data Accumulation

After running for:
- **1 minute**: ~18 readings (12 energy + 6 occupancy)
- **5 minutes**: ~90 readings
- **1 hour**: ~1,080 readings
- **1 day**: ~25,920 readings

Plus alerts as anomalies are detected (varies randomly).

## 🎯 Integration with Frontend

### Example React Hook
```javascript
const useSimulatorData = () => {
  const [energyData, setEnergyData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const energy = await fetch('/api/simulator/energy/latest');
      const occupancy = await fetch('/api/simulator/occupancy/latest');
      const activeAlerts = await fetch('/api/simulator/alerts');
      
      setEnergyData(await energy.json());
      setOccupancyData(await occupancy.json());
      setAlerts(await activeAlerts.json());
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    
    return () => clearInterval(interval);
  }, []);

  return { energyData, occupancyData, alerts };
};
```

## 🏆 Benefits

1. ✅ **No hardware needed** - Fully virtual
2. ✅ **Realistic patterns** - Time-based behavior
3. ✅ **Random anomalies** - Simulates real-world issues
4. ✅ **Auto-alerts** - Database-driven notifications
5. ✅ **Historical data** - Stored for analysis
6. ✅ **Easy integration** - REST API ready
7. ✅ **Configurable** - Adjust thresholds/buildings/rooms
8. ✅ **Production-ready** - Error handling included

## 🎓 Use Cases

- **Demo presentations** - Show live monitoring
- **Development** - Test frontend without real sensors
- **Training** - Demonstrate alert handling
- **Testing** - Generate test data for analytics
- **Prototyping** - Validate dashboard designs

## 📝 Files Created (10)

1. `src/simulators/energySensorSimulator.js` (265 lines)
2. `src/simulators/occupancySensorSimulator.js` (312 lines)
3. `src/simulators/runSimulators.js` (74 lines)
4. `src/simulators/setupDatabase.js` (89 lines)
5. `src/controllers/simulatorController.js` (284 lines)
6. `src/routes/simulatorRoutes.js` (27 lines)
7. `src/simulators/README.md` (503 lines)
8. `SIMULATOR_QUICKSTART.md` (234 lines)
9. `package.json` (updated with 4 scripts)
10. `index.js` (added simulator routes)

**Total:** ~1,788 lines of production code + documentation

---

**Status:** ✅ Complete and Ready to Use
**Next Step:** Run `npm run simulator:setup` then `npm run simulator`
