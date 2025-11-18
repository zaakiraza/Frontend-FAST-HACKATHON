import { useState } from 'react';
import './Topbar.css';

const Topbar = () => {
  const [notificationCount] = useState(3);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" aria-label="Toggle menu">
          <span className="hamburger-icon"><i className="fas fa-bars"></i></span>
        </button>
        <h1 className="topbar-title">Smart Campus Infrastructure</h1>
      </div>
      
      <div className="topbar-right">
        <div className="topbar-item">
          <span className="role-badge">Admin</span>
        </div>
        
        <div className="topbar-item">
          <button className="notification-btn" aria-label="Notifications">
            <span className="bell-icon"><i className="fas fa-bell"></i></span>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        </div>
        
        <div className="topbar-item">
          <div className="user-profile">
            <div className="user-avatar">
              <span><i className="fas fa-user"></i></span>
            </div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">System Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
