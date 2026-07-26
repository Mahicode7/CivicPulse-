import React from 'react';
import { TrendingUp, CheckCircle2, AlertCircle, Target, Crown, Zap } from 'lucide-react';

export default function DashboardOverview({ user, leaderboard, issues, darkMode }) {
  const stats = [
    {
      label: 'Current Rank',
      value: `#${leaderboard?.currentRank || 'N/A'}`,
      icon: Crown,
      color: 'text-purple-500',
      bgColor: darkMode ? 'bg-purple-500/10' : 'bg-purple-100',
      borderColor: darkMode ? 'border-purple-500/20' : 'border-purple-200'
    },
    {
      label: 'Total Points',
      value: leaderboard?.totalPoints?.toLocaleString() || '0',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: darkMode ? 'bg-yellow-500/10' : 'bg-yellow-100',
      borderColor: darkMode ? 'border-yellow-500/20' : 'border-yellow-200'
    },
    {
      label: 'Open Issues',
      value: issues?.pending || 0,
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: darkMode ? 'bg-orange-500/10' : 'bg-orange-100',
      borderColor: darkMode ? 'border-orange-500/20' : 'border-orange-200'
    },
    {
      label: 'Resolved Issues',
      value: issues?.resolved || 0,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: darkMode ? 'bg-green-500/10' : 'bg-green-100',
      borderColor: darkMode ? 'border-green-500/20' : 'border-green-200'
    },
    {
      label: 'Community Impact',
      value: leaderboard?.communityImpactScore?.toFixed(1) || '0.0',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: darkMode ? 'bg-blue-500/10' : 'bg-blue-100',
      borderColor: darkMode ? 'border-blue-500/20' : 'border-blue-200'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`p-8 rounded-2xl border ${
        darkMode 
          ? 'bg-gradient-to-br from-blue-950/40 to-slate-950/40 border-blue-900/20' 
          : 'bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200/50'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        </div>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          You're making a real difference in your community. Keep up the great work!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-xl border transition-all hover:scale-105 ${
                darkMode
                  ? `${stat.bgColor} ${stat.borderColor} border`
                  : `${stat.bgColor} ${stat.borderColor} border shadow-sm`
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-1`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
