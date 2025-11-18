// Mock Data for Smart Campus Dashboard

// =============================================
// ADMIN DATA - Campuses, Rooms, Tickets
// =============================================

// Campus Data (for Energy Monitoring & Admin)
export const campusData = [
  {
    campus_id: 1,
    name: 'Main Campus',
    location: 'Karachi, Pakistan',
    area_sqm: 125000,
    building_count: 8,
    total_capacity: 8500,
    energy_baseline_kwh: 185000,
    status: 'active',
    created_at: '2020-01-15T00:00:00Z'
  },
  {
    campus_id: 2,
    name: 'Engineering Campus',
    location: 'Lahore, Pakistan',
    area_sqm: 95000,
    building_count: 6,
    total_capacity: 6200,
    energy_baseline_kwh: 142000,
    status: 'active',
    created_at: '2021-06-20T00:00:00Z'
  },
  {
    campus_id: 3,
    name: 'Medical Campus',
    location: 'Islamabad, Pakistan',
    area_sqm: 78000,
    building_count: 5,
    total_capacity: 4800,
    energy_baseline_kwh: 125000,
    status: 'active',
    created_at: '2022-03-10T00:00:00Z'
  },
  {
    campus_id: 4,
    name: 'Business School Campus',
    location: 'Karachi, Pakistan',
    area_sqm: 52000,
    building_count: 3,
    total_capacity: 3200,
    energy_baseline_kwh: 89000,
    status: 'active',
    created_at: '2023-01-05T00:00:00Z'
  }
];

// Room Data (for Space Utilization & Admin)
export const roomData = [
  {
    room_id: 1,
    campus_id: 1,
    room_number: 'A-301',
    room_name: 'Computer Lab 1',
    building: 'Building A',
    floor: 3,
    room_type: 'lab',
    capacity: 50,
    current_occupancy: 45,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '08:00', end_time: '10:00', subject: 'Data Structures', instructor: 'Dr. Ahmed Khan' },
      { start_time: '10:30', end_time: '12:30', subject: 'Web Development', instructor: 'Prof. Sarah Ali' }
    ],
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    room_id: 2,
    campus_id: 1,
    room_number: 'A-201',
    room_name: 'Lecture Hall 1',
    building: 'Building A',
    floor: 2,
    room_type: 'lecture-hall',
    capacity: 200,
    current_occupancy: 185,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '09:00', end_time: '11:00', subject: 'Operating Systems', instructor: 'Dr. Usman Shah' },
      { start_time: '14:00', end_time: '16:00', subject: 'Database Systems', instructor: 'Prof. Ayesha Malik' }
    ],
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    room_id: 3,
    campus_id: 1,
    room_number: 'B-401',
    room_name: 'Physics Lab',
    building: 'Building B',
    floor: 4,
    room_type: 'lab',
    capacity: 35,
    current_occupancy: 0,
    status: 'available',
    scheduled_classes: [],
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    room_id: 4,
    campus_id: 1,
    room_number: 'C-101',
    room_name: 'Auditorium',
    building: 'Building C',
    floor: 1,
    room_type: 'auditorium',
    capacity: 500,
    current_occupancy: 0,
    status: 'reserved',
    scheduled_classes: [
      { start_time: '15:00', end_time: '17:00', subject: 'Tech Seminar', instructor: 'Guest Speaker' }
    ],
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    room_id: 5,
    campus_id: 2,
    room_number: 'E-202',
    room_name: 'Engineering Lab 1',
    building: 'Engineering Block',
    floor: 2,
    room_type: 'lab',
    capacity: 40,
    current_occupancy: 38,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '08:30', end_time: '11:30', subject: 'Circuit Design', instructor: 'Dr. Hassan Ali' }
    ],
    created_at: '2023-02-01T00:00:00Z'
  },
  {
    room_id: 6,
    campus_id: 2,
    room_number: 'E-305',
    room_name: 'CAD Lab',
    building: 'Engineering Block',
    floor: 3,
    room_type: 'lab',
    capacity: 30,
    current_occupancy: 12,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '13:00', end_time: '15:00', subject: 'AutoCAD Basics', instructor: 'Engr. Fatima' }
    ],
    created_at: '2023-02-01T00:00:00Z'
  },
  {
    room_id: 7,
    campus_id: 1,
    room_number: 'A-101',
    room_name: 'Classroom 1',
    building: 'Building A',
    floor: 1,
    room_type: 'classroom',
    capacity: 60,
    current_occupancy: 55,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '09:00', end_time: '11:00', subject: 'Mathematics', instructor: 'Prof. Nadia Khan' },
      { start_time: '11:30', end_time: '13:30', subject: 'Physics', instructor: 'Dr. Imran Ahmed' }
    ],
    created_at: '2023-01-15T00:00:00Z'
  },
  {
    room_id: 8,
    campus_id: 3,
    room_number: 'M-201',
    room_name: 'Anatomy Lab',
    building: 'Medical Building',
    floor: 2,
    room_type: 'lab',
    capacity: 45,
    current_occupancy: 42,
    status: 'occupied',
    scheduled_classes: [
      { start_time: '08:00', end_time: '12:00', subject: 'Human Anatomy', instructor: 'Dr. Sana Malik' }
    ],
    created_at: '2023-03-10T00:00:00Z'
  }
];

