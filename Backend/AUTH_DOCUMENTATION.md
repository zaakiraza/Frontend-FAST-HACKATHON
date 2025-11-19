# Authentication & Authorization System Documentation

## Overview

This authentication system implements **Role-Based Access Control (RBAC)** inspired by [Spatie Laravel Permission](https://github.com/spatie/laravel-permission). It provides a flexible and scalable way to manage user permissions through roles and direct permission assignments.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Role Hierarchy](#role-hierarchy)
4. [API Endpoints](#api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Usage Examples](#usage-examples)
7. [Middleware](#middleware)
8. [Best Practices](#best-practices)

---

## System Architecture

### Core Components

1. **Models**: Data access layer (`authModel.js`, `roleModel.js`, `permissionModel.js`, `userModel.js`)
2. **Controllers**: Business logic handlers (`authController.js`, `roleController.js`, `permissionController.js`, `userController.js`)
3. **Middleware**: Authentication and authorization guards (`authMiddleware.js`)
4. **Routes**: API endpoint definitions (`authRoutes.js`, `roleRoutes.js`, `permissionRoutes.js`, `userRoutes.js`)

### Key Features

- ✅ JWT-based authentication
- ✅ Role-based permission management
- ✅ Direct permission assignment to users
- ✅ Polymorphic relationships (model_has_roles, model_has_permissions)
- ✅ System role protection (cannot modify super-admin)
- ✅ Module-based permission grouping
- ✅ Permission inheritance through roles

---

## Database Schema

### Tables

#### `modules`
Organizes permissions into logical groups (Dashboard, Energy, Maintenance, etc.)
```sql
- module_id (PK)
- name (unique)
- display_name
- description
- icon
- sort_order
- is_active
```

#### `users`
Application users
```sql
- user_id (PK)
- username (unique)
- email (unique)
- password_hash
- first_name, last_name
- phone, avatar_url
- email_verified_at
- is_active
- last_login_at
```

#### `roles`
User roles (Super Admin, Admin, Facility Manager, etc.)
```sql
- role_id (PK)
- name (unique)
- display_name
- description
- guard_name
- is_system_role (prevents deletion/modification)
```

#### `permissions`
Granular access rights
```sql
- permission_id (PK)
- module_id (FK)
- name (unique, e.g., "dashboard.view")
- display_name
- description
- guard_name
```

#### `role_has_permissions` (Pivot)
Many-to-many relationship between roles and permissions
```sql
- role_id (FK)
- permission_id (FK)
```

#### `model_has_roles` (Polymorphic Pivot)
Assigns roles to models (currently User model)
```sql
- role_id (FK)
- model_type (e.g., "User")
- model_id (user_id)
```

#### `model_has_permissions` (Polymorphic Pivot)
Direct permission assignment to models
```sql
- permission_id (FK)
- model_type (e.g., "User")
- model_id (user_id)
```

---

## Role Hierarchy

### Predefined Roles

| Role | System Role | Description | Key Permissions |
|------|------------|-------------|-----------------|
| **Super Admin** | ✅ Yes | Full system access | ALL permissions |
| **Admin** | ❌ No | Administrative access | All except `settings.manage-system` |
| **Facility Manager** | ❌ No | Manages facilities & maintenance | Dashboard, Maintenance (full), Space (full) |
| **Energy Manager** | ❌ No | Manages energy monitoring | Dashboard, Energy (full) |
| **Maintenance Staff** | ❌ No | Handles maintenance tasks | Dashboard (view), Maintenance (create, update, view) |
| **Viewer** | ❌ No | Read-only access | All `*.view*` permissions |

### Permission Naming Convention

Format: `{module}.{action}`

Examples:
- `dashboard.view`
- `energy.view-summary`
- `maintenance.create`
- `users.manage-roles`
- `roles.assign-permissions`

### Modules & Their Permissions

#### 1. Dashboard Module
- `dashboard.view` - View dashboard
- `dashboard.view-stats` - View statistics
- `dashboard.view-alerts` - View alerts

#### 2. Energy Module
- `energy.view` - View energy data
- `energy.view-summary` - View summary
- `energy.view-buildings` - View buildings
- `energy.view-timeseries` - View time series
- `energy.view-anomalies` - View anomalies
- `energy.export` - Export reports

#### 3. Maintenance Module
- `maintenance.view` - View tickets
- `maintenance.view-all` - View all tickets
- `maintenance.create` - Create tickets
- `maintenance.update` - Update tickets
- `maintenance.assign` - Assign tickets
- `maintenance.delete` - Delete tickets

#### 4. Space Module
- `space.view` - View space data
- `space.view-occupancy` - View occupancy
- `space.view-heatmap` - View heatmap
- `space.view-suggestions` - View suggestions
- `space.export` - Export reports

#### 5. Users Module
- `users.view` - View users
- `users.create` - Create users
- `users.update` - Update users
- `users.delete` - Delete users
- `users.manage-roles` - Manage user roles

#### 6. Roles Module
- `roles.view` - View roles
- `roles.create` - Create roles
- `roles.update` - Update roles
- `roles.delete` - Delete roles
- `roles.assign-permissions` - Assign permissions

#### 7. Settings Module
- `settings.view` - View settings
- `settings.update` - Update settings
- `settings.manage-system` - Manage system (Super Admin only)

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user

**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### POST `/api/auth/login`
Login with email/username and password

**Request Body:**
```json
{
  "login": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "john.doe",
      "email": "john.doe@example.com",
      "roles": [
        {
          "role_id": 3,
          "name": "facility-manager",
          "display_name": "Facility Manager"
        }
      ],
      "permissions": [
        {
          "permission_id": 1,
          "name": "dashboard.view",
          "display_name": "View Dashboard"
        }
      ]
    }
  }
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "john.doe",
    "email": "john.doe@example.com",
    "roles": [...],
    "permissions": [...]
  }
}
```

#### POST `/api/auth/change-password`
Change password (requires authentication)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "current_password": "OldPassword123",
  "new_password": "NewPassword456"
}
```

**Response:** `200 OK`

---

### User Management Endpoints

All user endpoints require authentication and appropriate permissions.

#### GET `/api/users`
Get all users (requires `users.view`)

**Query Parameters:**
- `is_active` (boolean): Filter by active status
- `search` (string): Search by username, email, or name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "username": "john.doe",
      "email": "john.doe@example.com",
      "roles": ["facility-manager"],
      "role_names": ["Facility Manager"],
      "is_active": true
    }
  ]
}
```

#### GET `/api/users/:id`
Get user by ID (requires `users.view`)

#### PATCH `/api/users/:id`
Update user profile (requires `users.update`)

#### PATCH `/api/users/:id/status`
Activate/Deactivate user (requires `users.update`)

#### DELETE `/api/users/:id`
Delete user (requires `users.delete`)

---

### Role Management Endpoints

#### GET `/api/roles`
Get all roles (requires `roles.view`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "role_id": 1,
      "name": "super-admin",
      "display_name": "Super Administrator",
      "is_system_role": true,
      "user_count": 1,
      "permission_count": 33
    }
  ]
}
```

#### GET `/api/roles/:id`
Get role with permissions (requires `roles.view`)

#### POST `/api/roles`
Create new role (requires `roles.create`)

**Request Body:**
```json
{
  "name": "custom-role",
  "display_name": "Custom Role",
  "description": "A custom role description"
}
```

#### PATCH `/api/roles/:id`
Update role (requires `roles.update`)
- **Note:** Cannot update system roles

#### DELETE `/api/roles/:id`
Delete role (requires `roles.delete`)
- **Note:** Cannot delete system roles or roles assigned to users

#### POST `/api/roles/:id/permissions`
Assign permission to role (requires `roles.assign-permissions`)

**Request Body:**
```json
{
  "permission_id": 5
}
```

#### PUT `/api/roles/:id/permissions`
Sync role permissions (replace all) (requires `roles.assign-permissions`)

**Request Body:**
```json
{
  "permission_ids": [1, 2, 3, 5, 7]
}
```

#### POST `/api/roles/:id/users`
Assign role to user (requires `users.manage-roles`)

**Request Body:**
```json
{
  "user_id": 10
}
```

#### PUT `/api/roles/users/:userId/sync`
Sync user roles (replace all) (requires `users.manage-roles`)

**Request Body:**
```json
{
  "role_ids": [2, 3]
}
```

---

### Permission Management Endpoints

#### GET `/api/permissions`
Get all permissions grouped by module (requires `roles.view`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "module_id": 1,
      "module_name": "dashboard",
      "module_display_name": "Dashboard",
      "module_icon": "dashboard",
      "permissions": [
        {
          "permission_id": 1,
          "name": "dashboard.view",
          "display_name": "View Dashboard"
        }
      ]
    }
  ]
}
```

#### GET `/api/permissions/modules`
Get all modules (requires `roles.view`)

#### GET `/api/permissions/modules/:moduleId`
Get permissions by module (requires `roles.view`)

#### POST `/api/permissions/users/:userId`
Assign direct permission to user (requires `users.manage-roles`)

**Request Body:**
```json
{
  "permission_id": 31
}
```

#### GET `/api/permissions/users/:userId/direct`
Get user's direct permissions (requires `users.view`)

---

## Authentication Flow

### 1. Registration
```
User -> POST /api/auth/register
     -> Password is hashed with bcrypt (10 rounds)
     -> User created in database
     -> Returns user data (no token)
```

### 2. Login
```
User -> POST /api/auth/login
     -> Find user by email/username
     -> Verify password with bcrypt.compare()
     -> Update last_login_at timestamp
     -> Fetch user's roles and permissions
     -> Generate JWT token (expires in 24h)
     -> Return token + user data
```

### 3. Protected Request
```
User -> GET /api/users (with Bearer token)
     -> authMiddleware extracts token
     -> Verify JWT signature
     -> Fetch user from database
     -> Attach user to req.user
     -> hasPermission middleware checks permission
     -> If authorized, proceed to controller
     -> Return response
```

---

## Usage Examples

### Backend Usage

#### Protecting Routes

```javascript
const { authenticate, hasPermission, hasRole } = require('../middleware/authMiddleware');

// Require authentication only
router.get('/profile', authenticate, UserController.getProfile);

// Require specific permission
router.post('/users', authenticate, hasPermission('users.create'), UserController.createUser);

// Require specific role
router.get('/admin', authenticate, hasRole('super-admin'), AdminController.dashboard);

// Require any of multiple permissions
router.get('/data', authenticate, hasAnyPermission(['data.view', 'data.export']), DataController.getData);
```

#### Checking Permissions in Controllers

```javascript
const AuthModel = require('../models/authModel');

async function customAction(req, res) {
  const userId = req.user.userId;
  
  // Check single permission
  const canDelete = await AuthModel.userHasPermission(userId, 'users.delete');
  
  // Check multiple permissions
  const canManage = await AuthModel.userHasAnyPermission(userId, ['users.update', 'users.delete']);
  
  // Check role
  const isSuperAdmin = await AuthModel.userHasRole(userId, 'super-admin');
}
```

### Frontend Usage

#### Login and Store Token

```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage or secure cookie
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Use permissions to control UI
    const permissions = data.data.user.permissions.map(p => p.name);
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }
}
```

#### Making Authenticated Requests

```javascript
async function fetchUsers() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

#### Permission-Based UI Rendering

```javascript
function hasPermission(permissionName) {
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  return permissions.includes(permissionName);
}

// In React component
function UserManagement() {
  return (
    <div>
      <h1>Users</h1>
      {hasPermission('users.create') && (
        <button onClick={createUser}>Create User</button>
      )}
      {hasPermission('users.delete') && (
        <button onClick={deleteUser}>Delete User</button>
      )}
    </div>
  );
}
```

---

## Middleware

### `authenticate`
Verifies JWT token and attaches user to request object.

**Usage:**
```javascript
router.get('/protected', authenticate, controller.action);
```

**Request Object:**
```javascript
req.user = {
  userId: 1,
  username: "john.doe",
  email: "john.doe@example.com",
  isActive: true
}
```

### `hasPermission(permissionName)`
Checks if user has specific permission (via roles or direct assignment).

**Usage:**
```javascript
router.post('/users', authenticate, hasPermission('users.create'), controller.createUser);
```

### `hasAnyPermission(permissionNames)`
Checks if user has any of the specified permissions.

**Usage:**
```javascript
router.get('/data', authenticate, hasAnyPermission(['data.view', 'data.export']), controller.getData);
```

### `hasRole(roleName)`
Checks if user has specific role.

**Usage:**
```javascript
router.get('/admin', authenticate, hasRole('super-admin'), controller.adminDashboard);
```

### `optionalAuth`
Attaches user to request if token is provided, but doesn't fail if missing.

**Usage:**
```javascript
router.get('/public', optionalAuth, controller.publicData);
```

---

## Best Practices

### Security

1. **Change JWT_SECRET in production**
   - Use a long, random string (minimum 32 characters)
   - Store in environment variables, never commit to git

2. **Use HTTPS in production**
   - JWT tokens should only be transmitted over secure connections

3. **Token Expiration**
   - Current: 24 hours
   - Adjust based on security requirements
   - Implement refresh tokens for longer sessions

4. **Password Requirements**
   - Enforce strong passwords in frontend
   - Minimum 8 characters recommended
   - Bcrypt rounds: 10 (balance between security and performance)

5. **Rate Limiting**
   - Implement rate limiting on login endpoint to prevent brute force attacks

### Permission Design

1. **Granular Permissions**
   - Create specific permissions for each action
   - Example: `users.view`, `users.create`, `users.update`, `users.delete`

2. **Module Organization**
   - Group related permissions into modules
   - Use consistent naming convention

3. **System Roles**
   - Mark critical roles as system roles to prevent accidental modification
   - Super Admin should always be a system role

4. **Permission Inheritance**
   - Use roles for common permission sets
   - Use direct permissions for exceptions

### Development Workflow

1. **Database Setup**
   ```bash
   # Execute auth_schema.sql after database_schema.sql
   mysql -u root -p railway < auth_schema.sql
   ```

2. **Install Dependencies**
   ```bash
   npm install bcrypt jsonwebtoken
   ```

3. **Environment Variables**
   ```bash
   JWT_SECRET=your-long-random-secret-key-here
   ```

4. **Testing**
   - Test with different user roles
   - Verify permission checks work correctly
   - Test token expiration handling

### Error Handling

All authentication errors return consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "required_permission": "permission.name"  // For permission errors
}
```

Common HTTP Status Codes:
- `401 Unauthorized` - Invalid/missing token, invalid credentials
- `403 Forbidden` - Insufficient permissions
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Sample User Accounts

From `auth_schema.sql`:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@smartcampus.edu | password123 | Super Admin |
| john.doe | john.doe@smartcampus.edu | password123 | Facility Manager |
| jane.smith | jane.smith@smartcampus.edu | password123 | Energy Manager |
| mike.wilson | mike.wilson@smartcampus.edu | password123 | Maintenance Staff |
| sarah.jones | sarah.jones@smartcampus.edu | password123 | Viewer |

**⚠️ Change these passwords in production!**

---

## Troubleshooting

### "No token provided"
- Ensure Authorization header is set: `Bearer {token}`
- Check token is not expired (24h default)

### "Invalid token"
- Token may be malformed or tampered with
- JWT_SECRET may have changed
- Token may be expired

### "You do not have permission"
- User doesn't have required permission
- Check user's roles and permissions in database
- Verify permission name matches exactly

### "Cannot modify system role"
- System roles are protected from modification
- Use different role or contact super admin

---

## Next Steps

1. ✅ Execute `auth_schema.sql` in Railway MySQL
2. ✅ Install `bcrypt` and `jsonwebtoken` packages
3. ✅ Set JWT_SECRET in .env file
4. ✅ Test authentication endpoints
5. 🔄 Protect existing API endpoints with middleware
6. 🔄 Update Frontend to use authentication
7. 🔄 Implement refresh token mechanism (optional)
8. 🔄 Add rate limiting (optional)
9. 🔄 Implement password reset functionality (optional)

---

**Documentation Version:** 1.0  
**Last Updated:** November 19, 2025  
**Author:** Smart Campus Management System
