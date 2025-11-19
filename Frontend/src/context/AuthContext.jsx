import { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { API_BASE_URL } from '../config/apiConfig';

const AuthContext = createContext(null);

=======
import apiConfig from '../config/apiConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
  const [isAuthenticated, setIsAuthenticated] = useState(false);
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
<<<<<<< HEAD
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
=======
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${apiConfig.BASE_URL}/auth/profile`, {
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
      setLoading(false);
    }
  };

  const login = async (email, password) => {
<<<<<<< HEAD
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
=======
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/auth/login`, {
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setPermissions([]);
    setRoles([]);
<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  };

  const value = {
    user,
    permissions,
    roles,
    loading,
<<<<<<< HEAD
=======
    isAuthenticated,
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    login,
    logout,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasRole,
<<<<<<< HEAD
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
=======
    isSuperAdmin,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
};

export default AuthContext;
