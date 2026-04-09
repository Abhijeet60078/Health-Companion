import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/appointments', icon: 'fas fa-calendar-alt', label: 'Appointment' },
    { path: '/patients', icon: 'fas fa-users', label: 'Patients' },
    { path: '/doctors', icon: 'fas fa-user-md', label: 'Doctors' },
    { path: '/employee', icon: 'fas fa-briefcase', label: 'Employee' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="logo">
        <i className="fas fa-heart"></i>
        <span>Health Companion</span>
      </Link>
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="nav-footer">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="nav-item logout-btn"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
