# CivicPulse 3-Tier Authentication System - Setup & Credentials Guide

## 🚀 Project Structure

### Backend Architecture
```
backend/
├── controllers/
│   └── authController.js          # Login, Register, Logout logic
├── middleware/
│   └── authMiddleware.js          # JWT verification & Role-based access control
├── models/
│   └── User.js                    # MongoDB User Schema with password hashing
├── utils/
│   └── authUtils.js               # JWT token generation & verification
├── routes/
│   └── auth.js                    # Auth endpoints
├── server.js                      # Main server file
├── package.json                   # Updated with bcryptjs & jsonwebtoken
└── database.js
```

### Frontend Architecture
```
frontend/src/
├── context/
│   └── AuthContext.jsx            # Auth state management with axios
├── components/
│   └── ProtectedRoute.jsx         # Route protection & role-based access
├── pages/
│   ├── Login.jsx                  # Modern login form with glassmorphism
│   ├── Register.jsx               # Registration with role selection
│   ├── UserDashboard.jsx          # User role dashboard
│   ├── StaffDashboard.jsx         # Staff role dashboard
│   ├── AdminDashboard.jsx         # Admin role dashboard
│   ├── Unauthorized.jsx           # 403 access denied page
│   └── (existing pages protected)
├── App.jsx                        # Updated with Auth routing
└── vite.config.js
```

---

## 🔐 Authentication Features

### Roles & Permissions

| Role | Login | Redirect | Features |
|------|-------|----------|----------|
| **User** | ✅ | /user-dashboard | Report issues, view reports, leaderboard |
| **Staff** | ✅ | /staff-dashboard | Manage assigned issues, update status, add resolution |
| **Admin** | ✅ | /admin-dashboard | Full system access, manage users, analytics |

---

## 📝 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user (Protected)
```

### Request/Response Examples

#### Register
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "user"  // "user" | "staff" | "admin"
}

Response (201):
{
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-05-28T10:30:00Z"
  }
}
```

#### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-05-28T10:30:00Z"
  }
}
```

---

## 🎯 Demo Credentials (Pre-seeded for Testing)

Create these users first or use the registration page:

### User Account
```
Email: user@example.com
Password: password
Role: User
```

### Staff Account
```
Email: staff@example.com
Password: password
Role: Staff
```

### Admin Account
```
Email: admin@example.com
Password: password
Role: Admin
```

---

## 🔧 Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

New packages installed:
- `bcryptjs@^2.4.3` - Password hashing
- `jsonwebtoken@^9.1.2` - JWT token management

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in backend root:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-pulse
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Or run both simultaneously from root:**
```bash
npm run dev
```

---

## 🔐 Security Implementation

### Password Hashing
- Passwords hashed with `bcryptjs` (10 rounds of salt)
- Passwords never stored in plaintext
- Never returned in API responses

### JWT Authentication
- Token-based authentication
- Token includes: `userId`, `role`, `expiresIn: 7d`
- Sent in Authorization header: `Bearer <token>`
- Validated on every protected route

### Protected Routes
- Routes wrapped with `<ProtectedRoute>`
- Automatic redirect to login if unauthenticated
- Role-based access control (RBAC)
- Redirect to unauthorized page if insufficient permissions

### Frontend Security
- JWT stored in localStorage
- Auto-included in axios headers
- Session validation on app load
- Automatic logout on token expiration

---

## 🎨 UI Features

### Login Page
- Glassmorphism design with animated background
- Email and password inputs with icons
- Error messages display
- Loading state during authentication
- Link to registration page
- Demo credentials hint

### Registration Page
- Multi-step form fields
- Role selection with descriptions
- Password confirmation validation
- Email validation
- Real-time error feedback
- Animated role selector cards

### Dashboards
Each role has a customized dashboard:

**User Dashboard:**
- Reports filed counter
- Points earned
- Rank/Level display
- Quick action buttons
- Profile information

**Staff Dashboard:**
- Issues assigned count
- Resolved count
- Pending issues
- Performance metrics
- Staff-specific tools

**Admin Dashboard:**
- Total users
- Total issues
- Resolution rate
- System health status
- Database/API metrics
- Administrative tools

---

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile:** Single column, hamburger menu
- **Tablet:** 2-3 columns
- **Desktop:** Full layout with navigation bar

---

## 🔄 User Flow

### New User Flow
1. Click "Sign up" on login page
2. Fill registration form
3. Select role (User/Staff/Admin)
4. Submit registration
5. Automatically logged in
6. Redirected to role-based dashboard

### Existing User Flow
1. Visit `/login`
2. Enter credentials
3. Click "Sign In"
4. Redirected to appropriate dashboard based on role
5. User remains logged in across page refreshes (token in localStorage)

### Logout Flow
1. Click "Logout" button in header or dashboard
2. Token removed from localStorage
3. Redirected to `/login`
4. All routes require authentication again

---

## 🛡️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'staff', 'admin']),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

## 🐛 Troubleshooting

### Login fails with "Invalid email or password"
- Check email spelling and password
- Ensure user exists in database
- Check if account is active (`isActive: true`)

### JWT token expired
- App automatically redirects to login
- User needs to log in again
- Token expires after 7 days by default

### CORS errors
- Ensure backend is running on port 5000
- Frontend can access on http://localhost:5000
- Check `VITE_API_URL` environment variable

### Protected routes show loading indefinitely
- Check if AuthProvider wraps the entire app
- Ensure useAuth() is called within AuthProvider
- Check browser console for errors

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/models/User.js` | User database schema & password hashing |
| `backend/controllers/authController.js` | Authentication logic |
| `backend/middleware/authMiddleware.js` | JWT verification & role checking |
| `backend/routes/auth.js` | Auth API endpoints |
| `frontend/context/AuthContext.jsx` | Global auth state |
| `frontend/components/ProtectedRoute.jsx` | Route protection logic |
| `frontend/pages/Login.jsx` | Login UI |
| `frontend/pages/Register.jsx` | Registration UI |

---

## 🚀 Next Steps

1. Seed demo users to database
2. Test login/logout flow
3. Verify role-based redirects
4. Test protected routes
5. Integrate with existing complaint system
6. Add user profile management
7. Implement password reset
8. Add email verification
9. Add two-factor authentication (optional)

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs for API errors
3. Verify `.env` configuration
4. Ensure all dependencies are installed
5. Restart both frontend and backend

---

**Last Updated:** May 28, 2024  
**Version:** 1.0.0 - Initial Release  
**Author:** CivicPulse Team
