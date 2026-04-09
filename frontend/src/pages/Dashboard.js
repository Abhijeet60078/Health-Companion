import React, { useState } from 'react';
import Layout from '../components/Layout';
import QuickActions from '../components/QuickActions';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const [stats] = useState({
    totalAppointments: {
      value: 1243,
      growth: 12,
      forecast: 1450
    },
    activePatients: {
      value: 892,
      growth: 8,
      critical: 23
    },
    revenue: {
      value: '$127,450',
      growth: 23,
      monthly: '$15,680'
    },
    staffOnDuty: {
      value: 34,
      growth: 2,
      available: 28
    }
  });

  const [chartData] = useState({
    appointmentsByStatus: {
      completed: 645,
      scheduled: 398,
      cancelled: 87,
      noShow: 45
    },
    appointmentsBySpecialty: {
      'General': 312,
      'Cardiology': 198,
      'Orthopedics': 156,
      'Neurology': 127,
      'Pediatrics': 98
    }
  });

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">{getTimeOfDay()}, {user?.firstName || user?.name || 'User'}!</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card premium">
            <div className="stat-top">
              <div className="stat-icon appointments">
                <i className="fas fa-calendar-check"></i>
              </div>
              <span className="stat-growth positive">
                <i className="fas fa-arrow-up-right"></i> {stats.totalAppointments.growth}%
              </span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Appointments</p>
              <h3 className="stat-value">{stats.totalAppointments.value}</h3>
              <p className="stat-detail">
                Forecast: <span className="forecast-value">{stats.totalAppointments.forecast}</span>
              </p>
            </div>
            <div className="stat-progress-bar">
              <div className="progress-fill" style={{width: '76%'}}></div>
            </div>
          </div>

          <div className="stat-card premium">
            <div className="stat-top">
              <div className="stat-icon patients">
                <i className="fas fa-user-injured"></i>
              </div>
              <span className="stat-growth positive">
                <i className="fas fa-arrow-up-right"></i> {stats.activePatients.growth}%
              </span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Active Patients</p>
              <h3 className="stat-value">{stats.activePatients.value}</h3>
              <p className="stat-detail">
                <span className="critical-badge">{stats.activePatients.critical}</span> Critical
              </p>
            </div>
            <div className="stat-progress-bar">
              <div className="progress-fill" style={{width: '89%'}}></div>
            </div>
          </div>

          <div className="stat-card premium">
            <div className="stat-top">
              <div className="stat-icon revenue">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <span className="stat-growth positive">
                <i className="fas fa-arrow-up-right"></i> {stats.revenue.growth}%
              </span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Revenue</p>
              <h3 className="stat-value">{stats.revenue.value}</h3>
              <p className="stat-detail">
                This month: <span className="monthly-value">{stats.revenue.monthly}</span>
              </p>
            </div>
            <div className="stat-progress-bar">
              <div className="progress-fill" style={{width: '85%'}}></div>
            </div>
          </div>

          <div className="stat-card premium">
            <div className="stat-top">
              <div className="stat-icon operations">
                <i className="fas fa-stethoscope"></i>
              </div>
              <span className="stat-growth positive">
                <i className="fas fa-arrow-up-right"></i> {stats.staffOnDuty.growth}%
              </span>
            </div>
            <div className="stat-info">
              <p className="stat-label">Staff On Duty</p>
              <h3 className="stat-value">{stats.staffOnDuty.value}</h3>
              <p className="stat-detail">
                Available: <span className="available-value">{stats.staffOnDuty.available}</span>
              </p>
            </div>
            <div className="stat-progress-bar">
              <div className="progress-fill" style={{width: '82%'}}></div>
            </div>
          </div>
        </div>

        {/* Charts & Analytics Row */}
        <div className="analytics-grid">
          <div className="card chart-card">
            <div className="card-header">
              <h3>Appointments Overview</h3>
              <span className="chart-period">This Month</span>
            </div>
            <div className="chart-container">
              <div className="status-breakdown">
                {Object.entries(chartData.appointmentsByStatus).map(([status, count], idx) => {
                  const total = Object.values(chartData.appointmentsByStatus).reduce((a, b) => a + b, 0);
                  const percentage = Math.round((count / total) * 100);
                  const colors = ['#1abc9c', '#3498db', '#e74c3c', '#f39c12'];
                  return (
                    <div key={idx} className="status-item">
                      <div className="status-bar-wrapper">
                        <div className="status-label">
                          <span className="status-dot" style={{backgroundColor: colors[idx]}}></span>
                          <span className="status-name">{status}</span>
                        </div>
                        <span className="status-value">{count}</span>
                      </div>
                      <div className="status-bar-bg">
                        <div className="status-bar" style={{width: `${percentage}%`, backgroundColor: colors[idx]}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <h3>Appointments by Specialty</h3>
              <span className="chart-period">Distribution</span>
            </div>
            <div className="chart-container">
              <div className="specialty-grid">
                {Object.entries(chartData.appointmentsBySpecialty).map(([specialty, count], idx) => {
                  const total = Object.values(chartData.appointmentsBySpecialty).reduce((a, b) => a + b, 0);
                  const percentage = Math.round((count / total) * 100);
                  const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f39c12'];
                  return (
                    <div key={idx} className="specialty-item">
                      <div className="specialty-bar">
                        <div className="specialty-fill" style={{height: `${percentage * 2}px`, backgroundColor: colors[idx]}} title={specialty}></div>
                      </div>
                      <p className="specialty-name">{specialty}</p>
                      <p className="specialty-count">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h3>Recent Appointments</h3>
                <p className="card-subtitle">Today & Upcoming</p>
              </div>
              <a href="/appointments" className="card-link">View All →</a>
            </div>
            <div className="appointment-list modern">
              <div className="appointment-item modern">
                <div className="appointment-left">
                  <div className="appointment-time-box">
                    <span className="appointment-time">10:00</span>
                    <span className="appointment-ampm">AM</span>
                  </div>
                  <div className="appointment-avatar">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=1abc9c&color=fff" alt="Patient" />
                  </div>
                </div>
                <div className="appointment-content">
                  <p className="appointment-name">Sarah Johnson</p>
                  <p className="appointment-details">
                    <i className="fas fa-user-md"></i> Dr. Jane Cooper
                  </p>
                  <p className="appointment-type">General Checkup</p>
                </div>
                <div className="appointment-status confirmed">
                  <i className="fas fa-check-circle"></i>
                  <span>Confirmed</span>
                </div>
              </div>

              <div className="appointment-item modern">
                <div className="appointment-left">
                  <div className="appointment-time-box">
                    <span className="appointment-time">02:30</span>
                    <span className="appointment-ampm">PM</span>
                  </div>
                  <div className="appointment-avatar">
                    <img src="https://ui-avatars.com/api/?name=Michael+Brown&background=3498db&color=fff" alt="Patient" />
                  </div>
                </div>
                <div className="appointment-content">
                  <p className="appointment-name">Michael Brown</p>
                  <p className="appointment-details">
                    <i className="fas fa-user-md"></i> Dr. Wade Warren
                  </p>
                  <p className="appointment-type">Cardiac Assessment</p>
                </div>
                <div className="appointment-status pending">
                  <i className="fas fa-clock"></i>
                  <span>Pending</span>
                </div>
              </div>

              <div className="appointment-item modern">
                <div className="appointment-left">
                  <div className="appointment-time-box">
                    <span className="appointment-time">11:00</span>
                    <span className="appointment-ampm">AM</span>
                  </div>
                  <div className="appointment-avatar">
                    <img src="https://ui-avatars.com/api/?name=Emily+Davis&background=e74c3c&color=fff" alt="Patient" />
                  </div>
                </div>
                <div className="appointment-content">
                  <p className="appointment-name">Emily Davis</p>
                  <p className="appointment-details">
                    <i className="fas fa-user-md"></i> Dr. Robert Fox
                  </p>
                  <p className="appointment-type">Orthopedic Consultation</p>
                </div>
                <div className="appointment-status urgent">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>Urgent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h3>Active Patients</h3>
                <p className="card-subtitle">Current Hospital Census</p>
              </div>
              <a href="/patients" className="card-link">View All →</a>
            </div>
            <div className="patient-list modern">
              <div className="patient-item modern">
                <div className="patient-avatar-wrapper">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=1abc9c&color=fff" alt="Patient" className="patient-avatar" />
                  <span className="patient-online-status online"></span>
                </div>
                <div className="patient-content">
                  <p className="patient-name">Sarah Johnson</p>
                  <p className="patient-age">32 years • Female</p>
                  <p className="patient-condition">
                    <i className="fas fa-heart"></i> Hypertension
                  </p>
                </div>
                <div className="patient-action-section">
                  <span className="patient-badge active">Active</span>
                  <button className="patient-btn-quick">
                    <i className="fas fa-phone"></i>
                  </button>
                </div>
              </div>

              <div className="patient-item modern">
                <div className="patient-avatar-wrapper">
                  <img src="https://ui-avatars.com/api/?name=Michael+Brown&background=3498db&color=fff" alt="Patient" className="patient-avatar" />
                  <span className="patient-online-status online"></span>
                </div>
                <div className="patient-content">
                  <p className="patient-name">Michael Brown</p>
                  <p className="patient-age">45 years • Male</p>
                  <p className="patient-condition">
                    <i className="fas fa-heart"></i> Cardiac Condition
                  </p>
                </div>
                <div className="patient-action-section">
                  <span className="patient-badge warning">Monitoring</span>
                  <button className="patient-btn-quick">
                    <i className="fas fa-phone"></i>
                  </button>
                </div>
              </div>

              <div className="patient-item modern">
                <div className="patient-avatar-wrapper">
                  <img src="https://ui-avatars.com/api/?name=Emily+Davis&background=e74c3c&color=fff" alt="Patient" className="patient-avatar" />
                  <span className="patient-online-status idle"></span>
                </div>
                <div className="patient-content">
                  <p className="patient-name">Emily Davis</p>
                  <p className="patient-age">28 years • Female</p>
                  <p className="patient-condition">
                    <i className="fas fa-bone"></i> Fracture - Recovery
                  </p>
                </div>
                <div className="patient-action-section">
                  <span className="patient-badge critical">Critical</span>
                  <button className="patient-btn-quick">
                    <i className="fas fa-phone"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
