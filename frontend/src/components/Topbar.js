import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Topbar.css';

const Topbar = ({ onSearch }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleProfile = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  return (
    <div className="top-bar">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      <div className="user-section">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        
        <i className="fas fa-bell notification-icon"></i>
        
        <div className="user-profile">
          <button
            className="user-avatar-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img
              src={user?.avatar || 'https://via.placeholder.com/40'}
              alt="User Avatar"
              className="user-avatar"
            />
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <p className="user-name">{user?.name || 'User'}</p>
                <p className="user-email">{user?.email}</p>
              </div>
              
              <div className="user-menu-items">
                <button className="user-menu-item" onClick={handleProfile}>
                  <i className="fas fa-user"></i>
                  Profile
                </button>
                <button className="user-menu-item" onClick={handleSettings}>
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="user-menu-item logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
