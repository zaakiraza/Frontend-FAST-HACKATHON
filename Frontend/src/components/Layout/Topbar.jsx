import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getStoredUser } from '../../api/authApi';
import './Topbar.css';

const Topbar = ({ onMenuToggle }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <div className="user-profile">
            <div className="user-avatar">
              <span><i className="fas fa-user"></i></span>
            </div>
            <div className="user-info">
              <span className="user-name">
                {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
              </span>
              <span className="user-role">
                {user?.roles?.[0]?.role_name || 'System Administrator'}
              </span>
            </div>
          </div>
        </div>

        <div className="topbar-item">
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
