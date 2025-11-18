// Mock Data for Smart Campus Dashboard

// Energy Monitoring Data
export const energyData = {
  summary: {
    totalConsumption: 45678,
    totalCost: 12340,
    avgEfficiency: 87,
    anomalyCount: 3
  },
  
  buildings: [
    { id: 1, name: 'Main Academic Building' },
    { id: 2, name: 'Engineering Complex' },
    { id: 3, name: 'Science Labs' },
    { id: 4, name: 'Student Center' },
    { id: 5, name: 'Library' },
    { id: 6, name: 'Sports Complex' }
  ],
  
  timeSeriesData: {
    hourly: [
      { label: '00:00', value: 3200 },
      { label: '01:00', value: 2800 },
      { label: '02:00', value: 2500 },
      { label: '03:00', value: 2400 },
      { label: '04:00', value: 2600 },
      { label: '05:00', value: 3100 },
      { label: '06:00', value: 4200 },
      { label: '07:00', value: 5800 },
      { label: '08:00', value: 7200 },
      { label: '09:00', value: 8500 },
      { label: '10:00', value: 9100 },
      { label: '11:00', value: 9400 },
      { label: '12:00', value: 8900 },
      { label: '13:00', value: 9200 },
      { label: '14:00', value: 9600 },
      { label: '15:00', value: 9300 },
      { label: '16:00', value: 8800 },
      { label: '17:00', value: 7600 },
      { label: '18:00', value: 6400 },
      { label: '19:00', value: 5200 },
      { label: '20:00', value: 4500 },
      { label: '21:00', value: 4100 },
      { label: '22:00', value: 3800 },
      { label: '23:00', value: 3400 }
    ],
    daily: [
      { label: 'Mon', value: 152000 },
      { label: 'Tue', value: 148000 },
      { label: 'Wed', value: 155000 },
      { label: 'Thu', value: 151000 },
      { label: 'Fri', value: 149000 },
      { label: 'Sat', value: 98000 },
      { label: 'Sun', value: 87000 }
    ],
    weekly: [
      { label: 'Week 1', value: 940000 },
      { label: 'Week 2', value: 935000 },
      { label: 'Week 3', value: 952000 },
      { label: 'Week 4', value: 928000 }
    ]
  },
  
  anomalies: [
    {
      id: 1,
      building: 'Engineering Complex',
      location: 'Floor 3 - Lab A',
      timestamp: '2025-11-18 14:23:00',
      severity: 'high',
      consumption: 12500,
      expected: 8200,
      deviation: '+52%'
    },
    {
      id: 2,
      building: 'Science Labs',
      location: 'Floor 2 - Research Wing',
      timestamp: '2025-11-18 13:45:00',
      severity: 'medium',
      consumption: 9800,
      expected: 7500,
      deviation: '+31%'
    },
    {
      id: 3,
      building: 'Student Center',
      location: 'Cafeteria',
      timestamp: '2025-11-18 12:10:00',
      severity: 'low',
      consumption: 6200,
      expected: 5100,
      deviation: '+22%'
    }
  ]
};

// Space Utilization Data
export const spaceData = {
  summary: {
    totalRooms: 342,
    occupied: 187,
    available: 142,
    overCapacity: 13
  },
  
  occupancy: [
    { room: 'LH-101', building: 'Main Academic', capacity: 150, current: 145, status: 'optimal', percentage: 97 },
    { room: 'LH-102', building: 'Main Academic', capacity: 120, current: 118, status: 'optimal', percentage: 98 },
    { room: 'LH-201', building: 'Main Academic', capacity: 200, current: 215, status: 'overcapacity', percentage: 108 },
    { room: 'LAB-A1', building: 'Engineering', capacity: 40, current: 38, status: 'optimal', percentage: 95 },
    { room: 'LAB-A2', building: 'Engineering', capacity: 40, current: 12, status: 'underutilized', percentage: 30 },
    { room: 'LAB-B1', building: 'Science Labs', capacity: 35, current: 33, status: 'optimal', percentage: 94 },
    { room: 'LH-301', building: 'Main Academic', capacity: 180, current: 45, status: 'underutilized', percentage: 25 },
    { room: 'SR-101', building: 'Student Center', capacity: 25, current: 0, status: 'available', percentage: 0 },
    { room: 'SR-102', building: 'Student Center', capacity: 25, current: 24, status: 'optimal', percentage: 96 },
    { room: 'LH-401', building: 'Engineering', capacity: 100, current: 108, status: 'overcapacity', percentage: 108 }
  ],
  
  heatmap: Array.from({ length: 50 }, (_, i) => ({
    id: `room-${i + 1}`,
    name: `Room ${i + 1}`,
    occupancy: Math.floor(Math.random() * 120),
    capacity: 100,
    status: Math.random() > 0.7 ? 'overcapacity' : Math.random() > 0.4 ? 'optimal' : Math.random() > 0.2 ? 'underutilized' : 'available'
  })),
  
  suggestions: [
    {
      id: 1,
      type: 'merge',
      title: 'Merge LH-301 and LH-302',
      description: 'Both lecture halls are underutilized. Merging classes could save energy.',
      impact: 'High',
      savings: '$450/week'
    },
    {
      id: 2,
      type: 'relocate',
      title: 'Relocate Class from LH-201',
      description: 'LH-201 is over capacity. Move to LH-301 which has 135 empty seats.',
      impact: 'Critical',
      savings: 'Safety improvement'
    },
    {
      id: 3,
      type: 'optimize',
      title: 'Optimize Lab Schedules',
      description: 'Engineering labs are 30% utilized. Consolidate time slots.',
      impact: 'Medium',
      savings: '$320/week'
    },
    {
      id: 4,
      type: 'expand',
      title: 'Add Evening Sections',
      description: 'High demand during 9-12 AM. Consider evening alternatives.',
      impact: 'Medium',
      savings: 'Better distribution'
    }
  ]
};

