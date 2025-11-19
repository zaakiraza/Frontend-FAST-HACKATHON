# Smart Campus Infrastructure - Frontend

A comprehensive React-based dashboard for managing smart campus infrastructure with real-time monitoring, energy management, space utilization, and maintenance tracking.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Chart.js** - Data visualization
- **Font Awesome** - Icons
- **CSS3** - Custom styling with CSS variables

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API integration layer
│   │   ├── authApi.js          # Authentication APIs
│   │   ├── campusApi.js        # Campus management APIs
│   │   ├── dashboardApi.js     # Dashboard data APIs
│   │   ├── energyApi.js        # Energy monitoring APIs
│   │   ├── maintenanceApi.js   # Maintenance APIs
│   │   ├── roomApi.js          # Room management APIs
│   │   ├── spaceApi.js         # Space utilization APIs
│   │   └── ticketApi.js        # Ticket management APIs
│   │
│   ├── components/     # Reusable components
│   │   ├── Alert/             # Alert notifications
│   │   ├── Cards/             # Info cards
│   │   ├── Charts/            # Chart components
│   │   ├── Layout/            # Layout (Sidebar, Topbar)
│   │   ├── Modal/             # Modal dialogs
│   │   └── Tables/            # Table components
│   │
│   ├── pages/          # Page components
│   │   ├── Dashboard/         # Main dashboard
│   │   ├── Energy/            # Energy management
│   │   ├── Space/             # Space utilization
│   │   ├── Maintenance/       # Maintenance tracking
│   │   ├── AdminBuildings/    # Building management
│   │   ├── AdminCampuses/     # Campus management
│   │   ├── AdminRooms/        # Room management
│   │   ├── AdminTickets/      # Ticket management
│   │   ├── Login/             # Login page
│   │   ├── Signup/            # Registration page
│   │   └── NotFound/          # 404 page
│   │
│   ├── config/         # Configuration
│   │   └── apiConfig.js       # API endpoints & base URL
│   │
│   ├── router/         # Routing configuration
│   │   └── AppRouter.jsx      # Route definitions
│   │
│   ├── styles/         # Global styles
│   │   ├── global.css         # Global CSS
│   │   └── variables.css      # CSS variables
│   │
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
│
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## 🔌 API Integration

### Backend Configuration
The frontend connects to a Node.js/Express backend hosted on Heroku.

**Base URL:** `https://icms-e81d285c90c1.herokuapp.com/api`

Configuration is in `src/config/apiConfig.js`:
```javascript
export const API_BASE_URL = "https://icms-e81d285c90c1.herokuapp.com/api";
```

### API Endpoints Used

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/alerts` - System alerts

#### Energy Management
- `GET /energy/summary` - Energy summary
- `GET /energy/buildings` - Building energy data
- `GET /energy/timeseries` - Historical energy data
- `GET /energy/anomalies` - Energy anomalies
- `GET /energy/building/:id` - Single building details

#### Space Management
- `GET /space/summary` - Space utilization summary
- `GET /space/occupancy` - Room occupancy data
- `GET /space/heatmap` - Occupancy heatmap
- `GET /space/suggestions` - Optimization suggestions

#### Maintenance
- `GET /maintenance/summary` - Maintenance summary
- `GET /maintenance/tickets` - All tickets
- `GET /maintenance/tickets/:id` - Single ticket
- `PATCH /maintenance/tickets/:id/status` - Update ticket status
- `PATCH /maintenance/tickets/:id/assign` - Assign ticket

#### Admin - Buildings (Read-only)
- `GET /energy/buildings` - List all buildings

#### Admin - Rooms (Read-only)
- `GET /space/occupancy` - List all rooms with occupancy

#### Admin - Tickets (Read-only)
- `GET /maintenance/tickets` - List all tickets

**Note:** Full CRUD operations for admin endpoints are not yet implemented on the backend.

### API Response Structures

#### Authentication Response
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@smartcampus.edu",
      "first_name": "Admin",
      "last_name": "User",
      "roles": [
        {
          "role_id": 1,
          "role_name": "Super Admin",
          "permissions": ["all"]
        }
      ]
    }
  }
}
```

