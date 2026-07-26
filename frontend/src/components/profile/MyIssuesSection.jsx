import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar, User, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function MyIssuesSection({ complaints, selectedComplaint, setSelectedComplaint, darkMode }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusIcons = {
    'Resolved': CheckCircle2,
    'In Progress': Clock,
    'Rejected': XCircle,
    'Submitted': AlertCircle,
    'Under Review': AlertCircle,
    'Verified': AlertCircle,
    'Assigned': AlertCircle,
  };

  const statusColors = {
    'Resolved': 'text-green-500 bg-green-500/10',
    'In Progress': 'text-blue-500 bg-blue-500/10',
    'Rejected': 'text-red-500 bg-red-500/10',
    'Submitted': 'text-yellow-500 bg-yellow-500/10',
    'Under Review': 'text-orange-500 bg-orange-500/10',
    'Verified': 'text-blue-500 bg-blue-500/10',
    'Assigned': 'text-purple-500 bg-purple-500/10',
  };

  const filteredComplaints = filterStatus === 'all'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  const getStatusBadgeStyle = (status) => {
    const baseStyle = `px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`;
    return `${baseStyle} ${statusColors[status] || 'text-slate-500 bg-slate-500/10'}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Issues</h2>

      {/* Filter Tabs */}
      <div className={`flex gap-2 p-2 rounded-lg border overflow-x-auto ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {['all', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filterStatus === status
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status === 'all' ? 'All Issues' : status}
            {status !== 'all' && (
              <span className={`ml-2 text-xs font-bold ${filterStatus === status ? 'text-white' : darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                ({complaints.filter(c => c.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((issue) => {
            const isExpanded = expandedId === issue.id;
            const StatusIcon = statusIcons[issue.status] || AlertCircle;

            return (
              <div
                key={issue.id}
                className={`border rounded-lg transition-all ${
                  isExpanded
                    ? darkMode
                      ? 'bg-slate-800/50 border-slate-700 shadow-lg'
                      : 'bg-slate-50 border-slate-300 shadow-md'
                    : darkMode
                    ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="w-full p-5 flex items-start justify-between gap-4 text-left hover:opacity-80 transition-opacity"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg line-clamp-2">{issue.title}</h3>
                      <span className={getStatusBadgeStyle(issue.status)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {issue.status}
                      </span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {issue.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className={`px-5 pb-5 space-y-4 border-t ${
                    darkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    {/* Issue Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <DetailItem
                        label="Issue ID"
                        value={issue.id}
                        darkMode={darkMode}
                      />
                      <DetailItem
                        label="Category"
                        value={issue.category}
                        darkMode={darkMode}
                      />
                      <DetailItem
                        label="Priority"
                        value={issue.priority || 'Normal'}
                        darkMode={darkMode}
                      />
                      <DetailItem
                        label="Date Reported"
                        value={new Date(issue.dateReported).toLocaleDateString()}
                        darkMode={darkMode}
                      />
                    </div>

                    {/* Location & Details */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                      <h4 className="font-semibold text-sm mb-3">Location & Details</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>{issue.area}</span>
                        </p>
                        {issue.assignedStaff && (
                          <p className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                            <span>Assigned to: <span className="font-semibold">{issue.assignedStaff}</span></span>
                          </p>
                        )}
                        {issue.resolutionDate && (
                          <p className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>Resolved on: <span className="font-semibold">{new Date(issue.resolutionDate).toLocaleDateString()}</span></span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    {issue.timeline && issue.timeline.length > 0 && (
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                        <h4 className="font-semibold text-sm mb-3">Timeline</h4>
                        <div className="space-y-2">
                          {issue.timeline.slice(-3).reverse().map((t, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-300">{t.status}</p>
                                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                                  {new Date(t.date).toLocaleString()}
                                </p>
                                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{t.comment}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}>
                        View Details
                      </button>
                      <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}>
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={`p-8 rounded-lg text-center ${
            darkMode ? 'bg-slate-900/40 border border-slate-800' : 'bg-slate-50 border border-slate-200'
          }`}>
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 mb-2">No issues found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or report a new issue</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, darkMode }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wider ${
        darkMode ? 'text-slate-500' : 'text-slate-600'
      } mb-1`}>
        {label}
      </p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