// Maintenance Tracking Data
export const maintenanceData = {
  summary: {
    openTickets: 24,
    inProgress: 12,
    resolved: 156,
    avgResponseTime: '2.3 hours'
  },
  
  tickets: [
    {
      id: 'MT-1001',
      title: 'HVAC System Malfunction',
      building: 'Engineering Complex',
      location: 'Floor 3',
      priority: 'high',
      status: 'in-progress',
      reportedBy: 'System',
      assignedTo: 'John Smith',
      createdAt: '2025-11-18 08:30:00',
      description: 'Cooling system not responding in Engineering Complex Floor 3'
    },
    {
      id: 'MT-1002',
      title: 'Lighting Issue',
      building: 'Main Academic',
      location: 'LH-201',
      priority: 'medium',
      status: 'open',
      reportedBy: 'Dr. Ahmed',
      assignedTo: 'Maintenance Team',
      createdAt: '2025-11-18 09:15:00',
      description: 'Multiple lights flickering in lecture hall'
    },
    {
      id: 'MT-1003',
      title: 'Water Leak Detection',
      building: 'Science Labs',
      location: 'Floor 2 - Restroom',
      priority: 'high',
      status: 'in-progress',
      reportedBy: 'System',
      assignedTo: 'Mike Johnson',
      createdAt: '2025-11-18 07:45:00',
      description: 'Moisture sensor detected potential water leak'
    },
    {
      id: 'MT-1004',
      title: 'Door Lock Maintenance',
      building: 'Student Center',
      location: 'Room SR-105',
      priority: 'low',
      status: 'open',
      reportedBy: 'Staff',
      assignedTo: 'Unassigned',
      createdAt: '2025-11-18 10:20:00',
      description: 'Smart lock not responding to access cards'
    },
    {
      id: 'MT-1005',
      title: 'Projector Not Working',
      building: 'Main Academic',
      location: 'LH-102',
      priority: 'medium',
      status: 'open',
      reportedBy: 'Prof. Sarah',
      assignedTo: 'Tech Support',
      createdAt: '2025-11-18 11:00:00',
      description: 'Projector shows no signal despite proper connections'
    },
    {
      id: 'MT-1006',
      title: 'Elevator Maintenance',
      building: 'Library',
      location: 'Main Elevator',
      priority: 'medium',
      status: 'in-progress',
      reportedBy: 'System',
      assignedTo: 'External Contractor',
      createdAt: '2025-11-18 06:00:00',
      description: 'Scheduled monthly elevator inspection and maintenance'
    },
    {
      id: 'MT-1007',
      title: 'Network Connectivity Issue',
      building: 'Engineering Complex',
      location: 'LAB-A2',
      priority: 'high',
      status: 'open',
      reportedBy: 'Student',
      assignedTo: 'IT Department',
      createdAt: '2025-11-18 12:30:00',
      description: 'No internet connectivity in computer lab'
    }
  ]
};

// Dashboard Data (aggregated)
export const dashboardData = {
  stats: {
    energy: {
      current: '8,542 kWh',
      trend: 'down',
      change: '-5.2%',
      status: 'good'
    },
    space: {
      utilization: '54.7%',
      trend: 'up',
      change: '+3.1%',
      status: 'optimal'
    },
    maintenance: {
      open: 24,
      trend: 'up',
      change: '+12%',
      status: 'warning'
    },
    alerts: {
      critical: 3,
      warnings: 8,
      info: 15
    }
  },
  
  recentAlerts: [
    {
      id: 1,
      type: 'danger',
      message: 'High energy consumption detected in Engineering Complex',
      timestamp: '5 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'LH-201 exceeding capacity limits',
      timestamp: '12 minutes ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'Scheduled maintenance completed for Library HVAC',
      timestamp: '1 hour ago'
    }
  ]
};
