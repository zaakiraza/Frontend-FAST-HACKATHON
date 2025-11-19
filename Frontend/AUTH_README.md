# Frontend Authentication Implementation

## Overview

The Frontend has been wrapped with a complete authentication system that integrates with the Backend RBAC (Role-Based Access Control) system.

## Features Implemented

✅ JWT-based authentication
✅ Protected routes with permission checking
✅ Login/Logout functionality
✅ User context with roles and permissions
✅ Authenticated API requests
✅ User profile display in topbar
✅ Permission-based UI rendering
✅ Automatic token handling
✅ Session expiration handling

## File Structure

```
Frontend/src/
├── api/
│   └── api.js (NEW) - Authenticated API utility with all endpoints
├── context/
│   └── AuthContext.jsx (NEW) - Authentication state management
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx (NEW) - Route protection component
│   └── Layout/
│       ├── Topbar.jsx (UPDATED) - Added user menu and logout
│       └── Topbar.css (UPDATED) - Added dropdown styles
├── pages/
│   ├── Login/
│   │   ├── Login.jsx (NEW) - Login page
│   │   └── Login.css (NEW) - Login styles
│   └── Unauthorized/
│       ├── Unauthorized.jsx (NEW) - Access denied page
│       └── Unauthorized.css (NEW) - Unauthorized styles
├── router/
│   └── AppRouter.jsx (UPDATED) - Protected routes with permissions
└── App.jsx (UPDATED) - Wrapped with AuthProvider
```

## How It Works

### 1. Authentication Flow

```
User visits app
  ↓
Check localStorage for token
  ↓
If token exists → Auto-login → Show protected routes
If no token → Redirect to /login
  ↓
User enters credentials → Backend validates
  ↓
If valid → Store token + user data → Redirect to dashboard
If invalid → Show error message
```

### 2. AuthContext

The `AuthContext` provides these methods:

- `login(credentials)` - Authenticate user
- `logout()` - Clear session and redirect to login
- `hasPermission(permissionName)` - Check single permission
- `hasAnyPermission(permissionNames)` - Check multiple permissions
- `hasRole(roleName)` - Check user role
- `hasAnyRole(roleNames)` - Check multiple roles
- `isAuthenticated()` - Check if user is logged in

### 3. Protected Routes

Routes are protected using the `ProtectedRoute` component:

```jsx
<ProtectedRoute requiredPermission="dashboard.view">
  <Dashboard />
</ProtectedRoute>
```

**Options:**
- `requiredPermission` - Single permission required
- `requiredAnyPermissions` - Array of permissions (user needs any one)
- `requiredRole` - Role required

### 4. API Integration

All API calls use the authenticated `api` utility:

```javascript
import { api, dashboardApi } from './api/api';

// Automatic token inclusion
const stats = await dashboardApi.getStats();

// Manual API calls
const data = await api.get('/custom-endpoint');
const result = await api.post('/custom-endpoint', { data });
```

**Features:**
- Automatic JWT token inclusion
- Handles 401 (unauthorized) by redirecting to login
- Consistent error handling
- Typed API methods for all endpoints

## Usage Examples

### Check Permissions in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { hasPermission, user } = useAuth();

  return (
    <div>
      <h1>Welcome {user.first_name}</h1>
      
      {hasPermission('users.create') && (
        <button>Create User</button>
      )}
      
      {hasPermission('users.delete') && (
        <button>Delete User</button>
      )}
    </div>
  );
}
```

### Conditional Rendering by Role

```jsx
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { hasRole, hasAnyRole } = useAuth();

  if (hasRole('super-admin')) {
    return <SuperAdminDashboard />;
  }

  if (hasAnyRole(['admin', 'facility-manager'])) {
    return <ManagerDashboard />;
  }

  return <AccessDenied />;
}
```

### Making Authenticated API Calls

```jsx
import { maintenanceApi } from '../api/api';

