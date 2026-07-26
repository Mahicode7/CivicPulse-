import React from 'react';
import { Activity, FileText, MessageSquare, Award, Edit2, CheckCircle2 } from 'lucide-react';

export default function ActivityHistory({ activities, darkMode }) {
  const getActivityIcon = (category) => {
    switch (category) {
      case 'issue':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'badge':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'profile':
        return <Edit2 className="h-5 w-5 text-purple-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-slate-500" />;
    }
  };

  const getActivityColor = (category) => {
    switch (category) {
      case 'issue':
        return darkMode ? 'bg-blue-600/10' : 'bg-blue-50';
      case 'comment':
        return darkMode ? 'bg-green-600/10' : 'bg-green-50';
      case 'badge':
        return darkMode ? 'bg-yellow-600/10' : 'bg-yellow-50';
      case 'profile':
        return darkMode ? 'bg-purple-600/10' : 'bg-purple-50';
      case 'resolved':
        return darkMode ? 'bg-green-600/10' : 'bg-green-50';
      default:
        return darkMode ? 'bg-slate-900/20' : 'bg-slate-50';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${
      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
        <Activity className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-bold">Activity History</h3>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div key={activity.id || idx} className="relative flex gap-4">
              {/* Timeline connector */}
              {idx < activities.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-12 ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-300'
                }`} />
              )}

              {/* Activity Icon */}
              <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
              } ${getActivityColor(activity.category)} relative z-10`}>
                {getActivityIcon(activity.category)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 pt-2">
                <p className="font-bold text-sm">{activity.action}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activity.description}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Activity className={`h-12 w-12 mx-auto mb-3 opacity-20`} />
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              No activity yet
            </p>
          </div>
        )}
      </div>

      {/* View More Link */}
      {activities.length > 0 && (
        <button className={`w-full py-2 text-center font-semibold text-sm rounded-lg transition-colors mt-4 border-t ${
          darkMode
            ? 'text-blue-400 hover:bg-blue-600/10 border-slate-700'
            : 'text-blue-600 hover:bg-blue-50 border-slate-200'
        }`}>
          View Full History
        </button>
      )}
    </div>
  );
}
