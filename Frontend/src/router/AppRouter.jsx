import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Layout from '../components/Layout/Layout';
import Login from '../pages/Login/Login';
import Unauthorized from '../pages/Unauthorized/Unauthorized';
import Dashboard from '../pages/Dashboard/Dashboard';
import Energy from '../pages/Energy/Energy';
import Space from '../pages/Space/Space';
import Maintenance from '../pages/Maintenance/Maintenance';
import AdminCampuses from '../pages/AdminCampuses/AdminCampuses';
import AdminRooms from '../pages/AdminRooms/AdminRooms';
import AdminTickets from '../pages/AdminTickets/AdminTickets';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute requiredPermission="dashboard.view">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="energy"
            element={
              <ProtectedRoute requiredPermission="energy.view">
                <Energy />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="space"
            element={
              <ProtectedRoute requiredPermission="space.view">
                <Space />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="maintenance"
            element={
              <ProtectedRoute requiredPermission="maintenance.view">
                <Maintenance />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Require specific permissions */}
          <Route
            path="admin/campuses"
            element={
              <ProtectedRoute requiredAnyPermissions={['users.view', 'roles.view']}>
                <AdminCampuses />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="admin/rooms"
            element={
              <ProtectedRoute requiredAnyPermissions={['space.view', 'users.view']}>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="admin/tickets"
            element={
              <ProtectedRoute requiredPermission="maintenance.view-all">
                <AdminTickets />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
