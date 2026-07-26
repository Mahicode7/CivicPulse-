import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CheckCheck, AlertCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Issues Assigned', value: 15, icon: AlertCircle, color: 'from-orange-500 to-orange-600' },
    { label: 'Resolved', value: 8, icon: CheckCheck, color: 'from-green-500 to-green-600' },
    { label: 'Pending', value: 7, icon: AlertCircle, color: 'from-red-500 to-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
            <p className="text-slate-400">Manage and resolve civic issues</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>

        {/* Staff Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Staff Member</p>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-orange-400 mt-1">✓ Staff Account - {user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Staff Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Staff Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">View Assigned Issues</p>
              <p className="text-sm text-slate-400">See your assigned complaints</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Update Issue Status</p>
              <p className="text-sm text-slate-400">Mark issues as resolved</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Add Resolution Details</p>
              <p className="text-sm text-slate-400">Upload proof and comments</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Performance Report</p>
              <p className="text-sm text-slate-400">View your metrics</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Resolution Rate</span>
                <span className="font-semibold">53%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-green-500 to-green-600"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Average Resolution Time</span>
                <span className="font-semibold">3.2 days</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