// Ticket Data (for Maintenance Tracking & Admin)
export const ticketData = [
  {
    ticket_id: 1,
    campus_id: 1,
    title: 'Air Conditioning Not Working',
    description: 'The AC unit in Room A-301 is not cooling properly. Temperature is 32°C.',
    category: 'hvac',
    priority: 'high',
    status: 'open',
    location: 'Building A, Floor 3',
    building: 'Building A',
    room: 'A-301',
    reported_by: 'Dr. Ahmed Khan',
    assigned_to: 'HVAC Team',
    estimated_cost: 5000,
    created_at: '2025-11-18T08:30:00Z',
    updated_at: '2025-11-18T08:30:00Z'
  },
  {
    ticket_id: 2,
    campus_id: 1,
    title: 'Broken Projector',
    description: 'Projector in Lecture Hall 1 shows no display. HDMI port seems damaged.',
    category: 'equipment',
    priority: 'medium',
    status: 'in-progress',
    location: 'Building A, Floor 2',
    building: 'Building A',
    room: 'A-201',
    reported_by: 'Prof. Ayesha Malik',
    assigned_to: 'IT Support',
    estimated_cost: 3500,
    created_at: '2025-11-17T14:20:00Z',
    updated_at: '2025-11-18T09:15:00Z'
  },
  {
    ticket_id: 3,
    campus_id: 1,
    title: 'Water Leakage',
    description: 'Water dripping from ceiling in Building B restroom near Physics Lab.',
    category: 'plumbing',
    priority: 'critical',
    status: 'in-progress',
    location: 'Building B, Floor 4',
    building: 'Building B',
    room: 'Restroom B-401',
    reported_by: 'Cleaning Staff',
    assigned_to: 'Plumbing Team',
    estimated_cost: 8000,
    created_at: '2025-11-18T07:45:00Z',
    updated_at: '2025-11-18T08:00:00Z'
  },
  {
    ticket_id: 4,
    campus_id: 2,
    title: 'Flickering Lights',
    description: 'Multiple tube lights in E-202 are flickering continuously. Causing eye strain.',
    category: 'electrical',
    priority: 'medium',
    status: 'open',
    location: 'Engineering Block, Floor 2',
    building: 'Engineering Block',
    room: 'E-202',
    reported_by: 'Dr. Hassan Ali',
    assigned_to: 'Electrical Maintenance',
    estimated_cost: 2000,
    created_at: '2025-11-18T10:30:00Z',
    updated_at: '2025-11-18T10:30:00Z'
  },
  {
    ticket_id: 5,
    campus_id: 1,
    title: 'Door Lock Malfunction',
    description: 'Smart lock on Auditorium door not responding to access cards.',
    category: 'security',
    priority: 'high',
    status: 'open',
    location: 'Building C, Floor 1',
    building: 'Building C',
    room: 'C-101',
    reported_by: 'Security Department',
    assigned_to: 'Security Systems',
    estimated_cost: 4000,
    created_at: '2025-11-18T06:15:00Z',
    updated_at: '2025-11-18T06:15:00Z'
  },
  {
    ticket_id: 6,
    campus_id: 3,
    title: 'Microscope Not Functioning',
    description: 'Digital microscope #12 in Anatomy Lab has broken lens. Cannot be used for practicals.',
    category: 'equipment',
    priority: 'high',
    status: 'in-progress',
    location: 'Medical Building, Floor 2',
    building: 'Medical Building',
    room: 'M-201',
    reported_by: 'Dr. Sana Malik',
    assigned_to: 'Lab Equipment Team',
    estimated_cost: 15000,
    created_at: '2025-11-17T11:00:00Z',
    updated_at: '2025-11-18T08:45:00Z'
  },
  {
    ticket_id: 7,
    campus_id: 2,
    title: 'Network Switch Down',
    description: 'Network switch in CAD Lab is not working. Students cannot access lab computers.',
    category: 'equipment',
    priority: 'critical',
    status: 'open',
    location: 'Engineering Block, Floor 3',
    building: 'Engineering Block',
    room: 'E-305',
    reported_by: 'IT Department',
    assigned_to: 'Network Team',
    estimated_cost: 12000,
    created_at: '2025-11-18T09:00:00Z',
    updated_at: '2025-11-18T09:00:00Z'
  },
  {
    ticket_id: 8,
    campus_id: 1,
    title: 'Whiteboard Needs Replacement',
    description: 'Whiteboard in Classroom 1 has permanent marker stains and cannot be cleaned.',
    category: 'other',
    priority: 'low',
    status: 'open',
    location: 'Building A, Floor 1',
    building: 'Building A',
    room: 'A-101',
    reported_by: 'Prof. Nadia Khan',
    assigned_to: 'Facilities Team',
    estimated_cost: 1500,
    created_at: '2025-11-16T15:30:00Z',
    updated_at: '2025-11-16T15:30:00Z'
  },
  {
    ticket_id: 9,
    campus_id: 4,
    title: 'Elevator Not Working',
    description: 'Main elevator in Business School is stuck between floors. Emergency maintenance needed.',
    category: 'structural',
    priority: 'critical',
    status: 'in-progress',
    location: 'Business Building, Floor 2-3',
    building: 'Business Building',
    room: 'Elevator 1',
    reported_by: 'Security Guard',
    assigned_to: 'Elevator Contractor',
    estimated_cost: 25000,
    created_at: '2025-11-18T07:00:00Z',
    updated_at: '2025-11-18T07:30:00Z'
  },
  {
    ticket_id: 10,
    campus_id: 1,
    title: 'Cleaning Required',
    description: 'Deep cleaning needed in cafeteria after event. Spills and waste everywhere.',
    category: 'cleaning',
    priority: 'medium',
    status: 'resolved',
    location: 'Student Center, Ground Floor',
    building: 'Student Center',
    room: 'Cafeteria',
    reported_by: 'Cafeteria Manager',
    assigned_to: 'Cleaning Team',
    estimated_cost: 500,
    created_at: '2025-11-17T18:00:00Z',
    updated_at: '2025-11-18T06:00:00Z'
  }
];

// =============================================
// DASHBOARD & MODULE DATA
// =============================================

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
