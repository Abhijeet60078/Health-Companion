import bcrypt from 'bcryptjs';

// Store data in memory (in production, use MongoDB)
export const db = {
  chatHistories: new Map(),
  reports: new Map(),
  users: new Map(),
  appointments: new Map(),
  patients: new Map(),
  doctors: new Map(),
  employees: new Map(),
  waitingList: new Map()
};

export const initializeSampleData = () => {
  // Sample doctors
  db.doctors.set('1', {
    id: '1',
    name: 'Jane Cooper',
    specialty: 'General',
    rating: 4.8,
    experience: '8 years',
    phone: '+1 (555) 123-4567',
    email: 'jane.cooper@health.com',
    status: 'available',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Cooper&background=1abc9c&color=fff'
  });
  db.doctors.set('2', {
    id: '2',
    name: 'Wade Warren',
    specialty: 'Cardiology',
    rating: 4.9,
    experience: '10 years',
    phone: '+1 (555) 234-5678',
    email: 'wade.warren@health.com',
    status: 'busy',
    avatar: 'https://ui-avatars.com/api/?name=Wade+Warren&background=3498db&color=fff'
  });
  db.doctors.set('3', {
    id: '3',
    name: 'Robert Fox',
    specialty: 'Orthopedics',
    rating: 4.7,
    experience: '12 years',
    phone: '+1 (555) 345-6789',
    email: 'robert.fox@health.com',
    status: 'available',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Fox&background=9b59b6&color=fff'
  });
  db.doctors.set('4', {
    id: '4',
    name: 'Albert Flores',
    specialty: 'Neurology',
    rating: 4.6,
    experience: '9 years',
    phone: '+1 (555) 456-7890',
    email: 'albert.flores@health.com',
    status: 'offline',
    avatar: 'https://ui-avatars.com/api/?name=Albert+Flores&background=e74c3c&color=fff'
  });

  // Sample patients
  db.patients.set('1', {
    id: '1',
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    phone: '+1 (555) 123-4567',
    email: 'sarah.j@email.com',
    dob: '1990-05-15',
    status: 'active',
    condition: 'Hypertension',
    lastVisit: '2026-03-20'
  });
  db.patients.set('2', {
    id: '2',
    name: 'Michael Brown',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    email: 'mchen@email.com',
    dob: '1981-08-22',
    status: 'active',
    condition: 'Cardiac Condition',
    lastVisit: '2026-03-15'
  });
  db.patients.set('3', {
    id: '3',
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    phone: '+1 (555) 345-6789',
    email: 'emma.d@email.com',
    dob: '1998-03-10',
    status: 'active',
    condition: 'Fracture - Recovery',
    lastVisit: '2026-04-01'
  });

  // Sample appointments
  db.appointments.set('1', {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Jane Cooper',
    date: '2026-04-15',
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'General Checkup',
    createdAt: new Date().toISOString()
  });
  db.appointments.set('2', {
    id: '2',
    patientId: '2',
    patientName: 'Michael Brown',
    doctorId: '2',
    doctorName: 'Wade Warren',
    date: '2026-04-15',
    time: '02:00 PM',
    status: 'scheduled',
    reason: 'Cardiac Assessment',
    createdAt: new Date().toISOString()
  });

  // Sample employees
  db.employees.set('1', {
    id: '1',
    name: 'Lisa Anderson',
    position: 'Nurse Manager',
    department: 'General Ward',
    phone: '+1 (555) 111-2222',
    email: 'lisa.anderson@health.com',
    joinDate: '2020-01-15',
    status: 'active'
  });
  db.employees.set('2', {
    id: '2',
    name: 'John Smith',
    position: 'Lab Technician',
    department: 'Laboratory',
    phone: '+1 (555) 222-3333',
    email: 'john.smith@health.com',
    joinDate: '2021-06-20',
    status: 'active'
  });

  // Sample users with hashed passwords
  const salt = bcrypt.genSaltSync(10);
  db.users.set('1', {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@health.com',
    password: bcrypt.hashSync('admin123', salt),
    role: 'admin',
    phone: '+1 (555) 999-9999',
    department: 'Administration',
    createdAt: new Date()
  });

  db.users.set('2', {
    id: '2',
    firstName: 'John',
    lastName: 'Patient',
    email: 'patient@health.com',
    password: bcrypt.hashSync('patient123', salt),
    role: 'user',
    phone: '+1 (555) 123-1234',
    department: 'Patient',
    createdAt: new Date()
  });
};
