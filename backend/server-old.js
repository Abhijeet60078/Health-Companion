import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'health-companion-secret-key-2024';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  }
});

// Store data in memory (in production, use MongoDB)
const chatHistories = new Map();
const reports = new Map();
const users = new Map();
const appointments = new Map();
const patients = new Map();
const doctors = new Map();
const employees = new Map();
const waitingList = new Map();

// ==================== Authentication Middleware ====================
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Initialize sample data
const initializeSampleData = () => {
  // Sample doctors
  doctors.set('1', {
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
  doctors.set('2', {
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
  doctors.set('3', {
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
  doctors.set('4', {
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
  patients.set('1', {
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
  patients.set('2', {
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
  patients.set('3', {
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
  appointments.set('1', {
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
  appointments.set('2', {
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
  employees.set('1', {
    id: '1',
    name: 'Lisa Anderson',
    position: 'Nurse Manager',
    department: 'General Ward',
    phone: '+1 (555) 111-2222',
    email: 'lisa.anderson@health.com',
    joinDate: '2020-01-15',
    status: 'active'
  });
  employees.set('2', {
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
  users.set('1', {
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

  users.set('2', {
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

// Initialize sample data on startup
initializeSampleData();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== Authentication Endpoints ====================
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Simple authentication (in production, use proper hashing and database)
    const user = {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email,
      role: 'admin',
      phone: '+1 (555) 999-9999',
      department: 'Administration'
    };

    const token = Buffer.from(JSON.stringify(user)).toString('base64');
    
    res.json({
      success: true,
      user,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      role: 'user',
      phone: '+1 (555) 000-0000',
      department: 'Patient'
    };

    const token = Buffer.from(JSON.stringify(user)).toString('base64');
    
    res.json({
      success: true,
      user,
      token,
      message: 'Signup successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Appointments Endpoints ====================
app.get('/api/appointments', (req, res) => {
  try {
    const allAppointments = Array.from(appointments.values());
    res.json(allAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', (req, res) => {
  try {
    const { patientName, doctorName, date, time, reason } = req.body;
    
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = Date.now().toString();
    const appointment = {
      id,
      patientName,
      doctorName,
      date,
      time,
      reason,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    appointments.set(id, appointment);
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments/:id', (req, res) => {
  try {
    const appointment = appointments.get(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/appointments/:id', (req, res) => {
  try {
    const appointment = appointments.get(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updated = { ...appointment, ...req.body };
    appointments.set(req.params.id, updated);
    res.json({ success: true, appointment: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  try {
    appointments.delete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Patients Endpoints ====================
app.get('/api/patients', (req, res) => {
  try {
    const allPatients = Array.from(patients.values());
    res.json(allPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', (req, res) => {
  try {
    const { name, age, gender, phone, email, dob, condition } = req.body;
    
    const id = Date.now().toString();
    const patient = {
      id,
      name,
      age,
      gender,
      phone,
      email,
      dob,
      condition,
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    patients.set(id, patient);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id', (req, res) => {
  try {
    const patient = patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updated = { ...patient, ...req.body };
    patients.set(req.params.id, updated);
    res.json({ success: true, patient: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Doctors Endpoints ====================
app.get('/api/doctors', (req, res) => {
  try {
    const allDoctors = Array.from(doctors.values());
    res.json(allDoctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors/:id', (req, res) => {
  try {
    const doctor = doctors.get(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Employees Endpoints ====================
app.get('/api/employees', (req, res) => {
  try {
    const allEmployees = Array.from(employees.values());
    res.json(allEmployees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Waiting List Endpoints ====================
app.get('/api/waiting-list', (req, res) => {
  try {
    const allWaiting = Array.from(waitingList.values());
    res.json(allWaiting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/waiting-list', (req, res) => {
  try {
    const { patientName, doctorName, reason, priority } = req.body;
    
    const id = Date.now().toString();
    const request = {
      id,
      patientName,
      doctorName,
      reason,
      priority: priority || 'medium',
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      approvedDate: null
    };

    waitingList.set(id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/waiting-list/:id/approve', (req, res) => {
  try {
    const request = waitingList.get(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'approved';
    request.approvedDate = new Date().toISOString().split('T')[0];
    waitingList.set(req.params.id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/waiting-list/:id/reject', (req, res) => {
  try {
    const request = waitingList.get(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    waitingList.set(req.params.id, request);
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Reminders Endpoints ====================
app.post('/api/send-reminder', (req, res) => {
  try {
    const { appointmentIds, deliveryMethod, message } = req.body;
    
    // In production, integrate with email/SMS service
    res.json({
      success: true,
      message: `Reminders sent via ${deliveryMethod} to ${appointmentIds.length} recipients`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Export Endpoints ====================
app.post('/api/export', (req, res) => {
  try {
    const { dataType, format, dateRange } = req.body;
    
    let data = [];
    if (dataType === 'appointments') {
      data = Array.from(appointments.values());
    } else if (dataType === 'patients') {
      data = Array.from(patients.values());
    } else if (dataType === 'doctors') {
      data = Array.from(doctors.values());
    } else if (dataType === 'employees') {
      data = Array.from(employees.values());
    }

    // Generate CSV
    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => row[h]).join(','))
      ].join('\n');

      res.json({
        success: true,
        format: 'csv',
        data: csv,
        fileName: `${dataType}_${new Date().toISOString().split('T')[0]}.csv`
      });
    } else {
      res.json({
        success: true,
        format,
        data,
        fileName: `${dataType}_${new Date().toISOString().split('T')[0]}.${format}`
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload and analyze medical report
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let analysisText = '';

    // Read file based on type
    if (req.file.mimetype === 'application/pdf') {
      const pdfBuffer = await fs.readFile(filePath);
      const base64Pdf = pdfBuffer.toString('base64');
      
      const pdfPart = {
        inlineData: {
          data: base64Pdf,
          mimeType: 'application/pdf'
        }
      };

      const prompt = {
        text: `You are a medical report analysis AI assistant. Analyze this medical report PDF and provide:

1. **Report Type**: Identify what type of medical report this is
2. **Key Findings**: List the main test results and their values
3. **Normal Ranges**: For each result, indicate if it's within normal range
4. **Health Insights**: Provide brief explanations of what the results mean
5. **Recommendations**: Suggest any lifestyle changes or follow-ups if needed

Format your response in a clear, structured markdown format. Be informative but reassuring.`
      };

      const result = await model.generateContent([pdfPart, prompt]);
      const response = await result.response;
      analysisText = response.text();
    } else {
      // For images
      const imageBuffer = await fs.readFile(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype
        }
      };

      const prompt = {
        text: `You are a medical report analysis AI assistant. Analyze this medical report image and provide:

1. **Report Type**: Identify what type of medical report this is
2. **Key Findings**: List the main test results and their values
3. **Normal Ranges**: For each result, indicate if it's within normal range
4. **Health Insights**: Provide brief explanations of what the results mean
5. **Recommendations**: Suggest any lifestyle changes or follow-ups if needed

Format your response in a clear, structured markdown format. Be informative but reassuring.`
      };

      const result = await model.generateContent([imagePart, prompt]);
      const response = await result.response;
      analysisText = response.text();
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    // Store report
    const reportId = Date.now().toString();
    reports.set(reportId, {
      id: reportId,
      fileName: req.file.originalname,
      analysis: analysisText,
      uploadedAt: new Date().toISOString(),
      fileType: req.file.mimetype
    });

    res.json({
      success: true,
      reportId,
      fileName: req.file.originalname,
      analysis: analysisText,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze report',
      message: error.message 
    });
  }
});

// Get all reports
app.get('/api/reports', (req, res) => {
  const allReports = Array.from(reports.values()).map(report => ({
    id: report.id,
    fileName: report.fileName,
    uploadedAt: report.uploadedAt,
    fileType: report.fileType
  }));
  res.json(allReports);
});

// Get specific report
app.get('/api/reports/:id', (req, res) => {
  const report = reports.get(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// Chat with AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const id = sessionId || Date.now().toString();

    // Get or create chat history
    const history = chatHistories.get(id) || [];

    // Create prompt with context
    const contextPrompt = `You are a helpful AI health assistant for HealthAI app. You provide informative, accurate health information while being empathetic and supportive. 

Key guidelines:
- Always remind users to consult healthcare professionals for medical advice
- Provide clear, easy-to-understand explanations
- Be encouraging and supportive
- If discussing test results, explain what they mean in simple terms
- Suggest healthy lifestyle habits when appropriate

Previous conversation:
${history.slice(-5).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

User: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const assistantMessage = response.text();

    // Update history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: assistantMessage });
    chatHistories.set(id, history);

    res.json({
      message: assistantMessage,
      sessionId: id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat',
      message: error.message 
    });
  }
});

// Get chat history
app.get('/api/chat/:sessionId', (req, res) => {
  const history = chatHistories.get(req.params.sessionId) || [];
  res.json(history);
});

// Clear chat history
app.delete('/api/chat/:sessionId', (req, res) => {
  chatHistories.delete(req.params.sessionId);
  res.json({ success: true, message: 'Chat history cleared' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ==================== User Profile Endpoints ====================
app.get('/api/user/profile', (req, res) => {
  try {
    // In production, get from JWT token
    const user = {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@health.com',
      phone: '+1 (555) 999-9999',
      department: 'Administration',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1abc9c&color=fff'
    };
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/profile', (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = {
      id: '1',
      firstName: firstName || 'Admin',
      lastName: lastName || 'User',
      email: email || 'admin@health.com',
      phone: phone || '+1 (555) 999-9999',
      department: 'Administration'
    };
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Health Companion Backend running on port ${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   AUTH:`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/signup`);
  console.log(`   APPOINTMENTS:`);
  console.log(`   - GET  /api/appointments`);
  console.log(`   - POST /api/appointments`);
  console.log(`   - GET  /api/appointments/:id`);
  console.log(`   - PUT  /api/appointments/:id`);
  console.log(`   - DELETE /api/appointments/:id`);
  console.log(`   PATIENTS:`);
  console.log(`   - GET  /api/patients`);
  console.log(`   - POST /api/patients`);
  console.log(`   - GET  /api/patients/:id`);
  console.log(`   - PUT  /api/patients/:id`);
  console.log(`   DOCTORS:`);
  console.log(`   - GET  /api/doctors`);
  console.log(`   - GET  /api/doctors/:id`);
  console.log(`   EMPLOYEES:`);
  console.log(`   - GET  /api/employees`);
  console.log(`   UTILITIES:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/waiting-list`);
  console.log(`   - POST /api/send-reminder`);
  console.log(`   - POST /api/export`);
  console.log(`   - GET  /api/user/profile`);
  console.log(`   - PUT  /api/user/profile`);
  console.log(`   REPORTS & CHAT:`);
  console.log(`   - POST /api/upload`);
  console.log(`   - GET  /api/reports`);
  console.log(`   - GET  /api/reports/:id`);
  console.log(`   - POST /api/chat`);
  console.log(`   - GET  /api/chat/:sessionId`);
});