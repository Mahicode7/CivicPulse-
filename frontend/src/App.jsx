import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Shield, Bell, Menu, X, Trophy, User, PlusCircle, Map, Home, Moon, Sun, Sparkles, LogOut, Gift } from 'lucide-react';

// Context & Provider
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Create AppContext for legacy page components
export const AppContext = createContext({
  darkMode: true,
  user: null,
  addToast: () => {}
});

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Dashboard Pages
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Original Pages
import HomePage from './pages/Home';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportIssue';
import LeaderboardPage from './pages/Leaderboard';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import RedeemRewardsPage from './pages/RedeemRewards';

// Navigation Components
function NavLink({ to, icon, label, darkMode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        isActive
          ? darkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'
          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon} {label}
    </Link>
  );
}

function MobileNavLink({ to, icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
        isActive ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {icon} {label}
    </Link>
  );
}

// Main App Layout Component
function AppLayout({ children }) {
  const { isAuthenticated, user, logout, refreshUser } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your report has been assigned", time: "10m ago", read: false },
    { id: 2, text: "New update on your issue", time: "1h ago", read: true }
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
  };

  // If not authenticated, just render children without header
  if (!isAuthenticated) {
    return children;
  }

  return (
    <AppContext.Provider value={{ darkMode, user, addToast: () => {}, refreshUser }}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header Navigation */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${darkMode ? 'bg-slate-950/80 border-slate-800/80 shadow-lg' : 'bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5.5 w-5.5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                CivicPulse
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1.5">
            {isAuthenticated && (
              <>
                <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" darkMode={darkMode} />
                {user?.role === 'user' && (
                  <>
                    <NavLink to="/map" icon={<Map className="h-4 w-4" />} label="Map" darkMode={darkMode} />
                    <NavLink to="/report" icon={<PlusCircle className="h-4 w-4" />} label="Report" darkMode={darkMode} />
                  </>
                )}
                <NavLink to="/leaderboard" icon={<Trophy className="h-4 w-4" />} label="Leaderboard" darkMode={darkMode} />
                <NavLink to="/rewards" icon={<Gift className="h-4 w-4" />} label="Rewards" darkMode={darkMode} />
              </>
            )}
          </nav>

          {/* Actions Tray */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                >
                  <Bell className="h-4.5 w-4.5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-80 rounded-xl border p-2 shadow-2xl z-50 ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-lg text-xs ${n.read ? 'opacity-70' : 'bg-blue-500/10'}`}>
                          <p>{n.text}</p>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile & Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-red-400 hover:bg-red-500/20' : 'bg-slate-100 border-slate-200 text-red-600 hover:bg-red-50'}`}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden h-9 w-9 rounded-lg flex items-center justify-center border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className={`md:hidden border-t p-4 space-y-2 ${darkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white border-slate-200'}`}>
            <MobileNavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" onClick={() => setMobileMenuOpen(false)} />
            {user?.role === 'user' && (
              <>
                <MobileNavLink to="/map" icon={<Map className="h-4 w-4" />} label="Map" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/report" icon={<PlusCircle className="h-4 w-4" />} label="Report" onClick={() => setMobileMenuOpen(false)} />
              </>
            )}
            <MobileNavLink to="/leaderboard" icon={<Trophy className="h-4 w-4" />} label="Leaderboard" onClick={() => setMobileMenuOpen(false)} />
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
    </AppContext.Provider>
  );
}

// Routes Component
function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute requiredRoles={['user']}><UserDashboard /></ProtectedRoute>}
        />
        <Route
          path="/staff-dashboard"
          element={<ProtectedRoute requiredRoles={['staff']}><StaffDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute requiredRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
        />

        {/* Protected Original Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><RedeemRewardsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}><AdminPage /></ProtectedRoute>} />

        {/* Redirect unauthenticated users */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
