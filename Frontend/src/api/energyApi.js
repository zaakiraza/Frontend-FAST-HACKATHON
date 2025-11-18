import { energyData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get energy summary
export async function getEnergySummary() {
  await delay();
  return energyData.summary;
}

// Get list of buildings
export async function getBuildings() {
  await delay();
  return energyData.buildings;
}

// Get energy time series data
export async function getEnergyTimeSeries(buildingId = null, timeRange = 'hourly') {
  await delay();
  
  // If specific building is requested, return modified data
  if (buildingId) {
    const building = energyData.buildings.find(b => b.id === buildingId);
    return {
      building: building?.name,
      data: energyData.timeSeriesData[timeRange].map(item => ({
        ...item,
        value: Math.floor(item.value * (0.8 + Math.random() * 0.4))
      }))
    };
  }
  
  return energyData.timeSeriesData[timeRange];
}

// Get energy anomalies
export async function getEnergyAnomalies() {
  await delay();
  return energyData.anomalies;
}

// Get detailed energy data for a specific building
export async function getBuildingEnergyDetail(buildingId) {
  await delay();
  const building = energyData.buildings.find(b => b.id === buildingId);
  
  return {
    building: building?.name,
    consumption: Math.floor(Math.random() * 50000 + 100000),
    cost: Math.floor(Math.random() * 15000 + 25000),
    efficiency: Math.floor(Math.random() * 20 + 75),
    anomalies: energyData.anomalies.filter(() => Math.random() > 0.5)
  };
}
