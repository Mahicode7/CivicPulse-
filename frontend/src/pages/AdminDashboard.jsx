import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Users, Settings, BarChart3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const [allIssues, setAllIssues] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('Assigned');
  const [bulkComment, setBulkComment] = useState('Bulk status update by admin.');
  const [bulkMessage, setBulkMessage] = useState('');

  const fetchAllIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (res.ok) {
        const data = await res.json();
        setAllIssues(data);
      }
    } catch (error) {
      console.error('Failed to fetch issues', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllIssues();
    }
  }, [token]);

  const toggleIssueSelection = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIssues([]);
      setSelectAll(false);
    } else {
      setSelectedIssues(allIssues.map((issue) => issue.id));
      setSelectAll(true);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIssues.length === 0) {
      setBulkMessage('Please select at least one issue to update.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/complaints/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ids: selectedIssues,
          status: bulkStatus,
          officerName: 'Admin Dispatch Unit',
          officerDept: 'BBMP Central Operations',
          officerRank: 'Chief Administrator',
          officerPhone: '+91 90000 00000',
          adminComment: bulkComment,
          resolutionImage: bulkStatus === 'Resolved' ? 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600' : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBulkMessage(`Updated ${data.updatedCount} issue(s) successfully.`);
        setSelectedIssues([]);
        setSelectAll(false);
        fetchAllIssues();
      } else {
        const errorData = await res.json();
        setBulkMessage(errorData.error || 'Bulk update failed.');
      }
    } catch (error) {
      setBulkMessage('Bulk update failed due to a network error.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Users', value: 2450, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Issues', value: 1840, icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: 'Resolution Rate', value: '84%', icon: Shield, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">System administration and oversight</p>
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

        {/* Admin Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Administrator</p>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-red-400 mt-1">✓ Full System Access - {user?.email}</p>
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

        {/* Admin Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Administrative Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Manage Users</p>
              <p className="text-sm text-slate-400">View, edit, and manage user accounts</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Manage Staff</p>
              <p className="text-sm text-slate-400">Assign and manage staff members</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">View All Issues</p>
              <p className="text-sm text-slate-400">Monitor all reported complaints</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">System Analytics</p>
              <p className="text-sm text-slate-400">View detailed system reports</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">Audit Logs</p>
              <p className="text-sm text-slate-400">Review system activity and changes</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all text-left"
            >
              <p className="font-semibold mb-1">System Settings</p>
              <p className="text-sm text-slate-400">Configure application parameters</p>
            </motion.button>
          </div>
        </motion.div>

        {/* All Activity + Bulk Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">All Activity</h2>
              <p className="text-slate-400 text-sm mt-1">Bulk review and manage active issues across the full system.</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold">Selected</span>
              <span className="text-blue-300">{selectedIssues.length}</span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800"
              >
                {selectAll ? 'Clear' : 'Select all'}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-800">
                    <th className="py-3 pr-4">Select</th>
                    <th className="py-3 pr-4">Issue</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Area</th>
                    <th className="py-3 pr-4">Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {allIssues.length > 0 ? (
                    allIssues.map((issue) => (
                      <tr key={issue.id} className="border-b border-slate-800/50 hover:bg-slate-950/70">
                        <td className="py-3 pr-4">
                          <input
                            type="checkbox"
                            checked={selectedIssues.includes(issue.id)}
                            onChange={() => toggleIssueSelection(issue.id)}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-400"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-100">{issue.title}</div>
                          <div className="text-[10px] text-slate-500">{issue.id.slice(0, 8)}</div>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{issue.category}</td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.15em] bg-slate-900 text-slate-200">
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{issue.area}</td>
                        <td className="py-3 pr-4 text-slate-400">{new Date(issue.dateReported).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">No issues found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Bulk action</label>
                <select
                  value={bulkStatus}
                  onChange={(event) => setBulkStatus(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                >
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Bulk note</label>
                <textarea
                  value={bulkComment}
                  onChange={(event) => setBulkComment(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleBulkUpdate}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
              >
                Apply bulk update
              </button>

              {bulkMessage && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                  {bulkMessage}
                </div>
              )}

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-[11px] text-slate-400">
                <p className="font-semibold text-slate-200 mb-2">Bulk controls help:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Select multiple issues and update them together.</li>
                  <li>Use resolved mode to mark several reports as completed.</li>
                  <li>Assign teams quickly using admin dispatch workflows.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">System Health</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Database Status</span>
                <span className="font-semibold text-green-400">✓ Operational</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">API Response Time</span>
                <span className="font-semibold">45ms</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">System Uptime</span>
                <span className="font-semibold">99.95%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
