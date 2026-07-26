import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App.jsx';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Shield, Sparkles, UserCheck, RefreshCw, Eye, CheckSquare, Plus, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

export default function Admin() {
  const { darkMode, addToast } = useContext(AppContext);
  const { token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const [complaints, setComplaints] = useState([]);
  const [selectedQueueIssue, setSelectedQueueIssue] = useState(null);
  
  // Form updates state
  const [updateStatus, setUpdateStatus] = useState('Verified');
  const [officerName, setOfficerName] = useState('Suresh Gowda');
  const [officerDept, setOfficerDept] = useState('BBMP Road Infrastructure Dept');
  const [resolutionUrl, setResolutionUrl] = useState('');
  const [adminComment, setAdminComment] = useState('');

  // Officers Preset Data
  const officerPresets = {
    Roads: { name: 'Suresh Gowda', dept: 'BBMP Road Infrastructure Dept', rank: 'Executive Engineer', phone: '+91 98450 12345' },
    Garbage: { name: 'M. Ramesh', dept: 'BBMP Solid Waste Management Dept', rank: 'Senior Superintendent', phone: '+91 98860 54321' },
    Water: { name: 'S. K. Shivakumar', dept: 'BWSSB Sewerage Operations Board', rank: 'AEE', phone: '+91 99000 54321' },
    Electricity: { name: 'K. R. Kumar', dept: 'BESCOM Electrical Ward 84', rank: 'Assistant Engineer', phone: '+91 99450 99001' },
    Drainage: { name: 'S. K. Shivakumar', dept: 'BWSSB Sewerage Operations Board', rank: 'AEE', phone: '+91 99000 54321' },
    'Public Safety': { name: 'Inspector Girish', dept: 'Bengaluru City Police Sub-Division', rank: 'Sub-Inspector', phone: '+91 94480 22100' }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
        if (data.length > 0) {
          setSelectedQueueIssue(data[0]);
          setUpdateStatus(data[0].status);
          autoSuggestOfficer(data[0].category);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const autoSuggestOfficer = (cat) => {
    const suggestion = officerPresets[cat] || officerPresets.Roads;
    setOfficerName(suggestion.name);
    setOfficerDept(suggestion.dept);
  };

  // Trigger auto-suggestion if selected issue changes
  useEffect(() => {
    if (selectedQueueIssue) {
      setUpdateStatus(selectedQueueIssue.status);
      autoSuggestOfficer(selectedQueueIssue.category);
      setAdminComment('');
      setResolutionUrl('');
    }
  }, [selectedQueueIssue]);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    if (!selectedQueueIssue) return;

    const matchedPreset = officerPresets[selectedQueueIssue.category] || officerPresets.Roads;

    try {
      const res = await fetch(`${API_BASE}/admin/complaints/${selectedQueueIssue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify({
          status: updateStatus,
          officerName: updateStatus === 'Assigned' || updateStatus === 'In Progress' ? officerName : null,
          officerDept: updateStatus === 'Assigned' || updateStatus === 'In Progress' ? officerDept : null,
          officerRank: matchedPreset.rank,
          officerPhone: matchedPreset.phone,
          resolutionImage: updateStatus === 'Resolved' ? (resolutionUrl || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600") : null,
          adminComment: adminComment || `Administrative milestone updated to ${updateStatus}.`
        })
      });

      if (res.ok) {
        const updated = await res.json();
        addToast(`Complaint status updated to ${updateStatus}!`, "success");
        setSelectedQueueIssue(updated);
        // Refresh feed list
        fetchComplaints();
      }
    } catch (err) {
      addToast("Could not submit admin updates.", "warning");
    }
  };

  // --- ANALYTICS DATA GENERATORS ---
  // Category Distributions
  const categoriesCount = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(categoriesCount).map(key => ({
    name: key,
    Incidents: categoriesCount[key]
  }));

  // Status distributions
  const statusesCount = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(statusesCount).map(key => ({
    name: key,
    value: statusesCount[key]
  }));

  const PIE_COLORS = ['#38aef9', '#f59e0b', '#0e94eb', '#a855f7', '#10b981'];

  return (
    <div className="space-y-8 py-4">
      
      {/* HEADER CONTROLS */}
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase bg-red-500/10 border-red-500/20 text-red-400">
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            Security Cleared Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1.5">BBMP Municipal Control Room</h1>
          <p className="text-xs text-slate-400 mt-1">Ward Engineering Queue, Officer Dispatch, and GIS Hotspot Analytics console.</p>
        </div>
        <button 
          onClick={fetchComplaints}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Database
        </button>
      </section>

      {/* CHARTS / ANALYTICS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident distribution Recharts */}
        <div className={`p-5 rounded-2xl border space-y-4 lg:col-span-2 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-400">Incidents by Category</h3>
          <div className="h-56">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={darkMode ? { background: '#0f172a', border: '1px solid #1e293b' } : {}}
                    labelStyle={{ fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px', color: '#0e94eb' }}
                  />
                  <Bar dataKey="Incidents" fill="#0e94eb" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Awaiting data logs...</div>
            )}
          </div>
        </div>

        {/* Resolution status piechart */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-400">Resolution Slicing</h3>
          <div className="h-56 flex items-center justify-center relative">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={darkMode ? { background: '#0f172a', border: '1px solid #1e293b' } : {}}
                    itemStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-xs">Computing slices...</div>
            )}

            {/* Micro legends overlay */}
            <div className="absolute bottom-1 flex flex-wrap gap-2 justify-center text-[9px] text-slate-400 px-2">
              {pieChartData.map((d, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                  <span>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* DISPATCH AND MANAGEMENT QUEUE GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table list queue */}
        <div className={`p-5 rounded-2xl border space-y-4 lg:col-span-2 overflow-x-auto ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-400 border-b border-slate-850 pb-2">Active Engineering Queue</h3>
          
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 dark:border-slate-800 border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="py-2.5">ID</th>
                <th>Title / Category</th>
                <th>Area Ward</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map(c => {
                  const isSelected = selectedQueueIssue?.id === c.id;
                  return (
                    <tr 
                      key={c.id}
                      onClick={() => setSelectedQueueIssue(c)}
                      className={`border-b border-slate-800/40 dark:border-slate-800/45 border-slate-100/40 hover:bg-slate-900/20 dark:hover:bg-slate-900/20 hover:bg-slate-50/50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-civic-500/10' : ''
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-[10px] text-slate-500">{c.id.slice(0, 8)}</td>
                      <td className="py-3 font-semibold pr-3">
                        <span className="block text-slate-200">{c.title}</span>
                        <span className="text-[9px] text-civic-400 font-medium">{c.category}</span>
                      </td>
                      <td>{c.area.split(',')[0]}</td>
                      <td>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          c.severity === 'Severe' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {c.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wide text-civic-400`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Queue is clear! Nice work.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dispatch Action Panel */}
        <div className={`p-5 rounded-2xl border space-y-6 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          {selectedQueueIssue ? (
            <form onSubmit={handleAdminUpdate} className="space-y-4 animate-fade-in text-xs">
              <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-400 border-b border-slate-850 pb-2">
                Action Center: {selectedQueueIssue.id.slice(0, 8)}
              </h3>
              
              <div className="space-y-1">
                <span className="block text-[9px] font-bold uppercase text-slate-500">Complaint Context</span>
                <span className="block font-bold text-slate-350">{selectedQueueIssue.title}</span>
                <p className="text-[10px] text-slate-450 line-clamp-2 leading-relaxed">{selectedQueueIssue.description}</p>
              </div>

              {/* Status Update Dropdown */}
              <div className="space-y-2">
                <label className="block text-[9px] font-bold uppercase text-slate-500">Set Operational Status</label>
                <select 
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Conditional inputs: Assigned details */}
              {(updateStatus === 'Assigned' || updateStatus === 'In Progress') && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 dark:border-slate-800 border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-slate-500">AI Suggested Officer</span>
                    <input 
                      type="text" 
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      placeholder="Officer Name"
                      className="w-full bg-transparent border-b border-slate-800 py-1 text-slate-200 focus:border-civic-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-slate-500">Department</span>
                    <input 
                      type="text" 
                      value={officerDept}
                      onChange={(e) => setOfficerDept(e.target.value)}
                      placeholder="Department"
                      className="w-full bg-transparent border-b border-slate-800 py-1 text-slate-200 focus:border-civic-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional inputs: Resolution details */}
              {updateStatus === 'Resolved' && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 dark:border-slate-800 border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-slate-500">Verification Photo URL</span>
                    <input 
                      type="text" 
                      value={resolutionUrl}
                      onChange={(e) => setResolutionUrl(e.target.value)}
                      placeholder="Proof image URL (or leaves blank for preset)"
                      className="w-full bg-transparent border-b border-slate-800 py-1 text-slate-200 focus:border-civic-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Milestone Comment text */}
              <div className="space-y-2">
                <label className="block text-[9px] font-bold uppercase text-slate-500">Timeline Dispatch Notes</label>
                <textarea 
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Inspector comments, asphalt truck dispatch status, or resolution logs..."
                  rows={2}
                  className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
                />
              </div>

              {/* Submit triggers */}
              <button 
                type="submit"
                className="w-full py-2.5 bg-civic-600 hover:bg-civic-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                Commit operational changes
              </button>

              <div className="mt-6 p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
                <h4 className="font-semibold uppercase text-[10px] text-slate-400 mb-3">Issue Activity Stream</h4>
                {selectedQueueIssue.timeline?.length > 0 ? (
                  <div className="space-y-3 text-[11px] text-slate-300">
                    {selectedQueueIssue.timeline.map((event, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 p-3 bg-slate-900/60">
                        <div className="flex items-center justify-between gap-3 text-slate-400 mb-1">
                          <span>{event.status}</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <p>{event.comment}</p>
                        {event.resolutionImage && (
                          <p className="text-[10px] text-emerald-300 mt-2">Proof URL: {event.resolutionImage}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px]">No activity items yet. Use the form above to add operational updates.</p>
                )}
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-slate-550 text-xs">Select an active queue issue from the table list to trigger dispatches.</div>
          )}
        </div>

      </section>

    </div>
  );
}
