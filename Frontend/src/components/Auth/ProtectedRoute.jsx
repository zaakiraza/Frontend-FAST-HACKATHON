import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredPermission, requiredAnyPermissions, requiredRole }) => {
  const { isAuthenticated, hasPermission, hasAnyPermission, hasRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check any of multiple permissions
  if (requiredAnyPermissions && !hasAnyPermission(requiredAnyPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
  requiredAnyPermissions: PropTypes.arrayOf(PropTypes.string),
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
