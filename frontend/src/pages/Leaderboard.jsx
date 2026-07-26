import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App.jsx';
import { Trophy, Medal, Search, MapPin, Sparkles, Award, Star, Flame } from 'lucide-react';

export default function Leaderboard() {
  const { darkMode, user } = useContext(AppContext);
  const [boardUsers, setBoardUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('All-Time'); // Weekly, Monthly, All-Time
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setBoardUsers(data);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter users based on search query
  const filteredUsers = boardUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* HEADER HERO */}
      <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border bg-slate-900/40 border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-civic-500/5 to-transparent pointer-events-none"></div>
        
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 border-amber-500/20 text-amber-400">
            <Flame className="h-3 w-3" />
            Vigilance Leaderboard
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Citizen Reputation Hub</h1>
          <p className="text-xs text-slate-400 max-w-md">Rewarding proactive community engagement. Earn reputation points by reporting outages, checking updates, and voting.</p>
        </div>

        {/* User Card Widget */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 w-full sm:w-auto ${
          darkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}>
          <img src={user.avatar} alt="You" className="h-12 w-12 rounded-full border-2 border-civic-500" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Your Standing</span>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-200">{user.name}</span>
              <span className="text-[9px] font-semibold bg-civic-500/10 text-civic-400 px-2 py-0.5 rounded uppercase">{user.level}</span>
            </div>
            <div className="flex gap-3 text-[10px] text-slate-400">
              <span>Points: <strong className="text-amber-400">{user.points} XP</strong></span>
              <span>Badge: <strong className="text-civic-400">{user.badge}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Toggle tabs */}
        <div className={`p-1 rounded-xl border flex gap-1 ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {['Weekly', 'Monthly', 'All-Time'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-civic-600 text-white shadow-lg shadow-civic-600/15'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search citizen or area..."
            className={`w-full text-xs pl-8 pr-4 py-2.5 ${darkMode ? 'glass-input' : 'glass-input-light'}`}
          />
          <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-slate-500" />
        </div>
      </div>

      {/* RANKINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contributor Rank List */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Rankings Feed</h2>
          
          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, i) => {
                const isCurrentUser = u.id === user.id;
                const rank = i + 1;
                
                return (
                  <div 
                    key={u.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${
                      isCurrentUser 
                        ? 'bg-civic-500/10 border-civic-500/30' 
                        : (darkMode ? 'bg-slate-950/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm')
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      
                      {/* Rank Indicator */}
                      <div className="h-6 w-6 rounded-md flex items-center justify-center font-black text-xs shrink-0">
                        {rank === 1 ? <Trophy className="h-4.5 w-4.5 text-yellow-400" /> :
                         rank === 2 ? <Medal className="h-4.5 w-4.5 text-slate-300" /> :
                         rank === 3 ? <Medal className="h-4.5 w-4.5 text-amber-600" /> :
                         <span className="text-slate-500">{rank}</span>}
                      </div>

                      <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full border border-slate-800" />
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-200">{u.name}</h4>
                          {isCurrentUser && (
                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded">You</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3" />
                          {u.area}
                        </span>
                      </div>

                    </div>

                    <div className="flex items-center gap-6 text-right">
                      
                      <div className="hidden sm:block">
                        <span className="block text-[8px] uppercase font-bold text-slate-500">Activity Ratio</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {u.resolvedCount || 0} / {u.reportsCount || 0} Resolved
                        </span>
                      </div>

                      <div>
                        <span className="block text-[8px] uppercase font-bold text-slate-500">Reputation</span>
                        <span className="text-xs font-black text-amber-400">{u.points} XP</span>
                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">No active contributors found.</div>
            )}
          </div>

        </div>

        {/* Tiers / Badges Breakdown */}
        <div className="space-y-6">
          
          <div className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-civic-500">Engagement Tiers</h3>
            
            <div className="space-y-3.5 text-xs">
              <BadgeRow 
                name="Hero Citizen" 
                points="400+ XP" 
                desc="Top tier. Direct communication channels to MLAs and ward committees." 
                icon={<Award className="h-5 w-5 text-yellow-400" />} 
              />
              <BadgeRow 
                name="Silver Responder" 
                points="200-399 XP" 
                desc="Active vigilante status. Immediate ground inspection assignment priorities." 
                icon={<Star className="h-5 w-5 text-slate-300" />} 
              />
              <BadgeRow 
                name="Bronze Observer" 
                points="0-199 XP" 
                desc="Starting level. Standard automated duplicate predictions unlocked." 
                icon={<Star className="h-5 w-5 text-amber-600" />} 
              />
            </div>
          </div>

          <div className={`p-5 rounded-2xl border bg-civic-500/5 border-civic-500/10 text-xs space-y-2.5 ${
            darkMode ? '' : 'shadow-sm'
          }`}>
            <h4 className="font-bold text-civic-400 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              How to score reputation?
            </h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Lodge a verified complaint: <strong className="text-slate-300">+15 XP</strong></li>
              <li>Have your complaint resolved: <strong className="text-slate-300">+50 XP</strong></li>
              <li>Upvote nearby outages: <strong className="text-slate-300">+5 XP</strong></li>
              <li>Post ground comment validations: <strong className="text-slate-300">+2 XP</strong></li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

function BadgeRow({ name, points, desc, icon }) {
  return (
    <div className="flex gap-3.5 items-start">
      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0">
        {icon}
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-200">{name}</span>
          <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.25 rounded">{points}</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
