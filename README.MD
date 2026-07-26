# CivicPulse

CivicPulse is a modern civic-tech web application designed to connect citizens, municipal staff, and administrators in a single platform for reporting, tracking, and resolving public infrastructure issues. The app allows users to report problems such as potholes, garbage dumping, broken streetlights, drainage issues, and other local concerns, then monitor their progress through an interactive experience.

The platform combines community engagement, role-based dashboards, gamification, and intelligent issue analysis to make urban service management more transparent and responsive.

---

## 1. Overview

CivicPulse helps cities bridge the gap between the public and government departments by providing:

- A simple way for citizens to report issues
- A shared map-based view of current civic complaints
- Role-based access for users, staff, and administrators
- A transparent tracking system for complaint resolution
- Rewards and leaderboards to encourage participation
- AI-assisted classification and duplicate detection for incoming reports

This project is built as a full-stack application with a React frontend and an Express backend.

---

## 2. Key Features

### Citizen Features
- Report civic issues with title, description, category, severity, and location
- View issues on a map-based interface
- Upvote complaints to increase visibility
- Comment on existing issues
- Track personal activity and contribution history
- Earn rewards and improve rank on the leaderboard

### Staff Features
- View assigned issues and update their progress
- Monitor complaint status and worker updates
- Manage issue resolution workflow
- Review citizen reports and respond to updates

### Admin Features
- Manage the overall system and platform data
- Access administrative dashboards and analytics
- Monitor complaints, users, and platform activity
- Oversee system-level operations and governance

### Intelligent Features
- AI-based category prediction from issue descriptions
- Priority estimation for reported issues
- Duplicate complaint detection using location and text similarity
- Gamified engagement through rewards and profile statistics

---

## 3. Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Leaflet for map support
- Recharts for charts and visual summaries
- Lucide React for icons

### Backend
- Node.js
- Express.js
- JWT authentication
- bcryptjs for password hashing
- CORS support
- JSON-based local data persistence by default
- Mongoose integration is included for future database expansion

### Development Tools
- npm workspaces-style monorepo structure
- Concurrently for running frontend and backend together

---

## 4. Project Structure

```text
civic-pulse-download/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── data/
│   ├── database.js
│   ├── routes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json
├── AUTH_SETUP.md
└── README.md
```

---

## 5. How the Application Works

### User Flow
1. A citizen opens the app and navigates to the report section.
2. They describe the issue and provide location-related details.
3. The system predicts the likely category and priority.
4. The complaint is saved and becomes visible in the platform feed.
5. Other users can view it, upvote it, and add comments.
6. Staff or administrators review and update the issue status.
7. Once resolved, the issue is marked completed and visible in the history.

### Role-Based Access
- Users can report, view, and participate in civic issues.
- Staff can manage assigned cases and update progress.
- Admins have broader oversight and administrative capabilities.

---

## 6. Installation and Setup

### Prerequisites
Make sure you have the following installed:
- Node.js 18 or above
- npm
- Git

### Clone the Project
```bash
git clone <repository-url>
cd civic-pulse-download
```

### Install Dependencies
You can install everything from the root using:

```bash
npm run install-all
```

This will install dependencies for:
- the root package
- the backend
- the frontend

### Environment Variables
Create a `.env` file inside the backend folder with the following values:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/civicpulse
JWT_SECRET=your-secret-key
NODE_ENV=development
```

> Note: The current project is configured to run with a local JSON-backed data store by default, so the MongoDB connection can be optional depending on your setup.

---

## 7. Running the Application

### Option 1: Run Both Frontend and Backend Together
From the project root:

```bash
npm run dev
```

This launches:
- Backend server on http://localhost:5001
- Frontend app on http://localhost:5173

### Option 2: Run Separately
Open two terminals.

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

---

## 8. Main API Endpoints

The backend exposes a set of REST endpoints under `/api`.

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Complaints
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `POST /api/complaints`
- `POST /api/complaints/:id/vote`
- `GET /api/complaints/:id/comments`
- `POST /api/complaints/:id/comments`

### AI Assistance
- `POST /api/ai/predict`
- `POST /api/complaints/check-duplicate`

### Leaderboard and Rewards
- `GET /api/leaderboard`
- `GET /api/rewards/catalog`
- `POST /api/rewards/redeem`

---

## 9. Demo and Sample Data

The backend includes seeded sample data for demonstration purposes, including:
- sample complaints
- example users
- a leaderboard setup
- reward-related entries

This makes the app easier to preview without needing a full external database setup.

---

## 10. Authentication and Roles

The app supports role-based access for:
- `user`
- `staff`
- `admin`

Each role has a different dashboard experience and access level. The authentication flow is secured using JWT tokens and protected routes in the frontend.

For setup and credential guidance, see the file [AUTH_SETUP.md](AUTH_SETUP.md).

---

## 11. Design Highlights

CivicPulse uses a polished, modern interface with:
- dark-mode-friendly layouts
- responsive components
- glassmorphism-inspired UI styling
- interactive cards and dashboard views
- strong visual hierarchy for civic information

The UI is designed to be intuitive for both citizens and public officials.

---

## 12. Development Notes

If you want to extend the app further, common next steps include:
- connecting the backend to a real MongoDB database
- adding real-time notifications
- integrating Google Maps or OpenStreetMap services
- adding image upload for complaint submissions
- implementing advanced analytics dashboards
- connecting the app to municipal service APIs

---

## 13. License

This project is intended for educational, demo, and civic-tech development purposes.

---

## 14. Summary

CivicPulse is a practical example of how technology can improve public service delivery by making issue reporting more transparent, collaborative, and measurable. It brings together citizens, staff, and administrators around the shared goal of better urban infrastructure management.

If you are looking for a platform that combines civic engagement, dashboards, AI assistance, and community participation, CivicPulse is a strong foundation for that experience.
