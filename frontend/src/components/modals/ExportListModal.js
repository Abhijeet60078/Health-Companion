import React, { useState } from 'react';
import api from '../../services/api';
import '../../styles/modals.css';

function ExportListModal({ onClose }) {
  const [exportData, setExportData] = useState({
    exportType: 'appointments',
    dateRange: 'current-month',
    format: 'csv',
    includePatientDetails: true,
    includeDoctorInfo: true,
    includeNotes: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.export.run({
        dataType: exportData.exportType,
        format: exportData.format,
        dateRange: exportData.dateRange,
        includePatientDetails: exportData.includePatientDetails,
        includeDoctorInfo: exportData.includeDoctorInfo,
        includeNotes: exportData.includeNotes
      });

      if (response.success) {
        if (exportData.format === 'csv') {
          // Create CSV download
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = response.fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          // Create JSON download
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = response.fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        }
        alert(`Data exported successfully as ${response.fileName}`);
        onClose();
      } else {
        setError(response.error || 'Failed to export data');
      }
    } catch (err) {
      setError(err.message || 'Error exporting data');
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-file-download"></i> Export List
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleExport} className="modal-form">
          {error && <div className="error-message" style={{ marginBottom: '16px', padding: '10px', background: '#ffe5e5', color: '#e74c3c', borderRadius: '6px' }}>
            {error}
          </div>}

          <div className="form-group">
            <label htmlFor="exportType">Export Type:</label>
            <select
              id="exportType"
              name="exportType"
              value={exportData.exportType}
              onChange={handleChange}
            >
              <option value="appointments">Appointments</option>
              <option value="patients">Patients</option>
              <option value="doctors">Doctors</option>
              <option value="employees">Employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateRange">Date Range:</label>
            <select
              id="dateRange"
              name="dateRange"
              value={exportData.dateRange}
              onChange={handleChange}
            >
              <option value="today">Today</option>
              <option value="current-week">Current Week</option>
              <option value="current-month">Current Month</option>
              <option value="current-year">Current Year</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="format">Export Format:</label>
            <select
              id="format"
              name="format"
              value={exportData.format}
              onChange={handleChange}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="includePatientDetails"
                checked={exportData.includePatientDetails}
                onChange={handleChange}
              />
              Include Patient Details
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="includeDoctorInfo"
                checked={exportData.includeDoctorInfo}
                onChange={handleChange}
              />
              Include Doctor Information
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="includeNotes"
                checked={exportData.includeNotes}
                onChange={handleChange}
              />
              Include Notes & Comments
            </label>
          </div>

          <div className="export-summary">
            <h4>Export Summary:</h4>
            <ul>
              <li><strong>Type:</strong> {exportData.exportType}</li>
              <li><strong>Format:</strong> {exportData.format.toUpperCase()}</li>
              <li><strong>Date Range:</strong> {exportData.dateRange}</li>
              <li><strong>Details Included:</strong> {[exportData.includePatientDetails && 'Patients', exportData.includeDoctorInfo && 'Doctors', exportData.includeNotes && 'Notes'].filter(Boolean).join(', ') || 'Basic'}</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Exporting...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i> Export {exportData.exportType}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExportListModal;
