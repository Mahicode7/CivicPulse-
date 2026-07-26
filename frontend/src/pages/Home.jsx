import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ArrowRight, MapPin, CheckCircle, Activity, Users, Flame, ShieldAlert, Sparkles, Droplets, Trash2, Zap, AlertCircle, Wrench, Shield } from 'lucide-react';

export default function Home() {
  const { darkMode } = useContext(AppContext);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 342,
    resolved: 218,
    active: 1104,
    today: 14
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/complaints');
        if (res.ok) {
          const data = await res.json();
          setComplaints(data.slice(0, 5)); // Show top 5
          // Calculate basic stats
          const resolved = data.filter(c => c.status === 'Resolved').length + 215; // Seeded shift
          setStats(prev => ({
            ...prev,
            total: data.length + 338,
            resolved,
            active: 1104 + Math.round(data.length * 1.5)
          }));
        }
      } catch (err) {
        // Handle offline fallback
      }
    };
    
    fetchComplaints();
  }, []);

  const categories = [
    { name: 'Roads', count: 124, icon: <Flame className="h-6 w-6 text-red-500" />, desc: 'Potholes, broken dividers, road damage.' },
    { name: 'Garbage', count: 87, icon: <Trash2 className="h-6 w-6 text-orange-500" />, desc: 'Illegal dumping, public waste pileup.' },
    { name: 'Water', count: 54, icon: <Droplets className="h-6 w-6 text-blue-500" />, desc: 'Pipe leakage, flooded streets, sewage.' },
    { name: 'Electricity', count: 43, icon: <Zap className="h-6 w-6 text-yellow-500" />, desc: 'Broken streetlights, hanging wires.' },
    { name: 'Drainage', count: 28, icon: <Wrench className="h-6 w-6 text-purple-500" />, desc: 'Clogged manholes, sewage backflow.' },
    { name: 'Public Safety', count: 19, icon: <Shield className="h-6 w-6 text-emerald-500" />, desc: 'Unlit alleys, unsafe junctions.' }
  ];

  return (
    <div className="space-y-16 py-4">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 border bg-slate-900/40 border-slate-800/80 shadow-2xl flex flex-col items-center text-center max-w-7xl mx-auto">
        {/* Futuristic glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-civic-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-civic-500/5 blur-3xl pointer-events-none"></div>
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wider uppercase mb-6 bg-civic-500/10 border-civic-500/20 text-civic-400">
          <Sparkles className="h-3 w-3 animate-spin" />
          Empowering Communities through Tech
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-3xl leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 dark:from-white dark:via-slate-100 dark:to-slate-400 from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Report Issues. <br />
          <span className="bg-gradient-to-r from-civic-400 to-cyan-400 bg-clip-text text-transparent">Improve Your City.</span>
        </h1>
        
        <p className="mt-6 text-sm sm:text-base text-slate-400 dark:text-slate-400 text-slate-600 max-w-xl leading-relaxed">
          Bridging the gap between active citizens and municipal officials. Pinpoint public infrastructure failures, gather community upvotes, and monitor live resolutions on our interactive map.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link 
            to="/report" 
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-civic-600 to-cyan-500 hover:from-civic-500 hover:to-cyan-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-civic-600/25 transition-all duration-300 hover:scale-[1.02]"
          >
            <AlertCircle className="h-4.5 w-4.5" />
            Report Issue Now
          </Link>
          <Link 
            to="/map" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 dark:border-slate-800 border-slate-300 bg-slate-900/20 dark:bg-slate-900/20 bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800/40 text-slate-300 dark:text-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
          >
            <MapPin className="h-4.5 w-4.5" />
            View Live City Map
          </Link>
        </div>
      </section>

      {/* 2. CORE STATISTICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issues Filed" value={stats.total} icon={<Activity className="h-5 w-5 text-civic-400" />} />
        <StatCard title="Resolved Complaints" value={stats.resolved} icon={<CheckCircle className="h-5 w-5 text-emerald-400" />} suffix={` (${Math.round((stats.resolved/stats.total)*100)}%)`} />
        <StatCard title="Registered Citizens" value={stats.active} icon={<Users className="h-5 w-5 text-cyan-400" />} />
        <StatCard title="Reports Lodged Today" value={stats.today} icon={<Flame className="h-5 w-5 text-orange-400" />} />
      </section>

      {/* 3. CIVIC CATEGORIES */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Active Civic Channels</h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 mt-1">Select a category to view active municipal issues, reports, and details.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                darkMode 
                  ? 'bg-slate-900/40 border-slate-800 hover:border-civic-500/30' 
                  : 'bg-white border-slate-200 hover:border-civic-400/40 shadow-sm'
              }`}
            >
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-950/80 border border-slate-800' : 'bg-slate-100'}`}>
                {cat.icon}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm">{cat.name}</h3>
                  <span className="text-[10px] font-semibold bg-civic-500/10 text-civic-400 px-2.5 py-0.5 rounded-full">{cat.count} Active</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RECENT LIVE FEED */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scrolling Feeds */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Live Activity Monitor</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 mt-1">Real-time reporting streams across Municipal Wards.</p>
            </div>
            <Link to="/map" className="text-xs font-semibold text-civic-500 hover:underline flex items-center gap-1">
              View Map Feed
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {complaints.length > 0 ? (
              complaints.map(c => {
                const severityColor = c.severity === 'Severe' ? 'bg-red-500 text-red-500' : c.severity === 'Medium' ? 'bg-yellow-500 text-yellow-500' : 'bg-emerald-500 text-emerald-500';
                const severityBg = c.severity === 'Severe' ? 'bg-red-500/10 border-red-500/20' : c.severity === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
                
                return (
                  <div 
                    key={c.id} 
                    className={`p-4 rounded-xl border flex gap-4 transition-all duration-200 relative overflow-hidden group ${
                      darkMode ? 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50' : 'bg-white border-slate-200 shadow-sm hover:bg-slate-50'
                    }`}
                  >
                    {/* Severity Level Left Border Indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      c.severity === 'Severe' ? 'bg-red-500' : c.severity === 'Medium' ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}></div>
                    
                    <img src={c.image} alt={c.title} className="h-16 w-20 rounded-lg object-cover bg-slate-950 border border-slate-800 dark:border-slate-800 border-slate-200" />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-xs line-clamp-1">{c.title}</h4>
                          {/* Severity Badge */}
                          <div className="flex gap-2 items-center mt-1">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase border ${
                              c.severity === 'Severe' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                              c.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {c.severity}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase border ${
                              c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              c.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3" />
                          {c.area}
                        </span>
                        <span className="font-medium">{c.votes?.length || 0} upvotes</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Connecting to live stream...
              </div>
            )}
          </div>
        </div>

        {/* Testimonials Sidebar */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className="font-extrabold text-sm tracking-wide uppercase text-civic-500">Citizen Impact Story</h3>
            <div className="mt-4 space-y-4">
              <span className="text-3xl font-serif text-civic-500">“</span>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-700 italic leading-relaxed">
                "Our street had two broken lights and was pitch dark for months. I reported it on CivicPulse on Tuesday. By Thursday morning, BESCOM crews had verified, assigned and completed replacing the bulbs! The visual tracking was incredible."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" 
                  alt="Citizen" 
                  className="h-9 w-9 rounded-full border border-slate-800 dark:border-slate-800 border-slate-200" 
                />
                <div>
                  <h4 className="font-bold text-xs">Meera Nair</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-600">HSR Layout Sector 1</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-civic-500/5 border border-civic-500/10 text-center">
            <h4 className="font-bold text-xs text-civic-400">Join the Citizen Watch</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 text-slate-600 mt-1">Get points, track issues, and make a real impact on Bengaluru's infrastructure.</p>
            <Link 
              to="/profile" 
              className="mt-3 block w-full py-2 bg-civic-600 hover:bg-civic-500 text-white rounded-lg text-[11px] font-bold transition-colors"
            >
              Set Up My Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-800 dark:border-slate-800 border-slate-200 pt-8 pb-4 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-semibold text-slate-300 dark:text-slate-300 text-slate-800">CivicPulse Dashboard</span> © 2026. Urban Development Initiative.
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">About Project</a>
          <a href="#" className="hover:underline">Municipal SLA Policies</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Authorities</a>
        </div>
      </footer>

    </div>
  );
}

function StatCard({ title, value, icon, suffix = '' }) {
  return (
    <div className="p-5 rounded-2xl border bg-slate-900/30 dark:bg-slate-900/30 bg-white border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wide">{title}</span>
        <h3 className="text-2xl font-black tracking-tight">{value}<span className="text-xs text-slate-400 font-medium">{suffix}</span></h3>
      </div>
      <div className="p-2.5 rounded-xl bg-slate-950/65 dark:bg-slate-950/65 bg-slate-100 border border-slate-800 dark:border-slate-800 border-slate-200">
        {icon}
      </div>
    </div>
  );
}
