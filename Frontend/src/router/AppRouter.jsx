import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Energy from '../pages/Energy/Energy';
import Space from '../pages/Space/Space';
import Maintenance from '../pages/Maintenance/Maintenance';
import AdminCampuses from '../pages/AdminCampuses/AdminCampuses';
import AdminBuildings from '../pages/AdminBuildings/AdminBuildings';
import AdminRooms from '../pages/AdminRooms/AdminRooms';
import AdminTickets from '../pages/AdminTickets/AdminTickets';
import Profile from '../pages/Profile/Profile';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import NotFound from '../pages/NotFound/NotFound';
<<<<<<< HEAD
import Profile from '../pages/Profile/Profile';
=======
import { useAuth } from '../context/AuthContext';
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
<<<<<<< HEAD
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
=======
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="energy" element={<Energy />} />
          <Route path="space" element={<Space />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Profile */}
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="admin/campuses" element={<AdminCampuses />} />
          <Route path="admin/buildings" element={<AdminBuildings />} />
          <Route path="admin/rooms" element={<AdminRooms />} />
          <Route path="admin/tickets" element={<AdminTickets />} />
          
          {/* <Route path="security" element={<ComingSoon page="Security" />} /> */}
          {/* <Route path="mobility" element={<ComingSoon page="Mobility" />} /> */}
          {/* <Route path="connectivity" element={<ComingSoon page="Connectivity" />} /> */}
        </Route>

        {/* 404 Not Found - Catch all routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
