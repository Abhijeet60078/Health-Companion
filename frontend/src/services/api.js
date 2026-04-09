// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const api = {
  // Authentication endpoints
  auth: {
    login: (email, password) => 
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password })
      }).then(res => res.json()),
    
    signup: (firstName, lastName, email, password) =>
      fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ firstName, lastName, email, password })
      }).then(res => res.json()),
    
    logout: () => Promise.resolve({ success: true })
  },

  // Appointments endpoints
  appointments: {
    getAll: () =>
      fetch(`${API_URL}/appointments`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    getById: (id) =>
      fetch(`${API_URL}/appointments/${id}`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    create: (appointmentData) =>
      fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(appointmentData)
      }).then(res => res.json()),
    
    update: (id, appointmentData) =>
      fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(appointmentData)
      }).then(res => res.json()),
    
    delete: (id) =>
      fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Patients endpoints
  patients: {
    getAll: () =>
      fetch(`${API_URL}/patients`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    getById: (id) =>
      fetch(`${API_URL}/patients/${id}`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    create: (patientData) =>
      fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(patientData)
      }).then(res => res.json()),
    
    update: (id, patientData) =>
      fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(patientData)
      }).then(res => res.json()),
    
    delete: (id) =>
      fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Doctors endpoints
  doctors: {
    getAll: () =>
      fetch(`${API_URL}/doctors`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    getById: (id) =>
      fetch(`${API_URL}/doctors/${id}`, {
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Employees endpoints
  employees: {
    getAll: () =>
      fetch(`${API_URL}/employees`, {
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Waiting List endpoints
  waitingList: {
    getAll: () =>
      fetch(`${API_URL}/waiting-list`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    create: (requestData) =>
      fetch(`${API_URL}/waiting-list`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      }).then(res => res.json()),
    
    approve: (id) =>
      fetch(`${API_URL}/waiting-list/${id}/approve`, {
        method: 'PUT',
        headers: getHeaders()
      }).then(res => res.json()),
    
    reject: (id) =>
      fetch(`${API_URL}/waiting-list/${id}/reject`, {
        method: 'PUT',
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Reminders endpoints
  reminders: {
    send: (reminderData) =>
      fetch(`${API_URL}/send-reminder`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reminderData)
      }).then(res => res.json())
  },

  // Export endpoints
  export: {
    run: (exportData) =>
      fetch(`${API_URL}/export`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(exportData)
      }).then(res => res.json())
  },

  // User Profile endpoints
  user: {
    getProfile: () =>
      fetch(`${API_URL}/user/profile`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    updateProfile: (userData) =>
      fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      }).then(res => res.json())
  },

  // Reports endpoints
  reports: {
    getAll: () =>
      fetch(`${API_URL}/reports`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    getById: (id) =>
      fetch(`${API_URL}/reports/${id}`, {
        headers: getHeaders()
      }).then(res => res.json()),
    
    upload: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      }).then(res => res.json());
    }
  },

  // Chat endpoints
  chat: {
    send: (message, sessionId) =>
      fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, sessionId })
      }).then(res => res.json()),
    
    getHistory: (sessionId) =>
      fetch(`${API_URL}/chat/${sessionId}`, {
        headers: getHeaders()
      }).then(res => res.json())
  },

  // Health check
  health: () =>
    fetch(`${API_URL}/health`)
      .then(res => res.json())
};

export default api;