#### Building Data
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Engineering Block A",
      "energy_consumption": 45678.5,
      "efficiency_score": 85.5
    }
  ]
}
```

#### Room Occupancy
```json
{
  "success": true,
  "data": [
    {
      "room": "E101",
      "building": "Engineering Block A",
      "capacity": 50,
      "current": 42,
      "status": "occupied",
      "percentage": 84
    }
  ]
}
```

#### Ticket Data
```json
{
  "success": true,
  "data": [
    {
      "id": "MT-0001",
      "title": "AC not working",
      "building": "Engineering Block A",
      "location": "Room E101",
      "priority": "high",
      "status": "open",
      "reportedBy": "John Doe",
      "assignedTo": "Mike Wilson",
      "createdAt": "2025-11-19T10:30:00Z",
      "description": "Air conditioning unit not cooling"
    }
  ]
}
```

## 🎨 UI Components

### Layout Components
- **Sidebar** - Navigation menu with icons and labels
- **Topbar** - Top navigation with user profile and logout
- **Layout** - Main layout wrapper with sidebar and content area

### Reusable Components
- **InfoCard** - Display key metrics with icons
- **LineChart** - Time-series data visualization
- **SimpleTable** - Data tables with sorting and filtering
- **Modal** - Dialog boxes for forms and confirmations
- **Alert** - Notification messages

### Page Components
All pages follow a consistent structure:
1. Header with title and actions
2. Filters/search (where applicable)
3. Main content area (tables, charts, cards)
4. Loading states and error handling

## 🔐 Authentication

### Features
- JWT-based authentication
- Token stored in localStorage
- Protected routes with automatic redirect
- User session management
- Role-based access control (frontend ready)

### Login Process
1. User enters credentials (email/username and password)
2. Frontend sends to `/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard
6. Token included in subsequent API requests

### Protected Routes
All routes except `/login` and `/signup` require authentication.

```javascript
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

### Test Accounts
Available test accounts with password: `password123`

- **admin@smartcampus.edu** - Super Admin (All access)
- **john.doe@smartcampus.edu** - Facility Manager (Maintenance & Space)
- **jane.smith@smartcampus.edu** - Energy Manager (Energy Monitoring)
- **mike.wilson@smartcampus.edu** - Maintenance Staff (Ticket Operations)
- **sarah.jones@smartcampus.edu** - Viewer (Read-only)

## 🎯 Key Features

### Dashboard
- Real-time statistics (Total Buildings, Active Rooms, Energy Consumption, Open Tickets)
- Recent alerts and notifications
- Quick access cards to main modules
- System health overview

### Energy Management
- Building-wise energy consumption
- Historical trends and analytics
- Efficiency scores and rankings
- Anomaly detection
- Time-series charts

### Space Management
- Room occupancy tracking
- Real-time utilization percentages
- Visual progress bars with color coding
- Capacity vs current occupancy
- Status indicators (Available, Occupied, Reserved, Optimal, Underutilized)

### Maintenance
- Ticket management system
- Priority levels (Critical, High, Medium, Low)
- Status tracking (Open, In Progress, Resolved, Closed)
- Building and location tagging
- Assignment tracking

### Admin Pages
- **Buildings**: List all buildings with energy metrics
- **Rooms**: Manage rooms with occupancy data
- **Tickets**: View and filter maintenance tickets
- **Campuses**: Campus management (pending backend)

## 🎨 Styling System

### CSS Variables
All colors, spacing, and design tokens are defined in `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --primary-color: #667eea;
  --primary-hover: #5568d3;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #3b82f6;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Layout */
  --sidebar-width: 250px;
  --topbar-height: 70px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Design System
- **Typography**: System font stack with fallbacks
- **Colors**: Consistent color palette for status, actions, and themes
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions (0.3s ease)
- **Responsive**: Mobile-first breakpoints (480px, 768px, 968px, 1200px)

