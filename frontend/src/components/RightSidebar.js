import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RightSidebar.css';

const RightSidebar = ({ stats = {}, children }) => {
  const [loading, setLoading] = useState(false);
  const [liveStats, setLiveStats] = useState({
    total: 0,
    appointments: 0,
    patients: 0,
    ...stats
  });
  const navigate = useNavigate();

  // Fetch real stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointments, patients] = await Promise.all([
          api.appointments.getAll(),
          api.patients.getAll()
        ]);
        
        setLiveStats({
          total: (appointments?.length || 0) + (patients?.length || 0),
          appointments: appointments?.length || 0,
          patients: patients?.length || 0,
          ...stats
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [stats]);

  const handleScheduleNew = () => {
    navigate('/appointments');
  };

  const handleWaitingList = () => {
    navigate('/appointments');
  };

  const handleSendReminder = async () => {
    try {
      setLoading(true);
      const response = await api.reminders.send({
        type: 'all',
        message: 'Health Companion Appointment Reminder'
      });
      
      if (response.success) {
        alert('✅ Reminders sent successfully to all patients!');
      } else {
        alert('❌ Failed to send reminders. ' + (response.error || ''));
      }
    } catch (error) {
      alert('❌ Error sending reminders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportList = async () => {
    try {
      setLoading(true);
      const response = await api.export.run({
        type: 'appointments',
        format: 'csv'
      });
      
      if (response.success) {
        // Create a blob and download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('✅ Data exported successfully!');
      } else {
        alert('❌ Failed to export data. ' + (response.error || ''));
      }
    } catch (error) {
      alert('❌ Error exporting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="right-sidebar">
      <div className="sidebar-header">
        <h3>Quick Actions</h3>
      </div>

      <div className="quick-actions">
        <button 
          className="action-btn"
          onClick={handleScheduleNew}
          disabled={loading}
        >
          <i className="fas fa-calendar-plus"></i>
          <span>Schedule New</span>
        </button>
        <button 
          className="action-btn"
          onClick={handleWaitingList}
          disabled={loading}
        >
          <i className="fas fa-clock"></i>
          <span>Waiting List</span>
        </button>
        <button 
          className="action-btn"
          onClick={handleSendReminder}
          disabled={loading}
        >
          <i className="fas fa-bell"></i>
          <span>{loading ? 'Sending...' : 'Send Reminder'}</span>
        </button>
        <button 
          className="action-btn"
          onClick={handleExportList}
          disabled={loading}
        >
          <i className="fas fa-file-export"></i>
          <span>{loading ? 'Exporting...' : 'Export List'}</span>
        </button>
      </div>

      {children || (
        <div className="stats-card">
          <h4>Summary</h4>
          <div className="summary-items">
            <div className="summary-item">
              <span className="label">Total</span>
              <span className="value">{liveStats.total}</span>
            </div>
            <div className="summary-item">
              <span className="label">Appointments</span>
              <span className="value">{liveStats.appointments}</span>
            </div>
            <div className="summary-item">
              <span className="label">Patients</span>
              <span className="value">{liveStats.patients}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
