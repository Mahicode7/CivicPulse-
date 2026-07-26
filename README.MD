# CivicPulse

## Smart Civic Issue Reporting & Management System

CivicPulse is a modern civic-tech web application that connects citizens, municipal staff, and administrators on a single platform for reporting, tracking, and resolving public infrastructure issues. The platform enables users to report problems such as potholes, garbage dumping, broken streetlights, drainage issues, and other civic concerns while providing transparent status tracking and role-based management.

The project is built as a full-stack web application using **React**, **Node.js**, and **Express.js**, with a responsive interface designed to encourage community participation in improving public infrastructure.

---

# Features

## Citizen Features

* Report civic issues with title, description, category, severity, and location
* Track complaint status
* View reported issues
* Earn reward points for participation
* View leaderboard rankings
* Manage personal profile and activity

## Staff Features

* View assigned complaints
* Update complaint status
* Monitor issue progress
* Manage resolution workflow

## Administrator Features

* Manage users and complaints
* Monitor overall platform activity
* Access administrative dashboard
* Oversee system operations

---

# Technology Stack

## Frontend

* React 18
* Vite
* React Router DOM
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* CORS
* JSON-based local database

## Development Tools

* npm
* Git
* Concurrently

---

# Project Structure

```text
civic-pulse-download/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── data/
│   ├── database.js
│   ├── server.js
│   └── package.json
│
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
│
├── package.json
├── AUTH_SETUP.md
└── README.md
```

---

# Installation

## Prerequisites

* Node.js (v18 or above)
* npm
* Git

---

## Clone Repository

```bash
git clone https://github.com/Mahicode7/civic-issue-reporting-.git
cd civic-issue-reporting-
```

---

## Install Dependencies

Install all required packages:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

# Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development
```

If using MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/civicpulse
```

---

# Running the Project

### Run Frontend and Backend Together

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5001
```

Or run separately.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

# Authentication

The application supports role-based authentication.

* User
* Staff
* Admin

JWT tokens are used to protect authenticated routes.

---

# Future Enhancements

* AI-powered issue categorization
* Duplicate complaint detection
* Image upload
* Google Maps/OpenStreetMap integration
* Push notifications
* Real-time updates
* MongoDB integration
* Advanced analytics dashboard

---

# License

This project is developed for educational and demonstration purposes.

---

# Author

**Mahicode7**

GitHub: https://github.com/Mahicode7

---

# Conclusion

CivicPulse demonstrates how technology can improve civic engagement by enabling citizens, staff, and administrators to collaborate on resolving public issues efficiently. The platform provides a scalable foundation for building smarter and more transparent municipal service management systems.
