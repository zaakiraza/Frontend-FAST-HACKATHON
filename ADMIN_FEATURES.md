# Smart Campus Dashboard - Admin Features

## 📋 Overview

This document provides a comprehensive guide to the newly added **Admin Features** for the Smart Campus Dashboard. These features enable administrators to manage campuses, rooms, and maintenance tickets through intuitive CRUD interfaces.

---

## ✅ What Has Been Added

### 1. **Campus Management** (`/admin/campuses`)
- **Purpose**: Manage campus locations for energy monitoring
- **Features**:
  - View all campuses in a card grid layout
  - Add new campuses with complete information
  - Edit existing campus details
  - Delete campuses
  - View campus statistics (buildings, capacity, area, energy baseline)
  - Status management (Active/Inactive/Maintenance)

**Key Fields:**
- Campus Name
- Location
- Area (m²)
- Building Count
- Total Capacity
- Energy Baseline (kWh)
- Status

---

### 2. **Room Management** (`/admin/rooms`)
- **Purpose**: Manage rooms, capacity, and class schedules for space utilization
- **Features**:
  - View all rooms in a searchable table
  - Filter by campus, room type, and status
  - Add new rooms with scheduling
  - Edit room details and schedules
  - Delete rooms
  - Track current occupancy
  - Schedule multiple classes per room
  - View capacity statistics

**Key Fields:**
- Campus
- Room Number
- Room Name
- Building & Floor
- Room Type (Classroom/Lab/Lecture Hall/Auditorium/Library/Office)
- Capacity & Current Occupancy
- Status (Available/Occupied/Maintenance/Reserved)
- Class Schedules (Time, Subject, Instructor)

---

### 3. **Ticket Management** (`/admin/tickets`)
- **Purpose**: Create and track maintenance requests
- **Features**:
  - View all maintenance tickets in a table
  - Filter by priority, status, and category
  - Create new maintenance tickets
  - Edit ticket details and status
  - Delete tickets
  - Track estimated costs
  - Assign tickets to technicians
  - Priority-based categorization
  - Real-time statistics dashboard

**Key Fields:**
- Campus
- Title & Description
- Category (Electrical/Plumbing/HVAC/Structural/Equipment/Cleaning/Security/Other)
- Priority (Low/Medium/High/Critical)
- Status (Open/In Progress/Resolved/Closed)
- Location (Building & Room)
- Reported By & Assigned To
- Estimated Cost

---

## 📁 File Structure

```
Frontend/src/
├── pages/
│   ├── AdminCampuses/
│   │   ├── AdminCampuses.jsx
│   │   └── AdminCampuses.css
│   ├── AdminRooms/
│   │   ├── AdminRooms.jsx
│   │   └── AdminRooms.css
│   └── AdminTickets/
│       ├── AdminTickets.jsx
│       └── AdminTickets.css
│
├── api/
│   ├── campusApi.js          # Campus CRUD operations
│   ├── roomApi.js             # Room CRUD operations
│   ├── ticketApi.js           # Ticket CRUD operations
│   └── mockData.js            # Updated with admin data
│
├── components/
│   └── Layout/
│       ├── Sidebar.jsx        # Updated with admin menu
│       └── Sidebar.css        # Added section styling
│
└── router/
    └── AppRouter.jsx          # Added admin routes
```

---

## 🗄️ Mock Data Structure

### Campus Data
```javascript
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
}
```

### Room Data
```javascript
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
    { 
      start_time: '08:00', 
      end_time: '10:00', 
      subject: 'Data Structures', 
      instructor: 'Dr. Ahmed Khan' 
    }
  ],
  created_at: '2023-01-15T00:00:00Z'
}
```

### Ticket Data
```javascript
{
  ticket_id: 1,
  campus_id: 1,
  title: 'Air Conditioning Not Working',
  description: 'The AC unit in Room A-301 is not cooling properly.',
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
}
```

---

## 🚀 How to Use

### 1. Access Admin Pages

Navigate to the admin section using the sidebar menu:
- **Campus Management**: Click "Campus Management" under "Admin"
- **Room Management**: Click "Room Management" under "Admin"
- **Ticket Management**: Click "Ticket Management" under "Admin"

### 2. Campus Management

**Add Campus:**
1. Click "Add Campus" button
2. Fill in campus details (name, location, area, etc.)
3. Click "Create Campus"

**Edit Campus:**
1. Click "Edit" button on any campus card
2. Modify details in the modal
3. Click "Update Campus"

**Delete Campus:**
1. Click "Delete" button on any campus card
2. Confirm deletion

### 3. Room Management

**Add Room:**
1. Click "Add Room" button
2. Select campus from dropdown
3. Fill in room details
4. Add class schedules (optional):
   - Enter start/end time
   - Enter subject and instructor
   - Click "Add to Schedule"
5. Click "Create Room"

**Filter Rooms:**
- Use dropdowns to filter by Campus, Room Type, or Status
- View filtered results in the table

**Edit/Delete:**
- Use action buttons in the table rows

### 4. Ticket Management

**Create Ticket:**
1. Click "Create Ticket" button
2. Select campus
3. Fill in ticket details
4. Set priority and category
5. Add location information
6. Click "Create Ticket"

**View Statistics:**
- Dashboard shows total tickets, open, in-progress, and critical counts

**Filter Tickets:**
- Use filters for Priority, Status, and Category

---

## 🔌 Backend Integration

### Environment Setup

