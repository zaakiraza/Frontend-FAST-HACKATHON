# 🧠 Smart Campus IoT Sensor Simulators

Virtual IoT sensors that simulate real-time energy consumption and occupancy data for the Smart Campus Management System.

## 📋 Features

### ⚡ Energy Sensor Simulator
- **5 Buildings** monitored in real-time
- **Time-based patterns** (peak hours, night hours)
- **Realistic metrics**: kWh consumption, voltage, current, power factor
- **Anomaly detection**:
  - Critical threshold (>300 kWh)
  - High consumption (>250 kWh)
  - Sudden spikes (>50 kWh increase)
  - Voltage anomalies
  - Low power factor
- **Auto-alert generation** when thresholds exceeded

### 👥 Occupancy Sensor Simulator
- **10 Rooms** across campus
- **Time & day-aware patterns** (weekday vs weekend, peak hours)
- **Room types**: Lecture halls, labs, study rooms, cafeteria, gym, auditorium
- **Realistic metrics**: Occupancy count, utilization rate, temperature, CO2 levels
- **Anomaly detection**:
  - Overcrowding (>95% capacity)
  - High usage (>80% capacity)
  - Sudden crowd increase
  - Poor air quality (>1000 PPM CO2)
  - High temperature with high occupancy
- **Auto-alert generation** for all anomalies

## 🚀 Quick Start

### 1. Setup Database Tables

```bash
cd Backend/src/simulators
node runSimulators.js --setup
```

This creates three tables:
- `energy_readings` - Stores energy sensor data
- `occupancy_readings` - Stores occupancy sensor data
- `alerts` - Stores all anomaly alerts

### 2. Run Both Simulators

```bash
node runSimulators.js
```

### 3. Run Individual Simulators

```bash
# Energy only
node runSimulators.js energy

# Occupancy only
node runSimulators.js occupancy
```

### 4. Stop Simulators

Press `Ctrl+C` to gracefully stop all running simulators.

## 📊 Real-Time Console Output

### Energy Simulator
```
⚡ Starting Energy Sensor Simulator...
📊 Monitoring 5 buildings
⏱️  Reading interval: 5 seconds
🎯 Thresholds: High=250kWh, Critical=300kWh

🟢 [Main Academic Building] 195.42 kWh | 222V | 888A | PF: 92%
🟢 [Engineering Complex] 245.78 kWh | 218V | 1117A | PF: 89%
🟠 [Student Center] 267.33 kWh | 223V | 1215A | PF: 91%
🚨 ALERT CREATED: Energy HIGH CONSUMPTION - High energy consumption detected: 267.33 kWh
```

### Occupancy Simulator
```
👥 Starting Occupancy Sensor Simulator...
🏢 Monitoring 10 rooms across campus
⏱️  Reading interval: 10 seconds
🎯 Thresholds: High Usage=80%, Overcrowding=95%

🟢 [Lecture Hall A] 142/200 people [███████░░░] 71% | 23°C | CO2: 815 PPM
🟠 [Cafeteria] 285/300 people [█████████░] 95% | 25°C | CO2: 1525 PPM
🚨 ALERT CREATED: Occupancy OVERCROWDING - Overcrowding detected: 285/300 people (95% capacity)
```

## 🔌 API Endpoints

All endpoints are available at `http://localhost:3000/api/simulator`

### Energy Endpoints

```http
GET /api/simulator/energy/latest
GET /api/simulator/energy/building/:buildingId?hours=1
```

### Occupancy Endpoints

```http
GET /api/simulator/occupancy/latest
GET /api/simulator/occupancy/room/:roomId?hours=1
```

### Alerts Endpoints

```http
GET /api/simulator/alerts?type=energy&severity=high
GET /api/simulator/alerts/:id
PUT /api/simulator/alerts/:id/acknowledge
PUT /api/simulator/alerts/:id/resolve
```

### Dashboard Stats

```http
GET /api/simulator/stats
```

Returns aggregated statistics:
- Total energy consumption
- Average occupancy rates
- Active alert counts by severity
- Critical incidents

## 📈 Example API Response

### Latest Energy Readings
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "building_id": 1,
      "building_name": "Main Academic Building",
      "consumption_kwh": 195.42,
      "voltage": 222.15,
      "current_amps": 888.27,
      "power_factor": 0.92,
      "timestamp": "2025-11-19T10:30:45.000Z"
    }
  ]
}
```

### Latest Occupancy Readings
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "room_id": 1,
      "room_name": "Lecture Hall A",
      "building": "Main Academic",
      "room_type": "lecture",
      "occupancy": 142,
      "capacity": 200,
      "utilization_rate": 0.71,
      "temperature": 23.45,
      "co2_level": 815.23,
      "timestamp": "2025-11-19T10:30:50.000Z"
    }
  ]
}
```

