import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('=== AUTH CHECK STARTED ===');
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (!token) {
        console.log('No token found, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('Fetching profile from:', `${API_BASE_URL}/auth/profile`);
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth profile response:', data);
        console.log('Response structure check:');
        console.log('- data.success:', data.success);
        console.log('- data.data:', data.data);
        console.log('- data.data.permissions:', data.data?.permissions);
        console.log('- data.data.roles:', data.data?.roles);
        
        if (data.success && data.data) {
          // Check if we have stored user data from login with more complete permissions
          const storedUserData = localStorage.getItem('userData');
          let userData = data.data;
          
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            console.log('Stored user data from login:', parsedUserData);
            
            // If profile has fewer permissions than login data, use login data
            if (parsedUserData.permissions && parsedUserData.permissions.length > data.data.permissions?.length) {
              console.log('Using permissions from login (more complete)');
              userData = { ...data.data, permissions: parsedUserData.permissions, roles: parsedUserData.roles };
            }
          }
          
          setUser(userData);
          setPermissions(userData.permissions || []);
          setRoles(userData.roles || []);
          console.log('User set:', userData);
          console.log('Permissions set:', userData.permissions);
          console.log('Roles set:', userData.roles);
        } else {
          console.log('Response not successful or no data');
        }
      } else {
        console.log('Response not OK, clearing token');
        // Token invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      console.log('=== AUTH CHECK COMPLETED ===');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        console.log('Login successful, storing token');
        const token = data.data.token;
        const user = data.data.user;
        
        localStorage.setItem('token', token);
        // Also store user data with permissions for later use
        localStorage.setItem('userData', JSON.stringify(user));
        
        setUser(user);
        setPermissions(user.permissions || []);
        setRoles(user.roles || []);
        console.log('Token stored:', token);
        console.log('User permissions from login:', user.permissions);
        console.log('User roles from login:', user.roles);
        return { success: true };
      } else {
        console.log('Login failed:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setPermissions([]);
    setRoles([]);
  };

  const hasPermission = (permissionName) => {
    return permissions.some(p => p.name === permissionName);
  };

  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some(name => hasPermission(name));
  };

  const hasRole = (roleName) => {
    return roles.some(r => r.name === roleName);
  };

  const hasAnyRole = (roleNames) => {
    return roleNames.some(name => hasRole(name));
  };

  const isSuperAdmin = () => {
    return hasRole('super-admin');
  };

  const isAdmin = () => {
    return hasRole('super-admin') || hasRole('admin');
  };

  const value = {
    user,
    permissions,
    roles,
    loading,
    login,
    logout,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
