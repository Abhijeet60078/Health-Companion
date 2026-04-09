# ⚡ Quick Start Guide - Health Companion MERN

## 🎯 Start Both Servers in 3 Steps

### Step 1: Terminal 1 - Start Backend (Port 3001)

```bash
cd backend
npm start
```

✅ **Expected Output:**
```
🚀 Health Companion Backend running on port 3001
📊 API organized by module including auth, appointments, patients...
```

### Step 2: Terminal 2 - Start Frontend (Port 3002)

```bash
cd frontend
npm start
```

✅ **Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3002
```

### Step 3: Open Browser

Navigate to: **http://localhost:3002**

---

## 🔐 Login with Sample Credentials

**Option 1: Admin Account**
- Email: `admin@health.com`
- Password: `admin123`

**Option 2: Patient Account**
- Email: `patient@health.com`
- Password: `patient123`

---

## ✅ Verify Integration is Working

### Check 1: Login Successfully
1. Go to http://localhost:3002
2. Click "Sign In" button (if on dashboard, click Profile → Logout first)
3. Enter credentials above
4. **Should redirect to Dashboard immediately**

### Check 2: View Network Communication
1. Press `F12` to open DevTools
2. Click "Network" tab
3. Perform an action (e.g., create appointment)
4. **Should see API requests to http://localhost:3001/api**

### Check 3: Token Persistence
1. Press `F12` to open DevTools
2. Click "Application" tab
3. Click "localStorage" in left menu
4. **Should see `token` and `user` entries** (non-empty values)

### Check 4: View All Available API Endpoints
```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "message": "Server is running"
}
```

---

## 📝 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| **AUTH** | | |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| **APPOINTMENTS** | | |
| GET | `/api/appointments` | List all appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| **PATIENTS** | | |
| GET | `/api/patients` | List all patients |
| POST | `/api/patients` | Add new patient |
| PUT | `/api/patients/:id` | Update patient |
| **DOCTORS** | | |
| GET | `/api/doctors` | List all doctors |
| **EMPLOYEES** | | |
| GET | `/api/employees` | List all employees |
| **USER PROFILE** | | |
| GET/PUT | `/api/user/profile` | Get/update user profile |
| **UTILITIES** | | |
| GET | `/api/health` | Health check |
| POST | `/api/chat` | AI chat (medical advice) |
| POST | `/api/reports/upload` | Upload & analyze medical report |

---

## 🔧 Configuration Files

### Backend `.env`
```
PORT=3001
JWT_SECRET=health-companion-secret-key-2024
GEMINI_API_KEY=your-gemini-api-key-here
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/health-companion
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

---

## 🎯 The Application Flow

```
1. User opens http://localhost:3002 (React Frontend)
   ↓
2. Frontend shows Login page
   ↓
3. User enters email & password → Clicks "Sign In"
   ↓
4. Frontend sends POST to http://localhost:3001/api/auth/login
   ↓
5. Backend validates credentials & returns JWT token
   ↓
6. Frontend stores token in localStorage
   ↓
7. Frontend redirects to Dashboard
   ↓
8. All future API calls include Authorization: Bearer {token} header
   ↓
9. Backend validates token and processes request
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to localhost:3001"
- ✅ Backend not running? Start it in Terminal 1
- ✅ Wrong port? Check that Port 3001 is not blocked
- ✅ Try: `netstat -ano | findstr :3001` (Windows)

### Issue: Login fails with "Invalid credentials"
- ✅ Check credentials: `admin@health.com` / `admin123`
- ✅ Verify backend is running and accessible
- ✅ Check Network tab: should see POST to `/api/auth/login` with status 200

### Issue: "CORS error" in browser console
- ✅ Backend CORS is configured for localhost:3002
- ✅ Restart both servers if still seeing error
- ✅ Check Network tab - request should have status 200 with CORS headers

### Issue: Token not appearing in localStorage
- ✅ Login must be successful first
- ✅ DevTools Application tab → localStorage should show entries
- ✅ Refresh page - token may appear after reload

### Issue: Frontend shows "Cannot GET /"
- ✅ Make sure you're accessing http://localhost:3002 (not 3001)
- ✅ Frontend server must be running
- ✅ Check for errors in Terminal 2

---

## 📊 Project Features

✅ **Authentication**
- JWT token-based security
- Password hashing with bcryptjs
- Login/Signup with real credentials

✅ **Appointment Management**
- View all appointments
- Schedule new appointments
- Edit existing appointments
- Cancel appointments

✅ **Patient Management**
- View patient list
- Add new patients
- Edit patient information
- Track patient history

✅ **Doctor Directory**
- View all available doctors
- Schedule appointments with doctors
- Doctor specializations

✅ **AI Chat Assistant**
- Chat with AI about medical queries
- Report analysis (powered by Gemini)

✅ **User Profile**
- View/update user information
- Change password
- Manage profile settings

---

## 🚀 Next Steps After Testing

1. ✅ Verify both servers are communicating
2. ✅ Test login with sample credentials
3. ✅ Create an appointment
4. ✅ View patients list
5. ✅ Try different features

---

## 📚 Full Documentation

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed API documentation and advanced setup.

---

## 💡 Quick Commands Reference

```bash
# Start Backend
cd backend && npm start

# Start Frontend (different terminal)
cd frontend && npm start

# Test Backend Health
curl http://localhost:3001/api/health

# View Backend Logs
# Check Terminal 1 where backend is running

# Stop Servers
# Terminal 1: Ctrl + C (Backend)
# Terminal 2: Ctrl + C (Frontend)
```

---

## ✨ You're Ready!

Both servers are now integrated and communicating. The frontend on port 3002 is connected to the backend on port 3001 with proper JWT authentication.

**Start here:** http://localhost:3002 → Login → Explore features!
