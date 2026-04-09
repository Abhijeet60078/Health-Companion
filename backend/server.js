import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import waitingListRoutes from './routes/waitingListRoutes.js';
import utilityRoutes from './routes/utilityRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import config and data
import { config } from './config/index.js';
import { initializeSampleData } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration for frontend
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize sample data
initializeSampleData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/waiting-list', waitingListRoutes);
app.use('/api', utilityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Health Companion Backend running on port ${config.PORT}`);
  console.log(`📊 API endpoints organized by module:`);
  console.log(`   /api/auth - Authentication`);
  console.log(`   /api/appointments - Appointment management`);
  console.log(`   /api/patients - Patient management`);
  console.log(`   /api/doctors - Doctor directory`);
  console.log(`   /api/employees - Staff management`);
  console.log(`   /api/waiting-list - Appointment requests`);
  console.log(`   /api/reports - Medical reports`);
  console.log(`   /api/chat - AI assistant`);
  console.log(`   /api/user - User profile`);
  console.log(`   /api/send-reminder - Send reminders`);
  console.log(`   /api/export - Export data`);
  console.log(`   /api/health - Health check`);
});
