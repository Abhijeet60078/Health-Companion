import React, { useState } from 'react';
import api from '../../services/api';
import '../../styles/modals.css';

function ScheduleNewModal({ onClose }) {
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doctors = [
    'Jane Cooper - General',
    'Wade Warren - Cardiology',
    'Robert Fox - Orthopedics',
    'Albert Flores - Neurology',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.appointments.create({
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        reason: formData.reason
      });

      if (response.success) {
        alert(`Appointment scheduled successfully for ${formData.patientName}`);
        onClose();
      } else {
        setError(response.error || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError(err.message || 'Error scheduling appointment');
      console.error('Appointment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-calendar-plus"></i> Schedule New Appointment
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message" style={{ marginBottom: '16px', padding: '10px', background: '#ffe5e5', color: '#e74c3c', borderRadius: '6px' }}>
            {error}
          </div>}

          <div className="form-group">
            <label htmlFor="patientName">Patient Name</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doctorName">Select Doctor</label>
            <select
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor, idx) => (
                <option key={idx} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Date</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Time</label>
              <input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason for appointment"
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Scheduling...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i> Schedule Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleNewModal;
