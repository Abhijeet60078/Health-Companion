# Health Companion - React Frontend (MERN Stack)

This is the React-based frontend for the Health Companion MERN (MongoDB, Express, React, Node.js) application.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.js           # Navigation sidebar
│   │   ├── Topbar.js            # Top navigation bar with search
│   │   ├── RightSidebar.js      # Quick actions sidebar
│   │   ├── Layout.js            # Main layout wrapper
│   │   ├── ProtectedRoute.js    # Auth protection for routes
│   │   └── *.css                # Component styles
│   │
│   ├── pages/
│   │   ├── Login.js             # Login page
│   │   ├── Signup.js            # Registration page
│   │   ├── Dashboard.js         # Main dashboard
│   │   ├── Appointments.js      # Appointments management
│   │   ├── Patients.js          # Patient records
│   │   └── *.css                # Page-specific styles
│   │
│   ├── context/
│   │   └── AuthContext.js       # Authentication state management
│   │
│   ├── services/
│   │   └── api.js               # API service for backend calls
│   │
│   ├── styles/
│   │   └── global.css           # Global styles
│   │
│   ├── App.js                   # Main app component with routing
│   ├── App.css                  # App styles
│   └── index.js                 # React entry point
│
└── package.json
```

## Tech Stack

- **React**: UI library
- **React Router**: Client-side routing
- **Context API**: State management
- **CSS**: Styling (no CSS-in-JS framework, plain CSS for performance)
- **Node.js Backend Integration**: API calls to Express backend

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the React development server with hot reload.

### `npm build`
Creates an optimized production build.

### `npm test`
Runs the test suite.

## Features Implemented

✅ **Authentication**
- Login page with email validation
- Signup page with password strength indicator
- Session management using localStorage
- Protected routes that redirect to login

✅ **Dashboard**
- Statistics cards showing key metrics
- Recent appointments list
- Active patients overview
- Responsive design

✅ **Appointments Management**
- Table view of all appointments
- Filter by status and doctor
- View appointment details
- Edit/Cancel appointments

✅ **Patient Management**
- Grid view with patient cards
- Table view for detailed records
- Filter by status and department
- Search functionality

✅ **Layout Components**
- Sidebar navigation
- Top search bar
- Quick actions panel
- Responsive design (mobile, tablet, desktop)

## API Integration

The app is configured to connect to a backend API. Update the API_URL in `src/services/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

Or set the environment variable:
```bash
REACT_APP_API_URL=http://your-api.com/api npm start
```

### API Endpoints Used

```
POST   /api/auth/login           - User login
POST   /api/auth/signup          - User registration
POST   /api/auth/logout          - User logout

GET    /api/appointments         - Get all appointments
GET    /api/appointments/:id     - Get appointment by ID
POST   /api/appointments         - Create appointment
PUT    /api/appointments/:id     - Update appointment
DELETE /api/appointments/:id     - Delete appointment

GET    /api/patients             - Get all patients
GET    /api/patients/:id         - Get patient by ID
POST   /api/patients             - Create patient
PUT    /api/patients/:id         - Update patient
DELETE /api/patients/:id         - Delete patient
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

## Authentication

The authentication system uses:
- **localStorage**: For storing user session data
- **Context API**: For managing auth state globally
- **Protected Routes**: Using React Router to protect authenticated pages

Login credentials (for development):
- Email: any valid email format
- Password: minimum 6 characters

## Styling

Global styles are defined in `src/styles/global.css` with CSS variables:

```css
--primary: #1abc9c
--secondary: #3498db
--danger: #e74c3c
--warning: #f39c12
--success: #27ae60
```

Use these variables throughout components for consistent theming.

## State Management

We use React Context API with proper patterns:

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  // ...
};
```

## Responsive Design

The layout is mobile-first and responsive:
- **Desktop**: 250px sidebar + main content + 320px right sidebar
- **Tablet**: 200px sidebar + main content (right sidebar hidden)
- **Mobile**: Full-screen single column (sidebar hidden)

## Future Enhancements

- [ ] Replace mock data with real API calls
- [ ] Add Redux or Zustand for complex state management
- [ ] Implement real-time notifications with WebSocket
- [ ] Add data export functionality (PDF/Excel)
- [ ] Implement advanced filtering and search
- [ ] Add user profile management
- [ ] Implement two-factor authentication
- [ ] Add dark mode support
- [ ] Implement analytics dashboard
- [ ] Add appointment scheduling with calendar

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Optimized re-renders with proper dependency arrays
- CSS optimization and minification in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm start
```

### API connection errors
- Ensure backend is running on the correct port
- Check REACT_APP_API_URL environment variable
- Verify CORS is enabled on backend

### Authentication not persisting
- Check if localStorage is enabled in browser
- Verify browser cookies/storage settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - See LICENSE file for details