### Status Colors
- **Available**: Gray (#6b7280)
- **Occupied**: Orange (#f59e0b)
- **Reserved**: Red (#ef4444)
- **Optimal**: Green (#10b981)
- **Underutilized**: Yellow (#eab308)

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running (or access to Heroku deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint** (if needed)
Edit `src/config/apiConfig.js`:
```javascript
export const API_BASE_URL = "http://localhost:3000/api"; // For local backend
// OR
export const API_BASE_URL = "https://icms-e81d285c90c1.herokuapp.com/api"; // Production
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Desktop**: 1200px+ (Full sidebar, all features)
- **Tablet**: 768px - 1199px (Collapsible sidebar)
- **Mobile**: < 768px (Hamburger menu, stacked layouts)

### Mobile Optimizations
- Collapsible sidebar with hamburger menu
- Stacked grid layouts
- Touch-friendly buttons and inputs
- Simplified tables (horizontal scroll)
- Hidden non-essential columns

## 🔄 State Management

Currently using **React hooks** for state management:
- `useState` - Local component state
- `useEffect` - Side effects and data fetching
- `useNavigate` - Programmatic navigation

### Data Flow
1. Component mounts
2. `useEffect` calls API function
3. API function fetches from backend
4. Response stored in state
5. UI updates with new data

## 🛠️ Development Guidelines

### Adding a New Page

1. **Create page component**
```bash
Frontend/src/pages/NewPage/
├── NewPage.jsx
└── NewPage.css
```

2. **Add API function** (if needed)
```javascript
// src/api/newApi.js
export const getNewData = async () => {
  return await apiCall('/new/endpoint');
};
```

3. **Add route**
```javascript
// src/router/AppRouter.jsx
<Route path="new-page" element={<NewPage />} />
```

4. **Add to sidebar** (if needed)
```javascript
// src/components/Layout/Sidebar.jsx
{ path: '/new-page', icon: 'fa-icon', label: 'New Page' }
```

### API Integration Pattern

```javascript
import { apiCall } from '../config/apiConfig';

export const getData = async (params) => {
  try {
    const response = await apiCall('/endpoint', {
      method: 'GET',
      // Optional: headers, body, etc.
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Component Structure

```javascript
import { useState, useEffect } from 'react';
import { apiFunction } from '../../api/apiFile';
import './Component.css';

const Component = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="component">
      {/* Your UI */}
    </div>
  );
};

export default Component;
```

## 🐛 Common Issues & Solutions

### Issue: API calls failing
**Solution:** Check that backend is running and `API_BASE_URL` is correct in `apiConfig.js`

### Issue: Authentication not persisting
**Solution:** Check browser localStorage for `authToken` and `user` keys. Clear and re-login if corrupted.

### Issue: CORS errors
**Solution:** Backend must have CORS enabled for frontend origin. Check backend `cors` middleware.

### Issue: Build fails
**Solution:** 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Styles not applying
**Solution:** Check that CSS file is imported in component. Verify CSS variable names match `variables.css`.

## 📊 Performance Optimizations

- **Code Splitting**: Route-based code splitting with React.lazy (future enhancement)
- **Image Optimization**: Use WebP format for images
- **Bundle Size**: Vite's tree-shaking removes unused code
- **Caching**: API responses cached in component state
- **Debouncing**: Search inputs debounced to reduce API calls

## 🔮 Future Enhancements

### Planned Features
- [ ] Role-based UI permissions
- [ ] Real-time updates with WebSockets
- [ ] Dark mode theme toggle
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF
- [ ] Notification system
- [ ] User profile management
- [ ] Settings page
- [ ] Multi-language support

### Backend Requirements
- [ ] `/admin/campuses` CRUD endpoints
- [ ] `/admin/buildings` CRUD endpoints
- [ ] `/admin/rooms` CRUD endpoints
- [ ] Full ticket UPDATE/DELETE operations
- [ ] WebSocket support for real-time updates
- [ ] File upload for attachments
- [ ] Bulk operations APIs

## 📝 Environment Variables

Create `.env` file in Frontend root (optional):

```env
VITE_API_BASE_URL=https://icms-e81d285c90c1.herokuapp.com/api
VITE_APP_NAME=Smart Campus Infrastructure
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request

## 📄 License

This project is part of the Smart Campus Infrastructure system.

## 📧 Contact & Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** November 19, 2025  
**Built with ❤️ using React + Vite**
