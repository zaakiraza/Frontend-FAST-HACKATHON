# 🚀 IoT Simulators Quick Start Guide

## Step 1: Setup Database Tables

```bash
cd Backend
npm run simulator:setup
```

**Output:**
```
📋 Creating simulator database tables...

✅ Created energy_readings table
✅ Created occupancy_readings table
✅ Created alerts table

🎉 All simulator tables created successfully!
```

## Step 2: Run the Simulators

### Option A: Run Both Simulators (Recommended)
```bash
npm run simulator
```

### Option B: Run Individual Simulators
```bash
# Energy only
npm run simulator:energy

# Occupancy only
npm run simulator:occupancy
```

## Step 3: Watch Real-Time Data

You'll see live console output:

```
═══════════════════════════════════════════════════════
🧠 SMART CAMPUS IoT SENSOR SIMULATORS
═══════════════════════════════════════════════════════

⚡ Starting Energy Sensor Simulator...
📊 Monitoring 5 buildings
⏱️  Reading interval: 5 seconds
🎯 Thresholds: High=250kWh, Critical=300kWh

👥 Starting Occupancy Sensor Simulator...
🏢 Monitoring 10 rooms across campus
⏱️  Reading interval: 10 seconds
🎯 Thresholds: High Usage=80%, Overcrowding=95%

═══════════════════════════════════════════════════════
✅ Simulators running...
📊 Real-time data generation in progress
🚨 Anomaly detection active
⚠️  Press Ctrl+C to stop
═══════════════════════════════════════════════════════

🟢 [Main Academic Building] 165.23 kWh | 221V | 750A | PF: 91%
🟢 [Engineering Complex] 213.45 kWh | 219V | 976A | PF: 88%
🟠 [Student Center] 268.92 kWh | 224V | 1201A | PF: 93%
🚨 ALERT CREATED: Energy HIGH CONSUMPTION - High energy consumption detected: 268.92 kWh

🟢 [Lecture Hall A] 135/200 people [██████░░░░] 68% | 22°C | CO2: 775 PPM
🟢 [Lab 101] 28/40 people [███████░░░] 70% | 23°C | CO2: 540 PPM
🟠 [Cafeteria] 278/300 people [█████████░] 93% | 25°C | CO2: 1490 PPM
🚨 ALERT CREATED: Occupancy HIGH USAGE - High occupancy: 278/300 people (93% capacity)
```

## Step 4: Test the API

### Get Latest Energy Readings
```bash
curl http://localhost:3000/api/simulator/energy/latest
```

### Get Latest Occupancy Readings
```bash
curl http://localhost:3000/api/simulator/occupancy/latest
```

### Get Active Alerts
```bash
curl http://localhost:3000/api/simulator/alerts
```

### Get Dashboard Statistics
```bash
curl http://localhost:3000/api/simulator/stats
```

## Step 5: Stop the Simulators

Press `Ctrl+C` in the terminal:

```
^C
🛑 Shutting down simulators...
🛑 Stopping Energy Sensor Simulator...
🛑 Stopping Occupancy Sensor Simulator...
👋 Goodbye!
```

## 🎯 What Each Simulator Does

### ⚡ Energy Sensor Simulator (5 second intervals)
- Monitors 5 buildings on campus
- Generates realistic kWh consumption based on time of day
- Tracks voltage, current, and power factor
- Detects anomalies:
  - Critical consumption (>300 kWh)
  - High consumption (>250 kWh)
  - Sudden spikes
  - Voltage issues
  - Low power factor
- Auto-creates alerts in database

### 👥 Occupancy Sensor Simulator (10 second intervals)
- Monitors 10 rooms/spaces across campus
- Simulates realistic occupancy patterns:
  - Peak hours: 70-80% utilization
  - Lunch rush: Cafeteria at 95%+
  - Evening gym: 80-90% utilization
  - Weekends: Low occupancy
- Tracks temperature and CO2 levels
- Detects anomalies:
  - Overcrowding (>95% capacity)
  - High usage (>80% capacity)
  - Sudden crowd increases
  - Poor air quality
  - High temperature
- Auto-creates alerts in database

## 📊 Database Tables Created

1. **energy_readings** - Stores all energy sensor data
2. **occupancy_readings** - Stores all occupancy sensor data
3. **alerts** - Stores all anomaly alerts

## 🔌 Integration with Frontend

Add these endpoints to your React app:

```javascript
// Fetch latest energy data
const response = await fetch('http://localhost:3000/api/simulator/energy/latest');
const { data } = await response.json();

// Fetch latest occupancy data
const response = await fetch('http://localhost:3000/api/simulator/occupancy/latest');
const { data } = await response.json();

// Fetch active alerts
const response = await fetch('http://localhost:3000/api/simulator/alerts?severity=high');
const { data } = await response.json();
```

## 🎨 Visual Indicators

- 🟢 Green = Normal operation
- 🟡 Yellow = Medium severity
- 🟠 Orange = High severity
- 🔴 Red = Critical alert
- 🚨 Alert icon = New alert created

## 💡 Pro Tips

1. **Run simulators in separate terminal** from your main server
2. **Let them run for 5-10 minutes** to accumulate data for charts
3. **Watch for anomalies** - they appear randomly to simulate real-world scenarios
4. **Check the database** - All data is persisted for historical analysis
5. **Build dashboards** using the API endpoints

## 🐛 Troubleshooting

**Simulators won't start:**
```bash
# Make sure database tables exist
npm run simulator:setup

# Check if backend server is running
npm run dev
```

**No alerts being created:**
- Alerts are random (5% chance for energy, 3% for occupancy)
- Wait 2-3 minutes for anomalies to trigger
- Check thresholds in simulator code if needed

**Database errors:**
- Verify .env database credentials
- Check if tables were created successfully
- Ensure MySQL connection is active

## 📚 Next Steps

1. ✅ Setup tables (`npm run simulator:setup`)
2. ✅ Run simulators (`npm run simulator`)
3. ✅ Test API endpoints
4. 🎨 Build real-time dashboard in React
5. 📈 Create charts for historical data
6. 🚨 Add alert notification UI
7. 🎯 Implement alert acknowledgement

---

**Congratulations!** 🎉 Your Smart Campus brain is now generating real-time IoT data!
