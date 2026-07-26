import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

export default function IssueStatistics({ complaints, resolved, pending, inProgress, rejected, darkMode }) {
  // Prepare data for charts
  const statusData = [
    { name: 'Resolved', value: resolved, fill: '#10b981' },
    { name: 'Pending', value: pending, fill: '#f59e0b' },
    { name: 'In Progress', value: inProgress, fill: '#3b82f6' },
    { name: 'Rejected', value: rejected, fill: '#ef4444' },
  ].filter(d => d.value > 0);

  // Category breakdown
  const categoryData = complaints.reduce((acc, issue) => {
    const existing = acc.find(item => item.name === issue.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: issue.category || 'Other', value: 1 });
    }
    return acc;
  }, []);

  // Chart colors
  const chartColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  // Monthly trend
  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i],
    issues: Math.floor(Math.random() * 8) + 2,
    resolved: Math.floor(Math.random() * 6) + 1,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        Issue Statistics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Issues"
          value={complaints.length}
          color="text-blue-500"
          bgColor={darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}
          darkMode={darkMode}
        />
        <StatCard
          icon={CheckCircle2}
          label="Resolved"
          value={resolved}
          color="text-green-500"
          bgColor={darkMode ? 'bg-green-500/10' : 'bg-green-100'}
          darkMode={darkMode}
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={inProgress}
          color="text-blue-500"
          bgColor={darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}
          darkMode={darkMode}
        />
        <StatCard
          icon={AlertCircle}
          label="Pending"
          value={pending}
          color="text-orange-500"
          bgColor={darkMode ? 'bg-orange-500/10' : 'bg-orange-100'}
          darkMode={darkMode}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Pie Chart */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h3 className="font-bold text-sm mb-4">Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#fff',
                    border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [value, 'Issues']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h3 className="font-bold text-sm mb-4">Issues by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                />
                <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#fff',
                    border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <h3 className="font-bold text-sm mb-4">6-Month Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
            <XAxis dataKey="month" tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
            <YAxis tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#fff',
                border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="issues" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, darkMode }) {
  return (
    <div className={`p-6 rounded-xl border ${
      darkMode ? `${bgColor} border-slate-700` : `${bgColor} border-slate-200 shadow-sm`
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-20`} />
      </div>
    </div>
  );
}
