import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'fas fa-chart-line', enabled: true },
    { path: '/energy', label: 'Energy Monitoring', icon: 'fas fa-bolt', enabled: true },
    { path: '/space', label: 'Space Utilization', icon: 'fas fa-building', enabled: true },
    { path: '/maintenance', label: 'Maintenance', icon: 'fas fa-wrench', enabled: true },
    { path: null, label: 'Admin', icon: 'fas fa-cog', enabled: true, isSection: true },
    { path: '/admin/campuses', label: 'Campus Management', icon: 'fas fa-university', enabled: true },
    { path: '/admin/rooms', label: 'Room Management', icon: 'fas fa-door-open', enabled: true },
    { path: '/admin/tickets', label: 'Ticket Management', icon: 'fas fa-ticket-alt', enabled: true },
    { path: '/security', label: 'Security', icon: 'fas fa-lock', enabled: false },
    { path: '/mobility', label: 'Mobility', icon: 'fas fa-car', enabled: false },
    { path: '/connectivity', label: 'Connectivity', icon: 'fas fa-wifi', enabled: false },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon"><i className="fas fa-graduation-cap"></i></span>
          <span className="logo-text">Smart Campus</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={item.path || `section-${index}`} className={`nav-item ${item.isSection ? 'nav-section' : ''}`}>
              {item.isSection ? (
                <div className="nav-section-title">
                  <span className="nav-icon"><i className={item.icon}></i></span>
                  <span className="nav-label">{item.label}</span>
                </div>
              ) : item.enabled ? (
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  <span className="nav-icon"><i className={item.icon}></i></span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ) : (
                <div className="nav-link disabled">
                  <span className="nav-icon"><i className={item.icon}></i></span>
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
