import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  const sampleAccounts = [
    { email: 'admin@smartcampus.edu', role: 'Super Admin', permissions: 'All' },
    { email: 'john.doe@smartcampus.edu', role: 'Facility Manager', permissions: 'Maintenance & Space' },
    { email: 'jane.smith@smartcampus.edu', role: 'Energy Manager', permissions: 'Energy Monitoring' },
    { email: 'mike.wilson@smartcampus.edu', role: 'Maintenance Staff', permissions: 'Ticket Operations' },
    { email: 'sarah.jones@smartcampus.edu', role: 'Viewer', permissions: 'Read-only' },
  ];

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Smart Campus Management</h1>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="login">Email or Username</label>
            <input
              type="text"
              id="login"
              name="login"
              value={credentials.login}
              onChange={handleChange}
              placeholder="Enter your email or username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="sample-accounts">
          <h3>Sample Test Accounts</h3>
          <p className="sample-note">Password for all accounts: <strong>password123</strong></p>
          <div className="accounts-grid">
            {sampleAccounts.map((account, index) => (
              <div key={index} className="account-card">
                <div className="account-email">{account.email}</div>
                <div className="account-role">{account.role}</div>
                <div className="account-permissions">{account.permissions}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