async function createTicket() {
  try {
    const result = await maintenanceApi.createTicket({
      title: 'AC not working',
      description: 'Room 101 AC malfunction',
      priority: 'high',
      category: 'HVAC'
    });
    
    console.log('Ticket created:', result);
  } catch (error) {
    console.error('Failed to create ticket:', error);
  }
}
```

## Route Permissions

Current route protection setup:

| Route | Required Permission | Description |
|-------|-------------------|-------------|
| `/` (Dashboard) | `dashboard.view` | Main dashboard |
| `/energy` | `energy.view` | Energy monitoring |
| `/space` | `space.view` | Space utilization |
| `/maintenance` | `maintenance.view` | Maintenance tickets |
| `/admin/campuses` | `users.view` OR `roles.view` | Campus management |
| `/admin/rooms` | `space.view` OR `users.view` | Room management |
| `/admin/tickets` | `maintenance.view-all` | All tickets admin |

## Sample User Accounts

Test the authentication with these accounts:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@smartcampus.edu | password123 | Super Admin | Full access |
| john.doe@smartcampus.edu | password123 | Facility Manager | Maintenance & Space |
| jane.smith@smartcampus.edu | password123 | Energy Manager | Energy monitoring |
| mike.wilson@smartcampus.edu | password123 | Maintenance Staff | Ticket operations |
| sarah.jones@smartcampus.edu | password123 | Viewer | Read-only |

## Configuration

Update the API base URL in `src/api/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

For production, change to your production API URL.

## Token Storage

- JWT token stored in `localStorage` as `token`
- User data stored in `localStorage` as `user`
- Permissions stored in `localStorage` as `permissions`
- Roles stored in `localStorage` as `roles`

**Security Note:** For production, consider using `httpOnly` cookies for better security.

## Session Management

- Tokens expire after 24 hours (configured in Backend)
- Expired tokens automatically redirect to login
- Logout clears all stored data
- User menu shows current user info

## Error Handling

The API utility handles common errors:

- **401 Unauthorized**: Auto-logout and redirect to login
- **403 Forbidden**: Redirect to `/unauthorized` page
- **Network errors**: Console error and throw exception

## Customization

### Add New Protected Route

```jsx
// In AppRouter.jsx
<Route
  path="new-page"
  element={
    <ProtectedRoute requiredPermission="module.view">
      <NewPage />
    </ProtectedRoute>
  }
/>
```

### Add Permission Check in Component

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission('module.action') && (
        <button>Protected Action</button>
      )}
    </div>
  );
}
```

## Testing

1. **Start Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test Login:**
   - Visit http://localhost:5173
   - Should redirect to `/login`
   - Login with any sample account
   - Should redirect to dashboard

4. **Test Permissions:**
   - Login as different roles
   - Verify access to different pages
   - Check sidebar menu items visibility
   - Try accessing routes without permission

## Troubleshooting

### Issue: "Network error" on login
- Check if Backend is running on http://localhost:3000
- Verify CORS is enabled in Backend
- Check browser console for errors

### Issue: Redirect loop
- Clear localStorage: `localStorage.clear()`
- Check if token is valid
- Verify Backend is returning correct response format

### Issue: "Access Denied" for all pages
- Check user permissions in database
- Verify role assignments
- Check Backend auth_schema.sql was executed

### Issue: Token expired immediately
- Check Backend JWT_SECRET is set
- Verify token expiration time (default: 24h)
- Check system clock is correct

## Next Steps

- [ ] Implement refresh token mechanism
- [ ] Add "Remember me" functionality
- [ ] Add password reset flow
- [ ] Implement two-factor authentication
- [ ] Add user profile edit page
- [ ] Create role management UI
- [ ] Add permission management UI
- [ ] Implement audit logging

## Security Best Practices

✅ JWT tokens used for authentication
✅ Tokens auto-expire (24h)
✅ Automatic logout on token expiration
✅ Protected routes require authentication
✅ Permission-based access control
⚠️ Token stored in localStorage (consider httpOnly cookies for production)
⚠️ No refresh token yet (implement for production)

## Support

For issues or questions:
1. Check AUTH_DOCUMENTATION.md in Backend folder
2. Review API_DOCUMENTATION.md for endpoint details
3. Check browser console for errors
4. Verify Backend is running and database is set up

---

**Authentication System Ready!** 🎉

Login with any sample account and start testing the protected routes.
