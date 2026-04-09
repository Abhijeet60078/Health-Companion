import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Doctors.css';

const Doctors = () => {
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Jane Cooper',
      specialty: 'General Medicine',
      phone: '(555) 123-4567',
      email: 'jane.cooper@hospital.com',
      experience: '12 years',
      status: 'available',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Wade Warren',
      specialty: 'Cardiology',
      phone: '(555) 234-5678',
      email: 'wade.warren@hospital.com',
      experience: '15 years',
      status: 'available',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Dr. Robert Fox',
      specialty: 'Orthopedics',
      phone: '(555) 345-6789',
      email: 'robert.fox@hospital.com',
      experience: '10 years',
      status: 'busy',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Dr. Albert Flores',
      specialty: 'Neurology',
      phone: '(555) 456-7890',
      email: 'albert.flores@hospital.com',
      experience: '18 years',
      status: 'available',
      rating: 4.9
    }
  ]);

  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleViewProfile = (doctor) => {
    alert(`Doctor Profile:\n\nName: Dr. ${doctor.name}\nSpecialty: ${doctor.specialty}\nExperience: ${doctor.experience}\nRating: ${doctor.rating}/5\nPhone: ${doctor.phone}\nEmail: ${doctor.email}`);
  };

  const handleScheduleAppointment = (doctor) => {
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    const time = prompt('Enter appointment time (HH:MM AM/PM):');
    const reason = prompt('Enter reason for visit:');
    
    if (date && time && reason) {
      api.appointments.create({
        doctorName: doctor.name,
        date,
        time,
        reason,
        patientName: 'Current Patient'
      }).then(response => {
        if (response.success) {
          alert(`Appointment scheduled successfully with Dr. ${doctor.name} on ${date} at ${time}`);
        }
      }).catch(err => alert('Failed to schedule appointment'));
    }
  };

  const stats = {
    total: doctors.length,
    available: doctors.filter(d => d.status === 'available').length,
    busy: doctors.filter(d => d.status === 'busy').length
  };

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];
  
  const filteredDoctors = filterSpecialty === 'all' 
    ? doctors 
    : doctors.filter(d => d.specialty === filterSpecialty);

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <h1>Doctors</h1>
      </div>

      <div className="page-content">
        <div className="filters">
          <select 
            className="filter-select"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card card">
              <div className="doctor-card-header">
                <img 
                  src={`https://ui-avatars.com/api/?name=${doctor.name}&background=${doctor.status === 'available' ? '1abc9c' : 'f39c12'}`} 
                  alt={doctor.name}
                  className="doctor-avatar"
                />
                <span className={`status-badge ${doctor.status}`}>
                  {doctor.status}
                </span>
              </div>

              <h3 className="doctor-name">{doctor.name}</h3>
              
              <div className="doctor-rating">
                <i className="fas fa-star"></i>
                <span>{doctor.rating}</span>
              </div>

              <p className="doctor-specialty">{doctor.specialty}</p>

              <div className="doctor-info">
                <p>
                  <i className="fas fa-briefcase"></i>
                  <strong>{doctor.experience}</strong> experience
                </p>
                <p>
                  <i className="fas fa-phone"></i>
                  <a href={`tel:${doctor.phone}`}>{doctor.phone}</a>
                </p>
                <p>
                  <i className="fas fa-envelope"></i>
                  <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                </p>
              </div>

              <div className="doctor-actions">
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => handleViewProfile(doctor)}
                  disabled={loading}
                >
                  View Profile
                </button>
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => handleScheduleAppointment(doctor)}
                  disabled={loading}
                >
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;
