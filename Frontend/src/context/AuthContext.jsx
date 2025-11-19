import { createContext, useContext, useState, useEffect } from 'react';
import apiConfig from '../config/apiConfig';

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
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${apiConfig.BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const result = await response.json();
      console.log('Auth check - Profile response:', result);

      // Backend returns: { success: true, data: { user with roles/permissions } }
      const userData = result.data || result.user || result;

      // Get stored user data from login
      const storedUserData = localStorage.getItem('userData');

      // If we have stored data with more permissions, use it
      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          // Use stored data if it has more permissions
          if (parsed.permissions && parsed.permissions.length > (userData.permissions?.length || 0)) {
            console.log('Using stored user data (has more permissions)');
            setUser(parsed);
            setPermissions(parsed.permissions || []);
            setRoles(parsed.roles || []);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }

      setUser(userData);
      setPermissions(userData.permissions || []);
      setRoles(userData.roles || []);
      setIsAuthenticated(true);

      console.log('Auth state updated:', {
        user: userData,
        permissions: userData.permissions || [],
        roles: userData.roles || []
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      setPermissions([]);
      setRoles([]);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Backend returns: { success: true, data: { token, user } }
      const { token, user } = data.data;

      // Store token
      localStorage.setItem('token', token);

      // Store user data for later comparison
      localStorage.setItem('userData', JSON.stringify(user));

      setUser(user);
      setPermissions(user.permissions || []);
      setRoles(user.roles || []);
      setIsAuthenticated(true);

      console.log('Login successful:', {
        user,
        permissions: user.permissions || [],
        roles: user.roles || []
      });

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setPermissions([]);
    setRoles([]);
    setIsAuthenticated(false);
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (!permission) return true;
    if (isSuperAdmin()) return true;
    return permissions.some(p => p.name === permission || p === permission);
  };

  const hasAnyPermission = (permissionArray) => {
    if (!permissionArray || permissionArray.length === 0) return true;
    if (isSuperAdmin()) return true;
    return permissionArray.some(permission => hasPermission(permission));
  };

  const hasRole = (role) => {
    if (!role) return true;
    if (isSuperAdmin()) return true;
    return roles.some(r => r.name === role || r.role_name === role || r === role);
  };

  const isSuperAdmin = () => {
    return roles.some(r => 
      r.name === 'super-admin' || 
      r.role_name === 'super-admin' || 
      r === 'super-admin'
    );
  };

  const isAdmin = () => {
    return isSuperAdmin() || roles.some(r => 
      r.name === 'admin' || 
      r.role_name === 'admin' || 
      r === 'admin'
    );
  };

  const value = {
    user,
    permissions,
    roles,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
