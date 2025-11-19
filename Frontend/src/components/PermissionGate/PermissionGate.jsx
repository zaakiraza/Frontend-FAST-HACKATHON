import { useAuth } from '../../context/AuthContext';

/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions
 * 
 * Usage:
 * <PermissionGate permission="users.create">
 *   <button>Create User</button>
 * </PermissionGate>
 * 
 * <PermissionGate permissions={["users.create", "users.update"]} requireAll={false}>
 *   <button>Manage Users</button>
 * </PermissionGate>
 */
const PermissionGate = ({ 
  permission, 
  permissions, 
  role,
  roles,
  requireAll = true, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, isSuperAdmin, loading } = useAuth();

  // While loading, show children to prevent flicker (or show nothing if you prefer)
  if (loading) {
    return <>{children}</>;
  }

  // Super admin always has access
  if (isSuperAdmin && isSuperAdmin()) {
    return <>{children}</>;
  }

  // Check single permission
  if (permission) {
    return (hasPermission && hasPermission(permission)) ? <>{children}</> : fallback;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? permissions.every(p => hasPermission && hasPermission(p))
      : (hasAnyPermission && hasAnyPermission(permissions));
    return hasAccess ? <>{children}</> : fallback;
  }

  // Check single role
  if (role) {
    return (hasRole && hasRole(role)) ? <>{children}</> : fallback;
  }

  // Check multiple roles
  if (roles && roles.length > 0) {
    const hasAccess = requireAll 
      ? roles.every(r => hasRole && hasRole(r))
      : (hasAnyRole && hasAnyRole(roles));
    return hasAccess ? <>{children}</> : fallback;
  }

  // No permission/role specified, render children
  return <>{children}</>;
};

export default PermissionGate;
