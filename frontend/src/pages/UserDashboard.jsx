import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CheckCircle, Trophy, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Reports Filed', value: 24, icon: CheckCircle, color: 'from-blue-500 to-blue-600' },
    { label: 'Points Earned', value: 1250, icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Rank', value: 'Silver', icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-slate-400">Here's your civic engagement dashboard</p>
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

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
              <p className="text-sm text-green-400 mt-1">✓ Citizen Account</p>
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

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Available Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Report an Issue</p>
              <p className="text-sm text-slate-400">File a new civic complaint</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">View Reports</p>
              <p className="text-sm text-slate-400">Track your submitted issues</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Leaderboard</p>
              <p className="text-sm text-slate-400">See top contributors</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rewards')}
              className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1 flex items-center gap-2"><Gift className="w-4 h-4" />Redeem Rewards</p>
              <p className="text-sm text-slate-400">Unlock certificates, badges, and vouchers</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">My Profile</p>
              <p className="text-sm text-slate-400">Manage account settings</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
