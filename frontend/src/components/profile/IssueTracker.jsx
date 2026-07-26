import React from 'react';
import { Activity, Clock, CheckCircle2, MapPin, User, Calendar, MessageSquare } from 'lucide-react';

export default function IssueTracker({ complaint, darkMode }) {
  const getProgressPercentage = (status) => {
    const statuses = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const currentIndex = statuses.indexOf(status);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  const timelineStages = [
    { name: 'Submitted', description: 'Issue submitted', icon: '📝' },
    { name: 'Verified', description: 'Verified by team', icon: '✓' },
    { name: 'Assigned', description: 'Assigned to staff', icon: '👤' },
    { name: 'In Progress', description: 'Work in progress', icon: '🔧' },
    { name: 'Resolved', description: 'Issue resolved', icon: '✓✓' },
  ];

  const isStageComplete = (stageName) => {
    const statuses = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const complaintIndex = statuses.indexOf(complaint.status);
    const stageIndex = statuses.indexOf(stageName);
    return stageIndex <= complaintIndex;
  };

  const isCurrentStage = (stageName) => {
    return complaint.status === stageName;
  };

  return (
    <div className={`p-8 rounded-2xl border space-y-8 ${
      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
    }`}>
      
      {/* Issue Header */}
      <div className="space-y-4 border-b border-slate-700 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold mb-2">{complaint.title}</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{complaint.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap flex-shrink-0 ${
            complaint.status === 'Resolved' ? 'bg-green-500/20 text-green-500' :
            complaint.status === 'In Progress' ? 'bg-blue-500/20 text-blue-500' :
            complaint.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
            'bg-yellow-500/20 text-yellow-500'
          }`}>
            {complaint.status}
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <InfoItem icon={MapPin} label="Location" value={complaint.area?.split(',')[0]} darkMode={darkMode} />
          <InfoItem icon={Calendar} label="Filed" value={new Date(complaint.dateReported).toLocaleDateString()} darkMode={darkMode} />
          <InfoItem icon={User} label="Assigned" value={complaint.assignedStaff || 'Pending'} darkMode={darkMode} />
          <InfoItem icon={Clock} label="Priority" value={complaint.priority || 'Normal'} darkMode={darkMode} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Resolution Progress
          </h3>
          <span className="text-sm font-bold text-blue-500">{Math.round(getProgressPercentage(complaint.status))}%</span>
        </div>
        <div className={`w-full h-3 rounded-full border overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${getProgressPercentage(complaint.status)}%` }}
          />
        </div>
      </div>

      {/* Timeline Stages */}
      <div className="space-y-6">
        <h3 className="font-bold text-sm uppercase tracking-wider">Issue Journey</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-6 top-8 bottom-0 w-1 ${
            darkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          
          {/* Timeline items */}
          <div className="space-y-6 relative z-10">
            {timelineStages.map((stage, idx) => {
              const isComplete = isStageComplete(stage.name);
              const isCurrent = isCurrentStage(stage.name);

              return (
                <div key={idx} className="flex gap-6">
                  {/* Stage Dot */}
                  <div className={`h-14 w-14 rounded-full border-2 flex items-center justify-center font-bold text-lg flex-shrink-0 transition-all ${
                    isComplete || isCurrent
                      ? darkMode
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-blue-100 border-blue-500 text-blue-600'
                      : darkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}>
                    {isComplete && !isCurrent ? '✓' : stage.icon}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 pt-2">
                    <h4 className={`font-bold text-lg transition-colors ${
                      isCurrent ? 'text-blue-500' : isComplete ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {stage.name}
                    </h4>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {stage.description}
                    </p>

                    {/* Timeline entry for this stage */}
                    {complaint.timeline?.find(t => t.status === stage.name) && (
                      <TimelineEntry
                        entry={complaint.timeline.find(t => t.status === stage.name)}
                        darkMode={darkMode}
                      />
                    )}

                    {/* Current stage indicator */}
                    {isCurrent && (
                      <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded ${
                        darkMode
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'bg-blue-100 text-blue-600 border border-blue-300'
                      }`}>
                        <Clock className="h-3 w-3" />
                        Current Stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Timeline Events */}
      {complaint.timeline && complaint.timeline.length > 0 && (
        <div className={`p-6 rounded-lg border space-y-4 ${
          darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Full Timeline
          </h3>
          <div className="space-y-3">
            {[...complaint.timeline].reverse().map((entry, idx) => (
              <TimelineEntry key={idx} entry={entry} darkMode={darkMode} full />
            ))}
          </div>
        </div>
      )}

      {/* Notes & Comments */}
      <div className={`p-6 rounded-lg border space-y-4 ${
        darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <h3 className="font-bold text-sm uppercase tracking-wider">Notes & Updates</h3>
        <textarea
          placeholder="Add a comment or note..."
          className={`w-full p-3 rounded-lg border text-sm resize-none ${
            darkMode
              ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
          rows="3"
        />
        <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
          Post Comment
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, darkMode }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} />
      <div>
        <p className={`text-xs font-semibold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          {label}
        </p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function TimelineEntry({ entry, darkMode, full }) {
  return (
    <div className={`p-3 rounded border ${
      darkMode
        ? 'bg-slate-900/50 border-slate-700'
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-bold text-sm text-blue-500">{entry.status}</span>
        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          {new Date(entry.date).toLocaleString()}
        </span>
      </div>
      <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {entry.comment}
      </p>
      {entry.resolutionImage && (
        <img 
          src={entry.resolutionImage} 
          alt="Update" 
          className="mt-3 max-w-sm h-32 object-cover rounded-lg border border-slate-600"
        />
      )}
    </div>
  );
}
