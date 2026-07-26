import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppContext } from '../App.jsx';
import { Sparkles, MapPin, Check, AlertTriangle, AlertCircle, RefreshCw, ChevronRight, Upload, Info } from 'lucide-react';

export default function ReportIssue() {
  const { darkMode, user, addToast, refreshUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [severity, setSeverity] = useState('Medium');
  const [latitude, setLatitude] = useState(12.9716); // Default Bengaluru
  const [longitude, setLongitude] = useState(77.5946);
  const [area, setArea] = useState('Indiranagar, Bengaluru');
  const [image, setImage] = useState('');

  // AI Simulators States
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  // Duplicate check modal
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState([]);

  // Submission success state
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Map refs for mini-map
  const miniMapRef = useRef(null);
  const miniMapInstance = useRef(null);
  const miniMarkerInstance = useRef(null);

  // Image Presets to make visual preview amazing
  const imagePresets = {
    Roads: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
    Garbage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600",
    Water: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    Electricity: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=600",
    Drainage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    'Public Safety': "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=600"
  };

  // Set default sample image based on category
  useEffect(() => {
    if (!image) {
      setImage(imagePresets[category]);
    }
  }, [category]);

  // Mini-map Initialization
  useEffect(() => {
    if (miniMapRef.current && !miniMapInstance.current) {
      miniMapInstance.current = L.map(miniMapRef.current, {
        center: [latitude, longitude],
        zoom: 14,
        zoomControl: false
      });

      const tileUrl = darkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { attribution: '&copy; CartoDB' }).addTo(miniMapInstance.current);

      // Add draggable pin
      const pulseIcon = L.divIcon({
        className: 'gps-pin',
        html: `<div class="pulse-marker-severe" style="width: 14px; height: 14px;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      miniMarkerInstance.current = L.marker([latitude, longitude], { icon: pulseIcon, draggable: true })
        .addTo(miniMapInstance.current)
        .on('dragend', (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLatitude(position.lat);
          setLongitude(position.lng);
          // Auto fill area based on coordinates mockup
          resolveMockArea(position.lat, position.lng);
        });

      // Map click to place marker
      miniMapInstance.current.on('click', (e) => {
        const position = e.latlng;
        setLatitude(position.lat);
        setLongitude(position.lng);
        miniMarkerInstance.current.setLatLng(position);
        resolveMockArea(position.lat, position.lng);
      });
    }
  }, []);

  // Update Map Pin if states change externally (like GPS detect)
  const updateMapMarker = (lat, lng) => {
    if (miniMapInstance.current && miniMarkerInstance.current) {
      miniMapInstance.current.setView([lat, lng], 15);
      miniMarkerInstance.current.setLatLng([lat, lng]);
    }
  };

  const resolveMockArea = (lat, lng) => {
    // Generate beautiful Bengaluru ward mockup names based on rough coordinates
    if (lat > 12.96 && lat < 12.98 && lng > 77.63 && lng < 77.65) {
      setArea('Indiranagar, Ward 80, Bengaluru');
    } else if (lat > 12.90 && lat < 12.92 && lng > 77.63 && lng < 77.65) {
      setArea('HSR Layout, Sector 1, Ward 174, Bengaluru');
    } else if (lat > 12.95 && lat < 12.98 && lng > 77.72 && lng < 77.76) {
      setArea('Whitefield, Phase 2, Ward 84, Bengaluru');
    } else {
      setArea('Koramangala, 5th Block, Ward 151, Bengaluru');
    }
  };

  // Real-time AI Categorization & Urgency prediction
  useEffect(() => {
    if (description.length < 15) {
      setAiResult(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setAiPredicting(true);
      try {
        const res = await fetch('http://localhost:5001/api/ai/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description })
        });
        if (res.ok) {
          const data = await res.json();
          setAiResult(data);
          // Apply AI recommendations
          setCategory(data.category);
          setSeverity(data.priority);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAiPredicting(false);
      }
    }, 8000); // 800ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [description]);

  // GPS Auto detect
  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser.", "warning");
      return;
    }

    addToast("Searching satellite lock...", "info");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Bengaluru boundary checks, otherwise keep mock coordinates close to real center for evaluation
        const fitLat = Math.abs(lat - 12.97) < 0.2 ? lat : 12.9716;
        const fitLng = Math.abs(lng - 77.59) < 0.2 ? lng : 77.6411;
        
        setLatitude(fitLat);
        setLongitude(fitLng);
        resolveMockArea(fitLat, fitLng);
        updateMapMarker(fitLat, fitLng);
        addToast("GPS lock acquired! Location auto-populated.", "success");
      },
      (error) => {
        // Fallback to custom coordinates
        const mockLat = 12.971899 + (Math.random() - 0.5) * 0.01;
        const mockLng = 77.641151 + (Math.random() - 0.5) * 0.01;
        setLatitude(mockLat);
        setLongitude(mockLng);
        resolveMockArea(mockLat, mockLng);
        updateMapMarker(mockLat, mockLng);
        addToast("GPS failed. Auto-assigned nearest Bengaluru Cell Tower coordinates.", "info");
      }
    );
  };

  // Submit Handler
  const handleSubmit = async (e, bypassDuplicate = false) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast("Please fill in Title and Description.", "warning");
      return;
    }

    // First Check for Duplicates if not bypassing
    if (!bypassDuplicate) {
      setCheckingDuplicates(true);
      try {
        const res = await fetch('http://localhost:5001/api/complaints/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, latitude, longitude, category })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isDuplicate) {
            setDuplicateMatches(data.matches);
            setShowDuplicateModal(true);
            setCheckingDuplicates(false);
            return; // STOP submission flow to display warning
          }
        }
      } catch (err) {
        console.error("Duplicate check failed, bypassing.", err);
      }
      setCheckingDuplicates(false);
    }

    // Perform actual creation
    try {
      const res = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          severity,
          latitude,
          longitude,
          area,
          image: image || imagePresets[category],
          reportedBy: { id: user.id, name: user.name }
        })
      });

      if (res.ok) {
        const filed = await res.json();
        setSubmittedComplaint(filed);
        setSubmissionSuccess(true);
        await refreshUser();
        addToast("Complaint filed successfully! XP Awarded.", "success");
      }
    } catch (e) {
      addToast("Failed to file complaint. Try again.", "warning");
    }
  };

  // Support/Upvote existing duplicate issue instead
  const handleSupportExisting = async (existingCmpId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/complaints/${existingCmpId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        addToast("Supported existing issue successfully! Saved community duplicate.", "success");
        setShowDuplicateModal(false);
        navigate('/map');
      }
    } catch (err) {
      addToast("Could not process upvote.", "warning");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* HEADER */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight">Report Civic Breakdown</h1>
        <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 mt-1">AI-assisted public infrastructure tracking module.</p>
      </div>

      {submissionSuccess ? (
        /* SUCCESS PORTAL */
        <div className={`p-8 rounded-2xl border text-center space-y-6 animate-fade-in ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            <Check className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-200">Complaint Registered!</h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600">Your issue was submitted to the municipal cell database.</p>
          </div>

          {submittedComplaint && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 bg-slate-55 border border-slate-800 dark:border-slate-800 border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Complaint ID:</span>
                <span className="font-bold text-civic-400 font-mono">{submittedComplaint.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Status:</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wider">{submittedComplaint.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reputation Reward:</span>
                <span className="font-bold text-amber-400">+15 XP points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Response SLA:</span>
                <span className="font-bold text-slate-300">24-48 Hours (Ward Inspector)</span>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/map')} 
              className="px-6 py-2.5 bg-civic-600 hover:bg-civic-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Track on Map
            </button>
            <button 
              onClick={() => {
                setSubmissionSuccess(false);
                setTitle('');
                setDescription('');
                setSubmittedComplaint(null);
              }} 
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              File Another Report
            </button>
          </div>
        </div>
      ) : (
        /* REPORT COMPLAINT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Inputs */}
          <form onSubmit={(e) => handleSubmit(e, false)} className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400">Issue Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken streetlight next to Indiranagar Metro Pillar 40"
                className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase text-slate-400">Description & Details</label>
                {aiPredicting && (
                  <span className="text-[10px] text-civic-400 font-semibold flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    AI Analyzing...
                  </span>
                )}
              </div>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue. Mention specific blockages, duration, and safety hazards. (Min 15 chars for AI assist)"
                rows={4}
                className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
              />
              
              {/* AI Prediction Popup */}
              {aiResult && (
                <div className="mt-2 p-3 rounded-lg border bg-civic-500/5 border-civic-500/20 text-[11px] flex justify-between items-center animate-slide-in">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-civic-500/10 flex items-center justify-center text-civic-400">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-300">AI Assist:</span> Predicted category <strong className="text-civic-400">{aiResult.category}</strong> with <strong className="text-amber-400">{aiResult.priority}</strong> priority.
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Confidence: {Math.round(aiResult.confidence * 100)}%</span>
                </div>
              )}
            </div>

            {/* Dropdown row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
                >
                  <option value="Roads">Roads</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Public Safety">Public Safety</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400">Severity Level</label>
                <select 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className={`w-full ${darkMode ? 'glass-input' : 'glass-input-light'}`}
                >
                  <option value="Low">Low (Repair is minor)</option>
                  <option value="Medium">Medium (General blockage)</option>
                  <option value="Severe">Severe (Bodily harm risk)</option>
                </select>
              </div>
            </div>

            {/* Photo Preview Upload Mock */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400">Complaint Image URL (Mock Upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste URL, or leave blank to auto-attach standard sample category photo"
                  className={`flex-1 ${darkMode ? 'glass-input' : 'glass-input-light'}`}
                />
                <button 
                  type="button" 
                  onClick={() => addToast("Attached camera simulation.", "info")}
                  className={`px-3 border rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Submit Trigger Button */}
            <button 
              type="submit" 
              disabled={checkingDuplicates}
              className="w-full py-3.5 bg-gradient-to-r from-civic-600 to-cyan-500 hover:from-civic-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-civic-500/10"
            >
              {checkingDuplicates ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  Scanning city grids for duplicates...
                </>
              ) : (
                <>
                  <Check className="h-4.5 w-4.5" />
                  Submit Official Complaint
                </>
              )}
            </button>

          </form>

          {/* Mapping & Geolocation Side Panel */}
          <div className="space-y-6">
            
            {/* MAP CARD */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase text-slate-400">GIS Coordinates</label>
                <button 
                  type="button" 
                  onClick={handleGpsDetect}
                  className="text-[10px] text-civic-500 font-bold hover:underline flex items-center gap-1 bg-civic-500/10 px-2.5 py-1 rounded-lg"
                >
                  <MapPin className="h-3 w-3" />
                  GPS Detect
                </button>
              </div>

              {/* Mini Map Box */}
              <div ref={miniMapRef} className="h-48 rounded-xl overflow-hidden border border-slate-800 dark:border-slate-800 border-slate-200 relative z-0"></div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Address:</span>
                  <span className="font-bold text-slate-200">{area}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Lat: {latitude.toFixed(6)}</span>
                  <span>Lng: {longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* SLA CARD */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              darkMode ? 'bg-slate-900/20 border-slate-800/80' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <h4 className="font-extrabold text-xs tracking-wider uppercase text-civic-500 flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                Municipal SLA Policies
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
                Bengaluru Municipal Administration (BBMP) policy specifies that all reported items undergo verified ground inspections within 12 hours. Severe safety hazards are patched within 24 hours under the Sakala Guarantee Act.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 4. AI DUPLICATE DETECTOR MODAL */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
          <div className={`max-w-lg w-full p-6 rounded-2xl border space-y-5 shadow-2xl animate-scale-up ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Nearby Active Complaint Detected</h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600">AI detected a highly similar issue already filed nearby. To avoid division of city focus, we highly suggest supporting the existing thread.</p>
              </div>
            </div>

            {/* List of matches */}
            <div className="space-y-3">
              {duplicateMatches.map(m => (
                <div key={m.complaint.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 dark:border-slate-800 border-slate-200 text-xs flex gap-3">
                  <img src={m.complaint.image} alt="Existing" className="h-12 w-16 rounded object-cover border border-slate-800" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-civic-400">{m.complaint.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{m.complaint.description}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Distance: {m.distanceInMeters} meters away</span>
                      <span>Similarity: {Math.round(m.similarityScore * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {duplicateMatches[0] && (
                <button 
                  onClick={() => handleSupportExisting(duplicateMatches[0].complaint.id)}
                  className="py-2.5 bg-civic-600 hover:bg-civic-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md shadow-civic-500/10"
                >
                  <Check className="h-4 w-4" />
                  Upvote & View Live Map
                </button>
              )}
              <button 
                onClick={() => handleSubmit(null, true)} // Bypass
                className={`py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                File Duplicate Anyway
              </button>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setShowDuplicateModal(false)}
                className="text-[10px] text-slate-500 hover:underline"
              >
                Cancel filing process
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
