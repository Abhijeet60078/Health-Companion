# Health Companion - Backend & Frontend Integration Guide

## 🚀 Project Structure

```
Health-Companion/
├── backend/          (Node.js + Express) - Port 3001
│   ├── config/       (Database, configuration)
│   ├── controllers/  (Business logic)
│   ├── middleware/   (Authentication, validation)
│   ├── routes/       (API endpoints)
│   ├── server.js     (Main server file)
│   ├── package.json
│   └── .env          (Environment variables)
│
└── frontend/         (React 18) - Port 3002
    ├── src/
    │   ├── components/ (UI components)
    │   ├── pages/      (Page components)
    │   ├── services/   (API layer)
    │   ├── context/    (State management)
    │   └── App.js
    ├── package.json
    └── .env          (Environment variables)
```

## 🔧 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   PORT=3001
   JWT_SECRET=health-companion-secret-key-2024
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/health-companion
   ```

4. **Start backend server:**
   ```bash
   npm start
   ```
   
   Expected output:
   ```
   🚀 Health Companion Backend running on port 3001
   📊 API endpoints organized by module:
      /api/auth - Authentication
      /api/appointments - Appointment management
      /api/patients - Patient management
      ...
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=development
   ```

4. **Start frontend server:**
   ```bash
   npm start
   ```
   
   Expected output:
   ```
   Compiled successfully!
   
   You can now view frontend in the browser.
   Local:            http://localhost:3002
   On Your Network:  http://[IP]:3002
   ```

## 🔌 API Integration

### Base URL
- **Development:** `http://localhost:3001/api`
- **Production:** Update in frontend `.env` file

### Authentication Flow

1. **User Login/Signup**
   ```
   Frontend → POST /api/auth/login → Backend
   Backend → Returns { success, user, token }
   Frontend → Stores token in localStorage
   Frontend → All subsequent requests include Bearer token
   ```

2. **Protected Routes**
   - Backend validates JWT token in `Authorization` header
   - Frontend includes token in all API requests via `api.getHeaders()`

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user

#### Appointments
- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

#### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get single patient
- `PUT /api/patients/:id` - Update patient

#### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get single doctor

#### Employees
- `GET /api/employees` - List all employees

#### Utilities
- `GET /api/health` - Health check
- `POST /api/send-reminder` - Send appointment reminders
- `POST /api/export` - Export data to CSV/JSON
- `GET/PUT /api/user/profile` - User profile management

#### Reports & Chat
- `POST /api/reports/upload` - Upload and analyze medical report
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get specific report
- `POST /api/chat` - Send chat message to AI
- `GET /api/chat/:sessionId` - Get chat history

## ✅ Testing the Integration

### Test 1: Health Check
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "ok",
  "message": "Server is running"
}
```

### Test 2: Login with Sample Credentials
Frontend Login Page: http://localhost:3002/login

**Sample Credentials:**
- Email: `admin@health.com` | Password: `admin123`
- Email: `patient@health.com` | Password: `patient123`

### Test 3: Create Appointment
1. Login to frontend
2. Navigate to Dashboard
3. Click "Schedule New" button
4. Fill in appointment details
5. Submit → Should create via API and show confirmation

### Test 4: View API Response
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Make API request (e.g., create appointment)
4. Click request in Network tab
5. Check "Response" to see server response

## 🔐 Security Features Implemented

- ✅ JWT authentication on protected routes
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled for frontend communication
- ✅ Authorization headers validation
- ✅ Error handling and validation

## 📝 Sample API Request

### Login Request
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@health.com","password":"admin123"}'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@health.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### Authenticated Request
```bash
curl -X GET http://localhost:3001/api/appointments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🐛 Troubleshooting

### Frontend can't reach backend
- ✓ Ensure backend is running on port 3001
- ✓ Check CORS configuration in backend
- ✓ Verify `.env` file has correct API_URL
- ✓ Check browser console for network errors

### Login fails
- ✓ Check credentials (admin@health.com / admin123)
- ✓ Verify backend is running
- ✓ Check if token is stored in localStorage
- ✓ Look at browser DevTools Network tab for errors

### Appointments not loading
- ✓ Ensure user is logged in (token exists)
- ✓ Check if backend has sample data initialized
- ✓ Verify API endpoint exists: GET /api/appointments
- ✓ Check Authorization header in Network tab

## 📦 Both Servers Running

Terminal 1 (Backend):
```bash
cd backend
npm start
# Port 3001
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
# Port 3002
```

Access the application at: **http://localhost:3002**

## 🎯 Default Sample Data

**Sample Users:**
- Admin: admin@health.com / admin123
- Patient: patient@health.com / patient123

**Sample Doctors:**
1. Jane Cooper (General) - 4.8 ⭐
2. Wade Warren (Cardiology) - 4.9 ⭐
3. Robert Fox (Orthopedics) - 4.7 ⭐
4. Albert Flores (Neurology) - 4.6 ⭐

**Sample Patients:**
1. Sarah Johnson (Hypertension)
2. Michael Brown (Cardiac Condition)
3. Emily Davis (Fracture - Recovery)

## 🚀 Next Steps

1. **Database Integration** - Replace in-memory data with MongoDB
2. **Real Authentication** - Deploy with proper secrets management
3. **Email/SMS Service** - Integrate Twilio for reminders
4. **Production Deployment** - Deploy to cloud platform (Heroku, AWS, etc.)
5. **Testing** - Add unit and integration tests
