import React from 'react';
import { Users, CheckCircle2, TrendingUp, Briefcase, Award, Calendar, AlertCircle } from 'lucide-react';

export default function StaffView({ user, complaints, darkMode }) {
  // Mock staff metrics
  const staffMetrics = {
    assignedIssues: 24,
    resolvedCases: 18,
    performanceRating: 4.7,
    department: 'Infrastructure & Roads',
    designation: 'Senior Inspector',
    yearsOfService: 5,
    averageResolutionTime: '7.2 days',
    satisfactionScore: 92,
  };

  const recentCases = complaints.slice(0, 5).map(c => ({
    ...c,
    handledTime: '5 days',
    resolution: 'Completed',
  }));

  const performanceMetrics = [
    { label: 'Response Time', value: '2.1 hrs', target: '4 hrs', status: 'exceeding' },
    { label: 'Resolution Rate', value: '75%', target: '70%', status: 'exceeding' },
    { label: 'Customer Satisfaction', value: '92%', target: '85%', status: 'exceeding' },
    { label: 'Issues Assigned', value: '24', target: '20', status: 'exceeding' },
  ];

  return (
    <div className="space-y-8 border-t border-slate-700 pt-8 mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-blue-500" />
        Staff Performance Dashboard
      </h2>

      {/* Staff Info Card */}
      <div className={`p-8 rounded-2xl border ${
        darkMode
          ? 'bg-gradient-to-br from-blue-950/40 to-slate-950/40 border-blue-900/20'
          : 'bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200/50'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div className="space-y-4">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Designation</p>
              <p className="text-2xl font-bold">{staffMetrics.designation}</p>
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Department</p>
              <p className="text-lg font-bold">{staffMetrics.department}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}>Years of Service</p>
                <p className="text-2xl font-bold text-blue-500">{staffMetrics.yearsOfService}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}>Performance Rating</p>
                <p className="text-2xl font-bold text-yellow-500">{staffMetrics.performanceRating}⭐</p>
              </div>
            </div>
          </div>

          {/* Right side - Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MetricBox
              icon={CheckCircle2}
              label="Resolved Cases"
              value={staffMetrics.resolvedCases}
              color="text-green-500"
              bgColor={darkMode ? 'bg-green-500/10' : 'bg-green-100'}
            />
            <MetricBox
              icon={AlertCircle}
              label="Assigned Issues"
              value={staffMetrics.assignedIssues}
              color="text-blue-500"
              bgColor={darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}
            />
            <MetricBox
              icon={TrendingUp}
              label="Avg. Resolution"
              value={staffMetrics.averageResolutionTime}
              color="text-purple-500"
              bgColor={darkMode ? 'bg-purple-500/10' : 'bg-purple-100'}
            />
            <MetricBox
              icon={Award}
              label="Satisfaction"
              value={`${staffMetrics.satisfactionScore}%`}
              color="text-yellow-500"
              bgColor={darkMode ? 'bg-yellow-500/10' : 'bg-yellow-100'}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => (
            <div
              key={metric.label}
              className={`p-6 rounded-lg border ${
                darkMode
                  ? 'bg-slate-900/40 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="font-bold">{metric.label}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  metric.status === 'exceeding'
                    ? 'bg-green-500/20 text-green-500'
                    : metric.status === 'on-track'
                    ? 'bg-blue-500/20 text-blue-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {metric.status === 'exceeding' ? '↑ Exceeding' : '→ On Track'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                    Target: {metric.target}
                  </p>
                </div>
                <div className={`w-full h-2 rounded-full border overflow-hidden ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Recent Cases Handled</h3>
        <div className={`rounded-2xl border overflow-hidden ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Issue ID</th>
                  <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Title</th>
                  <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Handled Time</th>
                  <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className={`border-b transition-colors ${
                      darkMode ? 'hover:bg-slate-800/30 border-slate-700' : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-500">{caseItem.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{caseItem.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                        {caseItem.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{caseItem.handledTime}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold flex items-center gap-1 text-green-500 bg-green-500/20 px-2 py-1 rounded w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        {caseItem.resolution}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart Placeholder */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <h3 className="text-xl font-bold mb-4">Monthly Performance Trend</h3>
        <div className="grid grid-cols-6 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
            <div key={month} className="text-center">
              <div className="flex flex-col-reverse h-32 gap-1">
                <p className="text-xs font-bold">{month}</p>
                {/* Bar chart representation */}
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{
                    height: `${Math.random() * 100 + 20}px`,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
          View Detailed Report
        </button>
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all ${
          darkMode
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
        }`}>
          Export Performance Data
        </button>
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all ${
          darkMode
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
        }`}>
          Schedule Review Meeting
        </button>
      </div>
    </div>
  );
}

function MetricBox({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className={`p-4 rounded-lg border ${bgColor} border-transparent space-y-2`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase">{label}</p>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
