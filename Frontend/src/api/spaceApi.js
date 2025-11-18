import { spaceData } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get space utilization summary
export async function getSpaceSummary() {
  await delay();
  return spaceData.summary;
}

// Get current occupancy data
export async function getSpaceOccupancy(filter = 'all') {
  await delay();
  
  if (filter === 'all') {
    return spaceData.occupancy;
  }
  
  return spaceData.occupancy.filter(room => room.status === filter);
}

// Get space heatmap data
export async function getSpaceHeatmap() {
  await delay();
  return spaceData.heatmap;
}

// Get optimization suggestions
export async function getSpaceSuggestions() {
  await delay();
  return spaceData.suggestions;
}

// Get occupancy by building
export async function getOccupancyByBuilding(buildingName) {
  await delay();
  return spaceData.occupancy.filter(room => room.building === buildingName);
}

// Get room details
export async function getRoomDetails(roomName) {
  await delay();
  const room = spaceData.occupancy.find(r => r.room === roomName);
  
  if (room) {
    return {
      ...room,
      history: [
        { time: '08:00', occupancy: Math.floor(room.current * 0.3) },
        { time: '09:00', occupancy: Math.floor(room.current * 0.6) },
        { time: '10:00', occupancy: Math.floor(room.current * 0.9) },
        { time: '11:00', occupancy: room.current },
        { time: '12:00', occupancy: Math.floor(room.current * 0.8) }
      ]
    };
  }
  
  return null;
}
