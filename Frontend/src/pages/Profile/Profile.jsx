import { useState, useEffect } from 'react';
import { getStoredUser } from '../../api/authApi';
import { updateProfile, changePassword } from '../../api/profileApi';
import Alert from '../../components/Alert/Alert';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Personal Info Form
  const [personalForm, setPersonalForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setPersonalForm({
        first_name: storedUser.first_name || '',
        last_name: storedUser.last_name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || ''
      });
    }
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.current_password) {
      errors.current_password = 'Current password is required';
    }

    if (!passwordForm.new_password) {
      errors.new_password = 'New password is required';
    } else if (passwordForm.new_password.length < 6) {
      errors.new_password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.new_password)) {
      errors.new_password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordForm.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await updateProfile(personalForm);
      setUser({ ...user, ...personalForm });
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setAlert({ type: 'success', message: 'Password changed successfully!' });
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            <i className="fas fa-user"></i>
          </div>
          <div className="profile-header-info">
            <h1>{user.first_name} {user.last_name}</h1>
            <p>{user.email}</p>
            <span className="user-role-badge">
              {user.roles?.[0]?.role_name || 'User'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="fas fa-user"></i>
            Personal Information
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="fas fa-lock"></i>
            Security
          </button>
        </div>

        <div className="profile-tab-content">
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}

          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalSubmit} className="profile-form">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">
                    <i className="fas fa-user"></i>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={personalForm.first_name}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">
                    <i className="fas fa-user"></i>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={personalForm.last_name}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalForm.email}
                  onChange={handlePersonalChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalForm.phone}
                  onChange={handlePersonalChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <h2>Change Password</h2>

              <div className="form-group">
                <label htmlFor="current_password">
                  <i className="fas fa-lock"></i>
                  Current Password
                </label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  className={passwordErrors.current_password ? 'error' : ''}
                />
                {passwordErrors.current_password && (
                  <span className="error-message">{passwordErrors.current_password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="new_password">
                  <i className="fas fa-key"></i>
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  className={passwordErrors.new_password ? 'error' : ''}
                />
                {passwordErrors.new_password && (
                  <span className="error-message">{passwordErrors.new_password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">
                  <i className="fas fa-check"></i>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  className={passwordErrors.confirm_password ? 'error' : ''}
                />
                {passwordErrors.confirm_password && (
                  <span className="error-message">{passwordErrors.confirm_password}</span>
                )}
              </div>

              <div className="password-requirements">
                <p><strong>Password Requirements:</strong></p>
                <ul>
                  <li>At least 6 characters long</li>
                  <li>Contains uppercase letter</li>
                  <li>Contains lowercase letter</li>
                  <li>Contains number</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Changing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