1. Navigate to Backend folder:
```bash
cd Backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_NAME=smart_campus
DB_USER=root
DB_PASSWORD=your_password
```

3. Run database migrations:
```bash
npm run db:migrate
```

4. Start server:
```bash
npm run dev
```

### API Endpoints

All API endpoints are documented in `API_DOCUMENTATION.md`:

**Campus API:**
- `GET /api/campuses` - Get all campuses
- `POST /api/campuses` - Create campus
- `PUT /api/campuses/:id` - Update campus
- `DELETE /api/campuses/:id` - Delete campus
- `GET /api/campuses/stats` - Get statistics

**Room API:**
- `GET /api/rooms` - Get all rooms (with filters)
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `GET /api/rooms/stats` - Get statistics

**Ticket API:**
- `GET /api/tickets` - Get all tickets (with filters)
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `GET /api/tickets/stats` - Get statistics

### Frontend API Integration

Update API base URL in each API file:

```javascript
// src/api/campusApi.js
const API_BASE_URL = 'http://localhost:5000/api';
```

Replace mock delay with actual fetch:

```javascript
export const getCampuses = async () => {
  const response = await fetch(`${API_BASE_URL}/campuses`);
  const result = await response.json();
  return result.data;
};
```

---

## 🎨 UI Components Used

All admin pages utilize existing reusable components:

1. **Modal** - For create/edit forms
2. **Alert** - For success/error messages
3. **SimpleTable** - For data display (Rooms & Tickets)
4. **FontAwesome Icons** - For visual consistency

**Color Scheme:**
- Success: Green (#22c55e)
- Warning: Orange (#f97316)
- Danger: Red (#ef4444)
- Info: Blue (#3b82f6)

---

## 📊 Data Flow

### Create Flow
```
User Input → Form Validation → API Call → Mock Data Update → UI Refresh → Success Alert
```

### Read Flow
```
Page Load → API Call → Fetch Mock Data → State Update → UI Render
```

### Update Flow
```
Edit Click → Load Data → Modal Open → User Edit → API Call → Update Data → UI Refresh
```

### Delete Flow
```
Delete Click → Confirm Dialog → API Call → Remove from Mock Data → UI Refresh
```

---

## 🧪 Testing

### Manual Testing Checklist

**Campus Management:**
- [ ] Create campus with all fields
- [ ] Create campus with minimal fields (name + location only)
- [ ] Edit campus details
- [ ] Delete campus
- [ ] View campus statistics
- [ ] Check status badge colors

**Room Management:**
- [ ] Create room with schedules
- [ ] Create room without schedules
- [ ] Filter by campus
- [ ] Filter by room type
- [ ] Filter by status
- [ ] Edit room and add/remove schedules
- [ ] Delete room
- [ ] Check occupancy calculations

**Ticket Management:**
- [ ] Create ticket with all fields
- [ ] Filter by priority
- [ ] Filter by status
- [ ] Filter by category
- [ ] Edit ticket status
- [ ] Delete ticket
- [ ] View statistics cards
- [ ] Check priority badge colors

---

## 📝 Questions Answered

### Q1: Is there an option or page from admin to add campuses for analyzing ENERGY MONITORING DATA?
✅ **YES** - `/admin/campuses` page allows admins to:
- Add campuses with energy baseline values
- Track energy consumption per campus
- Manage campus status for maintenance tracking

### Q2: Is there an option or page from admin to add rooms and its capacity and its related things like class timings, room limits etc for analyzing SPACE UTILIZATION DATA?
✅ **YES** - `/admin/rooms` page allows admins to:
- Add rooms with capacity limits
- Set current occupancy
- Schedule classes with time slots, subjects, and instructors
- Track room utilization
- Filter by campus, type, and status

### Q3: Is there an option or page from admin to add ticket for analyzing MAINTENANCE TRACKING DATA?
✅ **YES** - `/admin/tickets` page allows admins to:
- Create maintenance tickets
- Set priority levels (Low/Medium/High/Critical)
- Categorize issues (Electrical/Plumbing/HVAC/etc)
- Track ticket status (Open/In Progress/Resolved/Closed)
- Assign to maintenance teams
- Estimate repair costs

---

## 🔗 Related Documentation

- **API Documentation**: `API_DOCUMENTATION.md` (Complete backend API reference)
- **Database Schema**: See `API_DOCUMENTATION.md` for SQL table structures
- **Component Guide**: `COMPONENTS_GUIDE.md` (if exists)
- **Styling Guide**: `CUSTOMIZATION_GUIDE.md` (if exists)

---

## 🛠️ Future Enhancements

Potential improvements for admin features:

1. **Campus Management**
   - Campus-wise energy analytics dashboard
   - Building-level breakdowns
   - Historical data visualization

2. **Room Management**
   - Visual floor plan editor
   - Drag-and-drop scheduling
   - Room booking system integration
   - QR code generation for rooms

3. **Ticket Management**
   - File attachments for tickets
   - Comment/note system
   - Email notifications
   - Mobile app for technicians
   - Ticket escalation rules

4. **General**
   - Role-based access control
   - Audit logs
   - Data export (CSV/PDF)
   - Bulk operations
   - Advanced search and filters

---

## 📞 Support

For questions or issues:
1. Check `API_DOCUMENTATION.md` for backend details
2. Review component implementations in `/src/pages/Admin*/`
3. Examine mock data structure in `/src/api/mockData.js`

---

**Created**: November 18, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready for Use
