import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  User, Award, MapPin, ClipboardList, CheckCircle2, ChevronRight, Activity, Calendar, 
  ExternalLink, Edit2, Phone, Mail, Home, Badge, TrendingUp, Zap, Heart, Share2, 
  MessageSquare, Star, AlertCircle, FileText, Users, Target, Trophy, Flame, Crown, Gift 
} from 'lucide-react';
import DashboardOverview from '../components/profile/DashboardOverview';
import IssueStatistics from '../components/profile/IssueStatistics';
import MyIssuesSection from '../components/profile/MyIssuesSection';
import IssueTracker from '../components/profile/IssueTracker';
import LeaderboardSection from '../components/profile/LeaderboardSection';
import AchievementsSection from '../components/profile/AchievementsSection';
import NotificationsPanel from '../components/profile/NotificationsPanel';
import ActivityHistory from '../components/profile/ActivityHistory';
import StaffView from '../components/profile/StaffView';
import RewardsDashboard from '../components/profile/RewardsDashboard';

export default function Profile() {
  const { darkMode, user } = useContext(AppContext);
  const navigate = useNavigate();
  
  // State management
  const [userComplaints, setUserComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, issues, timeline, leaderboard, achievements
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState(null);

  // Fetch user complaints
  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/complaints');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter(c => c.reportedBy?.id === user?.id);
          setUserComplaints(filtered);
          if (filtered.length > 0) {
            setSelectedComplaint(filtered[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      }
    };

    if (user?.id) {
      fetchUserComplaints();
    }
  }, [user?.id]);

  // Initialize user profile and mock data
  useEffect(() => {
    if (user) {
      setUserProfile({
        ...user,
        phone: user.phone || '+91 98765 43210',
        address: user.address || '123 Tech Street, Downtown',
        ward: user.ward || 'Ward 45-B',
        city: user.city || 'Bangalore',
        accountCreatedDate: user.createdAt || new Date('2023-01-15').toISOString(),
      });

      // Mock notifications
      setNotifications([
        { id: 1, type: 'status', title: 'Issue Updated', message: 'Your pothole report is now in progress', time: '2h ago', read: false },
        { id: 2, type: 'badge', title: 'Badge Earned', message: 'You earned "Community Helper" badge', time: '5h ago', read: false },
        { id: 3, type: 'resolved', title: 'Issue Resolved', message: 'Street light installation issue resolved', time: '1d ago', read: true },
        { id: 4, type: 'announcement', title: 'New Challenge', message: 'Help us fix 5 street lights this week', time: '2d ago', read: true },
      ]);

      // Mock activity history
      setActivityHistory([
        { id: 1, action: 'Issue Reported', description: 'Reported pothole on Main Street', timestamp: new Date(Date.now() - 86400000), category: 'issue' },
        { id: 2, action: 'Comment Added', description: 'Added comment on issue #ID-001', timestamp: new Date(Date.now() - 172800000), category: 'comment' },
        { id: 3, action: 'Badge Earned', description: 'Earned "First Reporter" badge', timestamp: new Date(Date.now() - 259200000), category: 'badge' },
        { id: 4, action: 'Profile Updated', description: 'Updated profile picture', timestamp: new Date(Date.now() - 345600000), category: 'profile' },
        { id: 5, action: 'Issue Resolved', description: 'Pothole issue marked as resolved', timestamp: new Date(Date.now() - 432000000), category: 'resolved' },
      ]);

      // Mock leaderboard data
      setLeaderboardData({
        currentRank: 47,
        totalPoints: 2450,
        issuesReported: 18,
        issuesResolved: 12,
        communityImpactScore: 8.5,
        badges: ['First Reporter', 'Community Helper', 'Active Citizen'],
        tier: 'Gold Citizen',
        level: 5,
      });
    }
  }, [user]);

  const resolvedComplaints = userComplaints.filter(c => c.status === 'Resolved');
  const pendingComplaints = userComplaints.filter(c => ['Submitted', 'Under Review', 'Verified'].includes(c.status));
  const inProgressComplaints = userComplaints.filter(c => c.status === 'In Progress');
  const rejectedComplaints = userComplaints.filter(c => c.status === 'Rejected');

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      
      {/* HEADER WITH PROFILE CARD AND NAVIGATION TABS */}
      <div className="space-y-6">
        
        {/* User Profile Header */}
        <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
          darkMode ? 'bg-gradient-to-br from-slate-900/60 to-slate-950/40 border-slate-800 shadow-2xl' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-lg'
        }`}>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
            {/* Profile Photo */}
            <div className="relative">
              <img 
                src={userProfile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.name} 
                alt="Profile" 
                className="h-24 w-24 rounded-full border-4 border-blue-500/50 shadow-lg shadow-blue-500/20 object-cover" 
              />
              <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 flex items-center justify-center text-sm font-bold ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              } ${leaderboardData?.tier === 'Platinum Citizen' ? 'text-yellow-400' : leaderboardData?.tier === 'Gold Citizen' ? 'text-amber-400' : 'text-slate-400'}`}>
                {leaderboardData?.tier?.split(' ')[0]?.[0]}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                <h1 className="text-3xl font-bold">{userProfile?.name}</h1>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  leaderboardData?.tier === 'Platinum Citizen' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  leaderboardData?.tier === 'Gold Citizen' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>{leaderboardData?.tier}</span>
              </div>
              
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4" />
                  {userProfile?.email}
                </p>
                <p className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4" />
                  {userProfile?.phone}
                </p>
                <p className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {userProfile?.ward}, {userProfile?.city}
                </p>
              </div>
              
              <p className="text-xs text-slate-400 pt-2">
                Member since {userProfile?.accountCreatedDate ? new Date(userProfile.accountCreatedDate).toLocaleDateString() : 'Jan 2023'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
            <button 
              onClick={() => setEditProfileOpen(!editProfileOpen)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/rewards')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                darkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <Gift className="h-4 w-4" />
              Redeem Rewards
            </button>
            <button className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
            }`}>
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-2 p-2 rounded-lg border overflow-x-auto ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'issues', label: 'My Issues', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'rewards', label: 'Rewards', icon: Gift },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT SECTIONS */}
      <div className="space-y-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Dashboard Overview */}
            <DashboardOverview 
              user={userProfile} 
              leaderboard={leaderboardData}
              issues={{ total: userComplaints.length, resolved: resolvedComplaints.length, pending: pendingComplaints.length }}
              darkMode={darkMode}
            />

            {/* Issue Statistics */}
            <IssueStatistics 
              complaints={userComplaints}
              resolved={resolvedComplaints.length}
              pending={pendingComplaints.length}
              inProgress={inProgressComplaints.length}
              rejected={rejectedComplaints.length}
              darkMode={darkMode}
            />

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Notifications */}
              <div className="lg:col-span-1">
                <NotificationsPanel 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  darkMode={darkMode}
                />
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <ActivityHistory 
                  activities={activityHistory}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* MY ISSUES TAB */}
        {activeTab === 'issues' && (
          <MyIssuesSection 
            complaints={userComplaints}
            selectedComplaint={selectedComplaint}
            setSelectedComplaint={setSelectedComplaint}
            darkMode={darkMode}
          />
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-1 p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <h3 className="font-extrabold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                Issues List
              </h3>
              <div className="space-y-2 max-h-[32rem] overflow-y-auto">
                {userComplaints.length > 0 ? (
                  userComplaints.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`w-full p-3 rounded-lg border text-left transition-all text-xs ${
                        selectedComplaint?.id === c.id
                          ? darkMode ? 'bg-blue-600/20 border-blue-500 shadow-lg' : 'bg-blue-100 border-blue-300 shadow-md'
                          : darkMode ? 'bg-slate-800/40 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-bold line-clamp-1">{c.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                          c.status === 'Resolved' ? 'bg-green-500/20 text-green-500' :
                          c.status === 'In Progress' ? 'bg-blue-500/20 text-blue-500' :
                          c.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-1">{c.description}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">No issues reported yet</div>
                )}
              </div>
            </div>

            {/* Issue Tracker */}
            <div className="lg:col-span-2">
              {selectedComplaint ? (
                <IssueTracker complaint={selectedComplaint} darkMode={darkMode} />
              ) : (
                <div className={`p-8 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <FileText className={`h-16 w-16 mx-auto mb-4 opacity-20`} />
                  <p className="text-slate-500">Select an issue to view its timeline</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <LeaderboardSection 
            currentUser={userProfile}
            leaderboardData={leaderboardData}
            darkMode={darkMode}
          />
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <AchievementsSection 
            leaderboardData={leaderboardData}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'rewards' && <RewardsDashboard />}

        {/* Staff/Admin View */}
        {user?.role === 'staff' || user?.role === 'admin' ? (
          <StaffView user={userProfile} complaints={userComplaints} darkMode={darkMode} />
        ) : null}
      </div>
    </div>
  );
}

function TimelineNode({ name, active, completed }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-300 font-extrabold ${
        completed ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/30' : 
        active ? 'bg-blue-900 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-500'
      }`}>
        {completed ? '✓' : ''}
      </div>
      <span className={`text-[9px] transition-colors font-semibold ${active ? 'text-slate-300' : 'text-slate-500'}`}>{name}</span>
    </div>
  );
}
