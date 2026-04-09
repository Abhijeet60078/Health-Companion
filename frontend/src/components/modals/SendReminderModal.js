import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/modals.css';

function SendReminderModal({ onClose }) {
  const [formData, setFormData] = useState({
    reminderType: 'all',
    appointmentDate: '',
    message: 'This is a reminder for your upcoming appointment. Please arrive 10 minutes early.',
    deliveryMethod: 'sms',
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await api.appointments.getAll();
      setAppointments(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const response = await api.reminders.send({
        appointmentIds: formData.reminderType === 'all' 
          ? appointments.map(a => a.id)
          : appointments.filter(a => a.date === formData.appointmentDate).map(a => a.id),
        deliveryMethod: formData.deliveryMethod,
        message: formData.message
      });

      if (response.success) {
        alert(response.message);
        onClose();
      } else {
        setError(response.error || 'Failed to send reminders');
      }
    } catch (err) {
      setError(err.message || 'Error sending reminders');
      console.error('Reminder error:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredAppointments = formData.reminderType === 'date' && formData.appointmentDate
    ? appointments.filter(a => a.date === formData.appointmentDate)
    : appointments;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-envelope"></i> Send Reminder
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Reminder Settings</h3>

            {error && <div className="error-message" style={{ marginBottom: '16px', padding: '10px', background: '#ffe5e5', color: '#e74c3c', borderRadius: '6px' }}>
              {error}
            </div>}

            <div className="form-group">
              <label htmlFor="reminderType">Send to:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reminderType"
                    value="all"
                    checked={formData.reminderType === 'all'}
                    onChange={handleChange}
                  />
                  All Appointments
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="reminderType"
                    value="date"
                    checked={formData.reminderType === 'date'}
                    onChange={handleChange}
                  />
                  Specific Date
                </label>
              </div>
            </div>

            {formData.reminderType === 'date' && (
              <div className="form-group">
                <label htmlFor="appointmentDate">Select Date:</label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="deliveryMethod">Delivery Method:</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="both">SMS & Email</option>
                <option value="notification">In-App Notification</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
              ></textarea>
              <small className="char-count">
                {formData.message.length} characters
              </small>
            </div>
          </div>

          <div className="form-section">
            <h3>Recipients Preview ({filteredAppointments.length})</h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#1abc9c' }}></i>
                <p>Loading appointments...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="appointments-preview">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="appointment-card">
                    <div className="appointment-info">
                      <strong>{apt.patientName}</strong>
                      <span className="apt-date">
                        <i className="fas fa-calendar"></i> {apt.date} at {apt.time}
                      </span>
                      <span className="apt-doctor">
                        <i className="fas fa-user-md"></i> Dr. {apt.doctorName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
                No appointments found for the selected criteria
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={sending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={sending || filteredAppointments.length === 0}>
              {sending ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Send Reminders ({filteredAppointments.length})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendReminderModal;
