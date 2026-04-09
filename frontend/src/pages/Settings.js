import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Settings.css';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.user.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      });
      
      if (response.success) {
        if (setUser) {
          setUser(response.user);
        }
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    alert('Password change functionality will be implemented in the next update. Please contact support for password changes.');
  };

  const handleNotificationChange = (e) => {
    alert('Notification preferences updated!');
  };

  const handleAppearanceChange = (e) => {
    alert('Appearance settings updated!');
  };

  const stats = {
    total: 1,
    profile: 'Active'
  };

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="page-content">
        <div className="settings-container">
          {/* Settings Tabs */}
          <div className="settings-tabs">
            <button 
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile Settings
            </button>
            <button 
              className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-lock"></i>
              Security
            </button>
            <button 
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fas fa-palette"></i>
              Appearance
            </button>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-panel card">
              <h3>Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-panel card">
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword} className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Update Password'}
                </button>
              </form>

              <div className="security-section">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
                <button 
                  className="btn btn-outline"
                  onClick={() => alert('2FA setup will be implemented in a future update')}
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-panel card">
              <h3>Notification Preferences</h3>
              <div className="notification-settings">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Appointment Reminders</h4>
                    <p>Get reminded about upcoming appointments</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>System Updates</h4>
                    <p>Receive important system notifications</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive promotional content and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-panel card">
              <h3>Appearance Settings</h3>
              <div className="appearance-settings">
                <div className="setting-item">
                  <h4>Theme</h4>
                  <div className="theme-options">
                    <label className="theme-option active">
                      <input type="radio" name="theme" value="light" defaultChecked />
                      <i className="fas fa-sun"></i>
                      Light
                    </label>
                    <label className="theme-option">
                      <input type="radio" name="theme" value="dark" />
                      <i className="fas fa-moon"></i>
                      Dark
                    </label>
                    <label className="theme-option">
                      <input type="radio" name="theme" value="auto" />
                      <i className="fas fa-cog"></i>
                      Auto
                    </label>
                  </div>
                </div>

                <div className="setting-item">
                  <h4>Font Size</h4>
                  <div className="range-slider">
                    <input type="range" min="12" max="18" defaultValue="14" className="slider" />
                    <div className="range-labels">
                      <span>Small</span>
                      <span>Normal</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleAppearanceChange}
                  disabled={loading}
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Apply Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
