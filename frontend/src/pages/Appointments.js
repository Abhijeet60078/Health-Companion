import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      doctorName: 'Jane Cooper',
      date: '2024-04-15',
      time: '10:00 AM',
      type: 'checkup',
      department: 'General'
    },
    {
      id: 2,
      patientName: 'Michael Brown',
      doctorName: 'Wade Warren',
      date: '2024-04-16',
      time: '02:30 PM',
      type: 'lab',
      department: 'Lab'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load appointments from API on mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await api.appointments.getAll();
        if (data && Array.isArray(data)) {
          setAppointments(data);
        }
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);

  const handleEdit = (apt) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', apt.date);
    const newTime = prompt('Enter new time (HH:MM AM/PM):', apt.time);
    
    if (newDate && newTime) {
      const updatedApt = { ...apt, date: newDate, time: newTime };
      api.appointments.update(apt.id, updatedApt).then(response => {
        if (response.success) {
          setAppointments(appointments.map(a => a.id === apt.id ? updatedApt : a));
          alert('Appointment updated successfully!');
        }
      }).catch(err => alert('Failed to update appointment'));
    }
  };

  const handleCancel = async (apt) => {
    if (window.confirm(`Are you sure you want to cancel this appointment with ${apt.patientName}?`)) {
      try {
        const response = await api.appointments.delete(apt.id);
        if (response.success) {
          setAppointments(appointments.filter(a => a.id !== apt.id));
          alert('Appointment cancelled successfully!');
        }
      } catch (error) {
        alert('Failed to cancel appointment');
      }
    }
  };

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => new Date(a.date + 'T' + a.time) > new Date()).length,
    completed: Math.max(0, appointments.length - 1)
  };

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <h1>Appointments</h1>
      </div>

      <div className="page-content">
        <div className="filters">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="appointments-table card">
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#1abc9c' }}></i>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Date & Time</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.patientName}</td>
                    <td>{apt.doctorName}</td>
                    <td>{apt.date} {apt.time}</td>
                    <td>{apt.department || 'General'}</td>
                    <td>
                      <span className={`badge badge-${apt.type || 'checkup'}`}>
                        {apt.type === 'checkup' ? 'Doctor Checkup' : apt.type === 'lab' ? 'Lab Test' : 'Emergency'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => handleEdit(apt)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger" 
                        style={{ marginLeft: '4px' }}
                        onClick={() => handleCancel(apt)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
