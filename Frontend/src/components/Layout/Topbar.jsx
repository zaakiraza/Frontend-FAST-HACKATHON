import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const Topbar = ({ onMenuToggle }) => {
  const [notificationCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, roles } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = () => {
    if (roles.includes('super-admin')) return 'Super Admin';
    if (roles.includes('admin')) return 'Administrator';
    if (roles.includes('facility-manager')) return 'Facility Manager';
    if (roles.includes('energy-manager')) return 'Energy Manager';
    if (roles.includes('maintenance-staff')) return 'Maintenance Staff';
    if (roles.includes('viewer')) return 'Viewer';
    return 'User';
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" aria-label="Toggle menu" onClick={onMenuToggle}>
          <span className="hamburger-icon"><i className="fas fa-bars"></i></span>
        </button>
        <h1 className="topbar-title">Smart Campus Infrastructure</h1>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-item">
          <span className="role-badge">{getRoleDisplay()}</span>
        </div>
        
        <div className="topbar-item">
          <button className="notification-btn" aria-label="Notifications">
            <span className="bell-icon"><i className="fas fa-bell"></i></span>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        </div>
        
        <div className="topbar-item user-menu-container">
          <div 
            className="user-profile" 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: 'pointer' }}
          >
            <div className="user-avatar">
              <span><i className="fas fa-user"></i></span>
            </div>
            <div className="user-info">
              <span className="user-name">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username || 'User'}
              </span>
              <span className="user-role">{getRoleDisplay()}</span>
            </div>
          </div>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>{user?.email}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