### Active Alerts
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "energy",
      "severity": "high",
      "title": "Energy HIGH CONSUMPTION",
      "message": "High energy consumption detected: 267.33 kWh",
      "source": "energy_sensor",
      "source_id": 3,
      "metadata": {
        "building_id": 3,
        "building_name": "Student Center",
        "consumption": 267.33,
        "voltage": 223.45,
        "anomaly_type": "high_consumption"
      },
      "status": "active",
      "created_at": "2025-11-19T10:30:45.000Z"
    }
  ]
}
```

## 🎯 Simulation Parameters

### Energy Simulator
- **Base Consumption Range**: 80-200 kWh per building
- **Time Multipliers**:
  - Peak hours (8am-6pm): 1.3x
  - Evening (7pm-10pm): 1.1x
  - Night (11pm-7am): 0.7x
- **Anomaly Chance**: 5% per reading
- **Reading Interval**: 5 seconds

### Occupancy Simulator
- **Capacity Range**: 20-500 people per room
- **Time-based Patterns**:
  - Weekday peak: 70-80% utilization
  - Weekend: 20% utilization
  - Night: 10% utilization
- **Special Times**:
  - Cafeteria lunch/dinner rush
  - Gym evening peak (5pm-8pm)
- **Anomaly Chance**: 3% per reading
- **Reading Interval**: 10 seconds

## 🔧 Configuration

Edit the simulators to customize:

### Energy Buildings
```javascript
// In energySensorSimulator.js
this.buildings = [
  { id: 1, name: 'Your Building', baseConsumption: 150, variation: 30 }
];
```

### Occupancy Rooms
```javascript
// In occupancySensorSimulator.js
this.rooms = [
  { id: 1, name: 'Your Room', capacity: 200, type: 'lecture', building: 'Building Name' }
];
```

### Thresholds
```javascript
// Energy thresholds
this.thresholds = {
  high: 250,      // kWh
  critical: 300,  // kWh
  spike: 50       // kWh sudden increase
};

// Occupancy thresholds
this.thresholds = {
  overcrowding: 0.95,    // 95% capacity
  highUsage: 0.80,       // 80% capacity
  suddenIncrease: 30     // 30 people
};
```

## 🗄️ Database Schema

### energy_readings
- `id` - Primary key
- `building_id` - Building identifier
- `building_name` - Building name
- `consumption_kwh` - Energy consumption in kWh
- `voltage` - Voltage in V
- `current_amps` - Current in Amperes
- `power_factor` - Power factor (0-1)
- `timestamp` - Reading timestamp
- `created_at` - Record creation time

### occupancy_readings
- `id` - Primary key
- `room_id` - Room identifier
- `room_name` - Room name
- `building` - Building name
- `room_type` - Type of room
- `occupancy` - Current occupancy count
- `capacity` - Maximum capacity
- `utilization_rate` - Occupancy/Capacity ratio
- `temperature` - Temperature in °C
- `co2_level` - CO2 level in PPM
- `timestamp` - Reading timestamp
- `created_at` - Record creation time

### alerts
- `id` - Primary key
- `type` - Alert type (energy/occupancy)
- `severity` - Severity level (low/medium/high/critical)
- `title` - Alert title
- `message` - Alert message
- `source` - Alert source (sensor type)
- `source_id` - Source identifier
- `metadata` - JSON metadata
- `status` - Alert status (active/resolved)
- `acknowledged_at` - Acknowledgement timestamp
- `resolved_at` - Resolution timestamp
- `created_at` - Creation timestamp

## 🎨 Integration with Frontend

The simulators are designed to work seamlessly with your React frontend:

1. **Real-time Data**: Poll the `/latest` endpoints every few seconds
2. **Historical Charts**: Use the history endpoints with `?hours=24` parameter
3. **Alert Dashboard**: Display active alerts with severity badges
4. **Live Updates**: Combine with WebSocket for instant notifications (optional)

## 🚀 Production Deployment

For production use:

1. **Run as Background Service**: Use PM2 or systemd
```bash
pm2 start src/simulators/runSimulators.js --name "iot-simulators"
```

2. **Adjust Intervals**: Increase intervals for lower database load
3. **Data Retention**: Set up cron jobs to archive old readings
4. **Monitoring**: Add health check endpoints
5. **Scaling**: Run multiple instances for different campuses

## 📝 Notes

- Simulators will continue running until stopped with Ctrl+C
- All readings are stored in the database for historical analysis
- Alerts auto-expire after resolution
- Database tables are created automatically on first setup
- No external hardware required - fully virtual simulation

## 🤝 Contributing

To add new sensor types:
1. Create new simulator class in `src/simulators/`
2. Add database schema in `setupDatabase.js`
3. Add routes in `simulatorRoutes.js`
4. Add controller methods in `simulatorController.js`

---

**Built for the Smart Campus Management System** 🎓🏫
