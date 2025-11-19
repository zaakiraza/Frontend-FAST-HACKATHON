<<<<<<< HEAD
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { hasPermission, hasAnyPermission, isSuperAdmin, loading, user, permissions } = useAuth();

  // Debug logging
  console.log('Sidebar - User:', user);
  console.log('Sidebar - Permissions:', permissions);
  console.log('Sidebar - Loading:', loading);
=======
import { NavLink,useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

  const menuItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "fas fa-chart-line", 
      enabled: true,
      permission: "dashboard.view"
    },
    {
      path: "/energy",
      label: "Energy Monitoring",
      icon: "fas fa-bolt",
      enabled: true,
      permission: "energy.view"
    },
    {
      path: "/space",
      label: "Space Utilization",
      icon: "fas fa-building",
      enabled: true,
      permission: "space.view"
    },
    {
      path: "/maintenance",
      label: "Maintenance",
      icon: "fas fa-wrench",
      enabled: true,
      permission: "maintenance.view"
    },
    {
      path: null,
      label: "Admin",
      icon: "fas fa-cog",
      enabled: true,
      isSection: true,
      // Show admin section if user has any admin permissions
      permission: null // Checked separately below
    },
    {
      path: "/admin/campuses",
      label: "Campus Management",
      icon: "fas fa-university",
      enabled: true,
      permissions: ["space.view", "maintenance.view"] // Campus management requires space or maintenance view
    },
    {
      path: "/admin/buildings",
      label: "Building Management",
      icon: "fas fa-building",
      enabled: true,
      permissions: ["space.view", "maintenance.view"] // Building management requires space or maintenance view
    },
    {
      path: "/admin/rooms",
      label: "Room Management",
      icon: "fas fa-door-open",
      enabled: true,
      permissions: ["space.view", "maintenance.view"] // Room management requires space or maintenance view
    },
    {
      path: "/admin/tickets",
      label: "Ticket Management",
      icon: "fas fa-ticket-alt",
      enabled: true,
      permissions: ["maintenance.view", "maintenance.create", "maintenance.update"] // Ticket management
    },
    {
      path: "/security",
      label: "Security",
      icon: "fas fa-lock",
      enabled: false,
    },
    {
      path: "/mobility",
      label: "Mobility",
      icon: "fas fa-car",
      enabled: false,
    },
    {
      path: "/connectivity",
      label: "Connectivity",
      icon: "fas fa-wifi",
      enabled: false,
    },
  ];

  // Check if user has access to a menu item
  const hasAccess = (item) => {
    // While loading, show all items to prevent flicker
    if (loading) return true;

    // Super admin has access to everything
    if (isSuperAdmin && isSuperAdmin()) {
      console.log(`${item.label}: SUPER ADMIN - GRANTED`);
      return true;
    }

    // Disabled items are never shown
    if (item.enabled === false) {
      console.log(`${item.label}: DISABLED`);
      return false;
    }

    // Sections are shown if any child item is visible
    if (item.isSection) {
      // Check if any admin items are visible
      const adminItems = menuItems.filter(mi => 
        mi.path && mi.path.startsWith('/admin') && mi.enabled
      );
      const hasAdminAccess = adminItems.some(ai => hasAccess(ai));
      console.log(`${item.label} (Section): ${hasAdminAccess ? 'GRANTED' : 'DENIED'}`);
      return hasAdminAccess;
    }

    // Check single permission
    if (item.permission) {
      const granted = hasPermission && hasPermission(item.permission);
      console.log(`${item.label}: Permission '${item.permission}' - ${granted ? 'GRANTED' : 'DENIED'}`);
      return granted;
    }

    // Check multiple permissions (user needs at least one)
    if (item.permissions && item.permissions.length > 0) {
      const granted = hasAnyPermission && hasAnyPermission(item.permissions);
      console.log(`${item.label}: Permissions ${JSON.stringify(item.permissions)} - ${granted ? 'GRANTED' : 'DENIED'}`);
      return granted;
    }

    // No permission required
    console.log(`${item.label}: No permission required - GRANTED`);
    return true;
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
<<<<<<< HEAD
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div
        className="sidebar-header"
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="sidebar-logo">
          <span className="logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </span>
=======
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={()=>{navigate("/")}}>
          <span className="logo-icon"><i className="fas fa-graduation-cap"></i></span>
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
          <span className="logo-text">Smart Campus</span>
        </div>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.filter(hasAccess).map((item, index) => (
            <li
              key={item.path || `section-${index}`}
              className={`nav-item ${item.isSection ? "nav-section" : ""}`}
            >
              {item.isSection ? (
                <div className="nav-section-title">
                  <span className="nav-icon">
                    <i className={item.icon}></i>
                  </span>
                  <span className="nav-label">{item.label}</span>
                </div>
              ) : item.enabled ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  end={item.path === "/"}
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">
                    <i className={item.icon}></i>
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ) : (
                <div className="nav-link disabled">
                  <span className="nav-icon">
                    <i className={item.icon}></i>
                  </span>
                  <span className="nav-label">{item.label}</span>
                  <span className="disabled-badge">Soon</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-info">
          <p className="info-text">Version 1.0.0</p>
          <p className="info-text">© 2025 Smart Campus</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
