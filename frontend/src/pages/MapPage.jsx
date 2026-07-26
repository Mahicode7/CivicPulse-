import React, { useState, useEffect, useRef, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppContext } from '../App.jsx';
import { MapPin, AlertCircle, ThumbsUp, MessageSquare, ShieldAlert, Sparkles, Filter, SlidersHorizontal, Calendar, X, Send } from 'lucide-react';

export default function MapPage() {
  const { darkMode, user, addToast } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Comments state for drawer
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Filter States
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showHeatmap, setShowHeatmap] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const heatmapLayerRef = useRef([]);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
        setFilteredComplaints(data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Fetch comments when issue changes
  useEffect(() => {
    if (selectedIssue) {
      fetchComments(selectedIssue.id);
    }
  }, [selectedIssue]);

  const fetchComments = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Centered on Central Bengaluru (Indiranagar/MG Road coordinates)
      mapInstance.current = L.map(mapRef.current, {
        center: [12.9716, 77.5946],
        zoom: 13,
        zoomControl: false
      });

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
    }

    // Set Dark Matter or Light Carto Tiles based on theme
    const tileUrl = darkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // Remove existing tile layer if any
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      attribution: '&copy; CartoDB'
    }).addTo(mapInstance.current);

    return () => {
      // Leaflet cleanup handled in unmount
    };
  }, [darkMode]);

  // Update map markers whenever complaints filtered or loaded
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
    markersRef.current = [];

    // Clear old heatmap circles
    heatmapLayerRef.current.forEach(layer => mapInstance.current.removeLayer(layer));
    heatmapLayerRef.current = [];

    // Add markers
    filteredComplaints.forEach((cmp) => {
      // Define custom glowing marker icon based on severity
      const size = 16;
      let markerClass = 'pulse-marker-medium';
      if (cmp.status === 'Resolved') {
        markerClass = 'pulse-marker-resolved';
      } else if (cmp.severity === 'Severe') {
        markerClass = 'pulse-marker-severe';
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="${markerClass}" style="width: ${size}px; height: ${size}px;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      const marker = L.marker([cmp.latitude, cmp.longitude], { icon: customIcon })
        .addTo(mapInstance.current)
        .on('click', () => {
          setSelectedIssue(cmp);
          mapInstance.current.setView([cmp.latitude - 0.002, cmp.longitude], 15, { animate: true }); // Shift center slightly up to view details card nicely
        });

      markersRef.current.push(marker);

      // Populate Heatmap circles if active
      if (showHeatmap && cmp.status !== 'Resolved') {
        const radius = cmp.severity === 'Severe' ? 180 : 120;
        const color = cmp.severity === 'Severe' ? '#ef4444' : '#f59e0b';
        
        const circle = L.circle([cmp.latitude, cmp.longitude], {
          radius: radius,
          fillColor: color,
          fillOpacity: 0.15,
          color: color,
          weight: 1.5,
          dashArray: '4'
        }).addTo(mapInstance.current);

        heatmapLayerRef.current.push(circle);
      }
    });

    // Auto fit bounds if complaints exist
    if (filteredComplaints.length > 0 && !selectedIssue) {
      const group = new L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredComplaints, showHeatmap]);

  // Apply filters
  useEffect(() => {
    let result = complaints;

    if (filterCategory !== 'All') {
      result = result.filter(c => c.category.toLowerCase() === filterCategory.toLowerCase());
    }

    if (filterSeverity !== 'All') {
      result = result.filter(c => c.severity.toLowerCase() === filterSeverity.toLowerCase());
    }

    if (filterStatus !== 'All') {
      result = result.filter(c => c.status.toLowerCase() === filterStatus.toLowerCase());
    }

    setFilteredComplaints(result);
  }, [filterCategory, filterSeverity, filterStatus, complaints]);

  // Handle Upvoting
  const handleUpvote = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local complaint details
        setSelectedIssue(prev => ({ ...prev, votes: data.votes }));
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, votes: data.votes } : c));
        addToast(data.votes.includes(user.id) ? "Upvoted issue! +5 Reputation earned." : "Vote retracted.", "success");
      }
    } catch (e) {
      addToast("Failed to process upvote.", "warning");
    }
  };

  // Handle posting comments
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${selectedIssue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          avatar: user.avatar,
          text: newComment
        })
      });
      if (res.ok) {
        const added = await res.json();
        setComments(prev => [...prev, added]);
        setSelectedIssue(prev => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
        setComplaints(prev => prev.map(c => c.id === selectedIssue.id ? { ...c, commentsCount: (c.commentsCount || 0) + 1 } : c));
        setNewComment('');
        addToast("Comment posted successfully! +2 XP", "success");
      }
    } catch (e) {
      addToast("Could not send comment.", "warning");
    }
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-slate-800 dark:border-slate-800 border-slate-200">
      
      {/* 1. MAP CANVAS CONTAINER */}
      <div ref={mapRef} className="absolute inset-0 z-0"></div>

      {/* 2. TOP FILTER BAR */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2.5 items-center justify-between pointer-events-none">
        
        {/* Dropdowns */}
        <div className={`p-2.5 rounded-xl border flex flex-wrap gap-2 pointer-events-auto shadow-2xl backdrop-blur-md ${
          darkMode ? 'bg-slate-900/90 border-slate-800/80 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-800 pr-3">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>

          {/* Category Dropdown */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent border-0 text-xs font-semibold focus:ring-0 outline-none cursor-pointer text-civic-400"
          >
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Drainage">Drainage</option>
            <option value="Public Safety">Public Safety</option>
          </select>

          {/* Severity Dropdown */}
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-transparent border-0 text-xs font-semibold focus:ring-0 outline-none cursor-pointer text-orange-400"
          >
            <option value="All">All Severities</option>
            <option value="Severe">Severe</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Dropdown */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-0 text-xs font-semibold focus:ring-0 outline-none cursor-pointer text-emerald-400"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Advanced Heatmap Toggle */}
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`pointer-events-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl transition-all duration-200 border ${
            showHeatmap 
              ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white border-transparent'
              : (darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white/95 border-slate-200 text-slate-700 hover:bg-slate-50')
          }`}
        >
          <Sparkles className={`h-4 w-4 ${showHeatmap ? 'animate-pulse' : ''}`} />
          {showHeatmap ? 'Disable Hotzones' : 'Density Heatmap'}
        </button>

      </div>

      {/* 3. RIGHT SIDEBAR - STATISTICS PANEL */}
      <div className={`absolute right-4 top-4 z-10 rounded-2xl border p-5 shadow-2xl backdrop-blur-lg w-72 max-h-[calc(100vh-200px)] overflow-y-auto ${
        darkMode ? 'bg-slate-950/90 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
      }`}>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight">Ward Overview</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time status across wards</p>
          </div>

          {/* Severity Stats */}
          <div className="space-y-2">
            {[
              { label: 'Severe Issues', count: complaints.filter(c => c.severity === 'Severe').length, color: 'bg-red-500', textColor: 'text-red-400' },
              { label: 'Medium Priority', count: complaints.filter(c => c.severity === 'Medium').length, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
              { label: 'Resolved', count: complaints.filter(c => c.status === 'Resolved').length, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
              { label: 'In Progress', count: complaints.filter(c => c.status === 'In Progress').length, color: 'bg-blue-500', textColor: 'text-blue-400' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">{stat.label}</span>
                  <span className={`font-bold ${stat.textColor}`}>{stat.count}</span>
                </div>
                <div className={`h-2 rounded-full ${stat.color} opacity-20`} style={{ width: `${(stat.count / complaints.length) * 100}%` }}></div>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          <div className="border-t border-slate-800/50 dark:border-slate-800/50 border-slate-100 pt-4">
            <h4 className="font-bold text-xs mb-2 text-slate-400">By Category</h4>
            <div className="space-y-1.5 text-xs">
              {['Roads', 'Garbage', 'Water', 'Electricity', 'Drainage', 'Public Safety'].map(cat => {
                const count = complaints.filter(c => c.category === cat).length;
                return count > 0 ? (
                  <div key={cat} className="flex justify-between items-center">
                    <span className="text-slate-400">{cat}</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-900/50 border border-slate-800/50">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Last Updated */}
          <div className="border-t border-slate-800/50 dark:border-slate-800/50 border-slate-100 pt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live data updated now
            </span>
          </div>
        </div>
      </div>

      {/* 4. FLOATING DETAILS DRAWER (ON ISSUES CLICKED) */}
      {selectedIssue && (
        <div className={`absolute left-4 top-20 bottom-4 w-96 z-20 rounded-2xl border p-5 flex flex-col justify-between shadow-2xl backdrop-blur-lg animate-fade-in ${
          darkMode ? 'bg-slate-950/90 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
        }`}>
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 dark:border-slate-800 border-slate-100 pb-3">
            <div>
              <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                selectedIssue.severity === 'Severe' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 
                selectedIssue.severity === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
              }`}>
                {selectedIssue.severity} urgency
              </span>
              <h2 className="font-bold text-sm mt-2 leading-snug pr-3">{selectedIssue.title}</h2>
            </div>
            <button 
              onClick={() => setSelectedIssue(null)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-900/20"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Scrolling Details Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <img src={selectedIssue.image} alt={selectedIssue.title} className="w-full h-36 object-cover rounded-xl border border-slate-800 dark:border-slate-800 border-slate-100 bg-slate-950" />
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Description</span>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">{selectedIssue.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                <span className="block text-[9px] uppercase font-bold text-slate-500 mb-1">BBMP/BESCOM Lead</span>
                <span className="font-bold text-slate-300">{selectedIssue.assignedOfficer?.name || 'Awaiting assignment'}</span>
                <span className="block text-[9px] text-slate-500 mt-0.5">{selectedIssue.assignedOfficer?.rank || 'Assigned soon'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                <span className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Local constituency</span>
                <span className="font-bold text-slate-300">{selectedIssue.mlaDetails?.name || 'Local MLA'}</span>
                <span className="block text-[9px] text-slate-500 mt-0.5">{selectedIssue.mlaDetails?.constituency || 'Ward Assembly'}</span>
              </div>
            </div>

            {/* UPVOTE & STATUS ROW */}
            <div className="flex items-center justify-between border-y border-slate-800 dark:border-slate-800 border-slate-100 py-3">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleUpvote(selectedIssue.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all duration-200 ${
                    selectedIssue.votes.includes(user.id)
                      ? 'bg-civic-500 border-transparent text-white'
                      : 'bg-transparent border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {selectedIssue.votes.length} Supports
                </button>
              </div>

              <div className="text-right">
                <span className="block text-[9px] uppercase font-bold text-slate-500">Status</span>
                <span className="text-xs font-bold text-civic-400">{selectedIssue.status}</span>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-civic-500" />
                Comments ({comments.length})
              </h3>
              
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {comments.length > 0 ? (
                  comments.map(cmt => (
                    <div key={cmt.id} className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-[11px] space-y-1">
                      <div className="flex justify-between items-center text-slate-400 font-bold">
                        <span>{cmt.userName}</span>
                        <span className="text-[9px] font-normal">{new Date(cmt.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{cmt.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 text-[10px] py-4">No comments posted yet. Ask for progress!</div>
                )}
              </div>

              {/* POST COMMENT FORM */}
              <form onSubmit={handlePostComment} className="flex gap-1.5">
                <input 
                  type="text" 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask for updates or add details..."
                  className="flex-1 bg-slate-900/80 border border-slate-850 dark:border-slate-800 border-slate-200 text-xs px-3 rounded-lg outline-none focus:border-civic-500 text-slate-100" 
                />
                <button 
                  type="submit" 
                  className="h-8 w-8 rounded-lg bg-civic-600 hover:bg-civic-500 text-white flex items-center justify-center transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
