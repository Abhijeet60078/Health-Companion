import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/modals.css';

function WaitingListModal({ onClose }) {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWaitingList();
  }, []);

  const loadWaitingList = async () => {
    try {
      setLoading(true);
      const data = await api.waitingList.getAll();
      setWaitingList(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load waiting list');
      console.error('Error loading waiting list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await api.waitingList.approve(id);
      if (response.success) {
        alert('Appointment request approved!');
        loadWaitingList();
      }
    } catch (err) {
      alert('Error approving request: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.waitingList.reject(id);
      if (response.success) {
        alert('Appointment request rejected');
        loadWaitingList();
      }
    } catch (err) {
      alert('Error rejecting request: ' + err.message);
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      urgent: 'badge-danger',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-success',
    };
    return priorityMap[priority] || 'badge-info';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-list"></i> Waiting List
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message" style={{ marginBottom: '16px', padding: '10px', background: '#ffe5e5', color: '#e74c3c', borderRadius: '6px' }}>
            {error}
          </div>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#1abc9c' }}></i>
              <p>Loading waiting list...</p>
            </div>
          ) : (
            <>
              <div className="waiting-list-table">
                <div className="table-header">
                  <div className="col-1">Patient</div>
                  <div className="col-2">Doctor</div>
                  <div className="col-3">Reason</div>
                  <div className="col-4">Priority</div>
                  <div className="col-5">Approved Date</div>
                  <div className="col-6">Action</div>
                </div>

                {waitingList.map((item) => (
                  <div key={item.id} className="table-row">
                    <div className="col-1">
                      <span className="patient-name">{item.patientName}</span>
                      <small>{item.requestedDate}</small>
                    </div>
                    <div className="col-2">{item.doctorName}</div>
                    <div className="col-3">{item.reason}</div>
                    <div className="col-4">
                      <span className={`badge ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="col-5">{item.approvedDate || 'Pending'}</div>
                    <div className="col-6">
                      <button 
                        className="btn-action btn-approve"
                        onClick={() => handleApprove(item.id)}
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn-action btn-reject"
                        onClick={() => handleReject(item.id)}
                        title="Reject"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="waiting-list-stats">
                <div className="stat-card">
                  <h4>Total Requests</h4>
                  <span className="stat-number">{waitingList.length}</span>
                </div>
                <div className="stat-card">
                  <h4>Urgent</h4>
                  <span className="stat-number" style={{ color: '#e74c3c' }}>
                    {waitingList.filter(w => w.priority === 'urgent').length}
                  </span>
                </div>
                <div className="stat-card">
                  <h4>High Priority</h4>
                  <span className="stat-number" style={{ color: '#f39c12' }}>
                    {waitingList.filter(w => w.priority === 'high').length}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitingListModal;
