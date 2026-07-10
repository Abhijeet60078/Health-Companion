# 🏥 Health Companion – MERN Healthcare Management System

## Overview

Health Companion is a full-stack healthcare management application built using the MERN stack. The platform helps hospitals, clinics, doctors, and patients manage appointments, medical records, healthcare staff, and patient information through a single web application.

The application also integrates Google Gemini AI to assist users in understanding medical reports and answering general healthcare-related questions. It is designed as a healthcare support tool and does not replace professional medical advice.

---

# Features

### User Authentication

* Secure user registration and login
* JWT-based authentication
* Password encryption using bcryptjs
* Protected routes and authorization

### Dashboard

* Healthcare statistics
* Appointment summary
* Quick access to frequently used modules

### Appointment Management

* Schedule appointments
* Update appointment details
* Cancel appointments
* View upcoming appointments

### Patient Management

* Add new patients
* Update patient information
* View patient records
* Manage patient history

### Doctor Management

* View doctor profiles
* Browse specializations
* Manage doctor schedules

### Medical Report Analysis

* Upload medical reports
* AI-assisted report explanation
* Download analyzed reports

### AI Health Assistant

* Chat-based healthcare assistance
* Medical information powered by Google Gemini
* Basic guidance for common health-related queries

### Profile & Settings

* User profile management
* Account settings
* Secure logout

---

# Technology Stack

## Frontend

* React.js
* React Router
* Context API
* CSS
* Fetch API

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Multer
* Google Gemini API

## Database

* MongoDB (Production Ready)
* In-memory storage used for development

---

# Project Structure

```
Health-Companion
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── server.js
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── App.js
│   ├── public
│   └── .env
│
├── README.md
├── QUICK_START.md
└── INTEGRATION_GUIDE.md
```

---

# Installation

## Backend

```bash
cd backend
npm install
npm start
```

Runs on:

```
http://localhost:3001
```

---

## Frontend

```bash
cd frontend
npm install
npm start
```

Runs on:

```
http://localhost:3002
```

---

# Environment Variables

## Backend (.env)

```
PORT=3001
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
MONGODB_URI=mongodb://localhost:27017/health-companion
```

## Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3001/api
```

---

# Authentication

Sample credentials for testing:

| Role    | Email                                           | Password   |
| ------- | ----------------------------------------------- | ---------- |
| Admin   | [admin@health.com](mailto:admin@health.com)     | admin123   |
| Patient | [patient@health.com](mailto:patient@health.com) | patient123 |

---

# API Modules

* Authentication
* Appointments
* Patients
* Doctors
* Medical Reports
* AI Chat
* Employee Management
* Waiting List
* User Profile

---

# Security Features

* JWT Authentication
* Password Hashing
* Protected Routes
* Authorization Middleware
* Secure API Communication
* Environment Variable Configuration

---

# Future Improvements

* MongoDB database integration
* Email and SMS appointment reminders
* Role-Based Access Control (RBAC)
* Real-time notifications
* Advanced search and filtering
* Pagination
* Docker deployment
* Unit and integration testing

---

# Project Highlights

* Full-stack MERN application
* RESTful API architecture
* Secure authentication using JWT
* AI-powered healthcare assistant
* Medical report analysis
* Responsive user interface
* Modular and scalable project structure
* Ready for MongoDB integration
* Clean separation of frontend and backend

---

# Conclusion

Health Companion is a healthcare management platform developed to simplify day-to-day hospital and clinic operations. It combines patient management, appointment scheduling, doctor management, and AI-assisted healthcare support into a single application. The project demonstrates full-stack web development concepts, secure authentication, REST API integration, and AI service integration using modern web technologies.
