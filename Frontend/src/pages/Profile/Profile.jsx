import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { getStoredUser } from '../../api/authApi';
import { updateProfile, changePassword } from '../../api/profileApi';
=======
import { useAuth } from '../../context/AuthContext';
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
import Alert from '../../components/Alert/Alert';
import './Profile.css';

const Profile = () => {
<<<<<<< HEAD
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Personal Info Form
  const [personalForm, setPersonalForm] = useState({
=======
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

<<<<<<< HEAD
  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
=======
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (user) {
      setPersonalInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
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
=======
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    }
  };

  const validatePassword = () => {
    const errors = {};
<<<<<<< HEAD

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
=======
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('Profile updated successfully', 'success');
    } catch (error) {
      showAlert(error.message || 'Failed to update profile', 'error');
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
<<<<<<< HEAD
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
=======
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('Password changed successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showAlert(error.message || 'Failed to change password', 'error');
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
<<<<<<< HEAD
    return <div className="profile-loading">Loading profile...</div>;
=======
    return <div className="loading-page">Loading...</div>;
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  }

  return (
    <div className="profile-page">
<<<<<<< HEAD
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
=======
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <i className="fas fa-user"></i>
            </div>
            <h3>{user.first_name} {user.last_name}</h3>
            <p className="user-email">{user.email}</p>
            <span className="user-role-badge">
              {user.roles?.[0]?.display_name || 'User'}
            </span>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <i className="fas fa-user-circle"></i>
              Personal Information
            </button>
            <button
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-lock"></i>
              Security
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <h2>Personal Information</h2>
              <form onSubmit={handlePersonalInfoSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={personalInfo.first_name}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={personalInfo.last_name}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
                    required
                  />
                </div>

                <div className="form-group">
<<<<<<< HEAD
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
=======
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? 'error' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <span className="error-message">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <span className="error-message">{passwordErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="error-message">{passwordErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li className={passwordData.newPassword.length >= 6 ? 'valid' : ''}>
                      At least 6 characters
                    </li>
                    <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(passwordData.newPassword) ? 'valid' : ''}>
                      One number
                    </li>
                  </ul>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
