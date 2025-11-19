import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const loadAuthData = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedPermissions = localStorage.getItem('permissions');
      const storedRoles = localStorage.getItem('roles');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
        setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      }
      setLoading(false);
    };

    loadAuthData();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        const { token, user } = data.data;
        
        // Extract permission names
        const permissionNames = user.permissions?.map(p => p.name) || [];
        const roleNames = user.roles?.map(r => r.name) || [];

        console.log('Login successful - User:', user);
        console.log('Extracted permissions:', permissionNames);
        console.log('Extracted roles:', roleNames);

        // Store in state
        setToken(token);
        setUser(user);
        setPermissions(permissionNames);
        setRoles(roleNames);

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('permissions', JSON.stringify(permissionNames));
        localStorage.setItem('roles', JSON.stringify(roleNames));

        return { success: true, user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions([]);
    setRoles([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('roles');
  };

  const hasPermission = (permissionName) => {
    console.log('Checking permission:', permissionName, 'Available:', permissions);
    return permissions.includes(permissionName);
  };

  const hasAnyPermission = (permissionNames) => {
    console.log('Checking any permission:', permissionNames, 'Available:', permissions);
    return permissionNames.some(p => permissions.includes(p));
  };

  const hasRole = (roleName) => {
    console.log('Checking role:', roleName, 'Available:', roles);
    return roles.includes(roleName);
  };

  const hasAnyRole = (roleNames) => {
    return roleNames.some(r => roles.includes(r));
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    permissions,
    roles,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
