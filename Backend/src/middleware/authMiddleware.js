const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    // Get user from database
    const user = await AuthModel.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = {
      userId: user.id,
      username: user.username,
      email: user.email,
      isActive: user.is_active
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Check if user has specific permission
const hasPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      const hasAccess = await AuthModel.userHasPermission(userId, permissionName);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
          required_permission: permissionName
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error.message
      });
    }
  };
};

// Check if user has any of the specified permissions
const hasAnyPermission = (permissionNames) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      const hasAccess = await AuthModel.userHasAnyPermission(userId, permissionNames);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
          required_permissions: permissionNames
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: error.message
      });
    }
  };
};

// Check if user has specific role
const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      const hasAccess = await AuthModel.userHasRole(userId, roleName);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'You do not have the required role to perform this action',
          required_role: roleName
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Role check failed',
        error: error.message
      });
    }
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    const user = await AuthModel.getUserById(decoded.userId);
    
    req.user = user ? {
      userId: user.id,
      username: user.username,
      email: user.email,
      isActive: user.is_active
    } : null;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  hasPermission,
  hasAnyPermission,
  hasRole,
  optionalAuth
};
