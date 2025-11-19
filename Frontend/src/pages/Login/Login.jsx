import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await authLogin(formData.email, formData.password);

      if (result.success) {
        console.log('Login successful');
        // Redirect to dashboard
        navigate('/');
      } else {
        setApiError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-section">
              <i className="fas fa-graduation-cap"></i>
              <h1>Smart Campus</h1>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {apiError && (
              <div className="error-alert">
                <i className="fas fa-exclamation-circle"></i>
                {apiError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </form>

          <div className="test-accounts">
            <div className="test-accounts-header">
              <i className="fas fa-vial"></i>
              <span>Sample Test Accounts</span>
            </div>
            <p className="test-password">Password for all accounts: <strong>password123</strong></p>
            
            <div className="test-accounts-grid">
              <div className="test-account-card">
                <div className="account-email">admin@smartcampus.edu</div>
                <div className="account-role">Super Admin</div>
                <div className="account-access">All</div>
              </div>
              
              <div className="test-account-card">
                <div className="account-email">john.doe@smartcampus.edu</div>
                <div className="account-role">Facility Manager</div>
                <div className="account-access">Maintenance & Space</div>
              </div>
              
              <div className="test-account-card">
                <div className="account-email">jane.smith@smartcampus.edu</div>
                <div className="account-role">Energy Manager</div>
                <div className="account-access">Energy Monitoring</div>
              </div>
              
              <div className="test-account-card">
                <div className="account-email">mike.wilson@smartcampus.edu</div>
                <div className="account-role">Maintenance Staff</div>
                <div className="account-access">Ticket Operations</div>
              </div>
              
              <div className="test-account-card">
                <div className="account-email">sarah.jones@smartcampus.edu</div>
                <div className="account-role">Viewer</div>
                <div className="account-access">Read-only</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-image">
          <div className="image-overlay">
            <h2>Smart Campus Infrastructure</h2>
            <p>Manage your campus facilities with real-time monitoring and analytics</p>
            <div className="features">
              <div className="feature-item">
                <i className="fas fa-chart-line"></i>
                <span>Real-time Analytics</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-bolt"></i>
                <span>Energy Monitoring</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-tools"></i>
                <span>Maintenance Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
