import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Employee.css';

const Employee = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      position: 'Nurse Manager',
      department: 'General Ward',
      phone: '(555) 111-2222',
      email: 'john.smith@hospital.com',
      joinDate: '2020-03-15',
      status: 'active',
      image: 'https://ui-avatars.com/api/?name=John+Smith'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      position: 'Lab Technician',
      department: 'Laboratory',
      phone: '(555) 222-3333',
      email: 'maria.garcia@hospital.com',
      joinDate: '2019-07-22',
      status: 'active',
      image: 'https://ui-avatars.com/api/?name=Maria+Garcia'
    },
    {
      id: 3,
      name: 'David Lee',
      position: 'Receptionist',
      department: 'Front Desk',
      phone: '(555) 333-4444',
      email: 'david.lee@hospital.com',
      joinDate: '2021-01-10',
      status: 'active',
      image: 'https://ui-avatars.com/api/?name=David+Lee'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      position: 'Security Officer',
      department: 'Security',
      phone: '(555) 444-5555',
      email: 'sarah.johnson@hospital.com',
      joinDate: '2018-11-05',
      status: 'on-leave',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson'
    }
  ]);

  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleViewEmployee = (employee) => {
    alert(`Employee Details:\n\nName: ${employee.name}\nPosition: ${employee.position}\nDepartment: ${employee.department}\nPhone: ${employee.phone}\nEmail: ${employee.email}\nJoin Date: ${new Date(employee.joinDate).toLocaleDateString()}\nStatus: ${employee.status}`);
  };

  const handleEditEmployee = (employee) => {
    const newPosition = prompt('Enter position:', employee.position);
    const newPhone = prompt('Enter phone:', employee.phone);
    
    if (newPosition && newPhone) {
      const updated = { ...employee, position: newPosition, phone: newPhone };
      setEmployees(employees.map(e => e.id === employee.id ? updated : e));
      alert('Employee updated successfully!');
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on-leave').length
  };

  const departments = ['all', ...new Set(employees.map(e => e.department))];
  
  const filteredEmployees = employees.filter(e => {
    const deptMatch = filterDepartment === 'all' || e.department === filterDepartment;
    const statusMatch = filterStatus === 'all' || e.status === filterStatus;
    return deptMatch && statusMatch;
  });

  return (
    <Layout showRightSidebar={true} rightSidebarStats={stats}>
      <div className="page-header">
        <h1>Employee</h1>
      </div>

      <div className="page-content">
        <div className="filters">
          <select 
            className="filter-select"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>

        <div className="employees-table card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-cell">
                      <img src={employee.image} alt={employee.name} className="employee-avatar" />
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>
                    <a href={`tel:${employee.phone}`}>{employee.phone}</a>
                  </td>
                  <td>
                    <span className={`badge badge-${employee.status}`}>
                      {employee.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => handleEditEmployee(employee)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-small btn-outline" 
                      style={{ marginLeft: '4px' }}
                      onClick={() => handleViewEmployee(employee)}
                      disabled={loading}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Employee;
