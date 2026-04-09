import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      phone: '(555) 123-4567',
      email: 'sarah@example.com',
      department: 'Cardiology',
      status: 'active',
      lastVisit: '2024-04-01'
    },
    {
      id: 2,
      name: 'Michael Brown',
      age: 45,
      phone: '(555) 234-5678',
      email: 'michael@example.com',
      department: 'Orthopedics',
      status: 'active',
      lastVisit: '2024-03-28'
    },
    {
      id: 3,
      name: 'Emily Davis',
      age: 28,
      phone: '(555) 345-6789',
      email: 'emily@example.com',
      department: 'General',
      status: 'inactive',
      lastVisit: '2024-02-15'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  // Load patients from API
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await api.patients.getAll();
        if (data && Array.isArray(data)) {
          setPatients(data);
        }
      } catch (error) {
        console.error('Failed to load patients:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatients();
  }, []);

  const handleViewPatient = (patient) => {
    alert(`Patient Details:\n\nName: ${patient.name}\nAge: ${patient.age}\nDepartment: ${patient.department}\nPhone: ${patient.phone}\nEmail: ${patient.email}\nStatus: ${patient.status}`);
  };

  const handleEditPatient = (patient) => {
    const newAge = prompt('Enter age:', patient.age);
    const newPhone = prompt('Enter phone:', patient.phone);
    const newDepartment = prompt('Enter department:', patient.department);
    
    if (newAge && newPhone && newDepartment) {
      const updated = { ...patient, age: parseInt(newAge), phone: newPhone, department: newDepartment };
      api.patients.update(patient.id, updated).then(response => {
        if (response.success) {
          setPatients(patients.map(p => p.id === patient.id ? updated : p));
          alert('Patient updated successfully!');
        }
      }).catch(err => alert('Failed to update patient'));
    }
  };

  const handleDeletePatient = async (patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      try {
        setPatients(patients.filter(p => p.id !== patient.id));
        alert('Patient deleted successfully!');
      } catch (error) {
        alert('Failed to delete patient');
      }
    }
  };

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    inactive: patients.filter(p => p.status === 'inactive').length
  };

  const filteredPatients = filterStatus === 'all' 
    ? patients 
    : patients.filter(p => p.status === filterStatus);

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <h1>Patients</h1>
        <div className="view-toggle">
          <button 
            className={`btn btn-small ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="fas fa-th"></i>
          </button>
          <button 
            className={`btn btn-small ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('table')}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="filters">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#1abc9c' }}></i>
            <p>Loading patients...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="patients-grid">
            {filteredPatients.map(patient => (
              <div key={patient.id} className="patient-card card">
                <div className="patient-card-header">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${patient.name}`} 
                    alt={patient.name}
                    className="patient-card-avatar"
                  />
                  <span className={`status-badge ${patient.status}`}>
                    {patient.status}
                  </span>
                </div>
                <h3 className="patient-card-name">{patient.name}</h3>
                <p className="patient-card-info">
                  <strong>Age:</strong> {patient.age} years
                </p>
                <p className="patient-card-info">
                  <strong>Department:</strong> {patient.department}
                </p>
                <p className="patient-card-info">
                  <strong>Phone:</strong> {patient.phone}
                </p>
                <div className="patient-card-actions">
                  <button 
                    className="btn btn-small btn-primary"
                    onClick={() => handleViewPatient(patient)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-small btn-outline"
                    onClick={() => handleEditPatient(patient)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="patients-table card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.department}</td>
                    <td>
                      <span className={`badge badge-${patient.status}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>{patient.lastVisit}</td>
                    <td>
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => handleEditPatient(patient)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger" 
                        style={{ marginLeft: '4px' }}
                        onClick={() => handleDeletePatient(patient)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Patients;
