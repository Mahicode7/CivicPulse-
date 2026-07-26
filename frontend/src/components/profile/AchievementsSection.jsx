import React from 'react';
import { Award, Target, Zap, Heart, Star, Trophy } from 'lucide-react';

export default function AchievementsSection({ leaderboardData, darkMode }) {
  const achievementCategories = [
    {
      name: 'Earned Badges',
      badges: leaderboardData?.badges || ['First Reporter', 'Community Helper', 'Active Citizen'],
      icon: Award,
      color: 'text-blue-500',
      description: 'Recognition badges for your contributions'
    },
    {
      name: 'Milestones',
      milestones: [
        { name: '5 Issues Reported', completed: true, icon: '📝' },
        { name: '10 Issues Reported', completed: true, icon: '📝' },
        { name: '20 Issues Reported', completed: true, icon: '📝' },
        { name: '50 Issues Reported', completed: false, icon: '📝' },
      ]
    },
    {
      name: 'Challenges Completed',
      challenges: [
        { name: 'Weekly Warrior', description: 'Report 3 issues in a week', completed: true },
        { name: 'Community Champion', description: 'Reach 10 resolved issues', completed: true },
        { name: 'Super Citizen', description: 'Maintain 2000+ points', completed: false },
      ]
    }
  ];

  const badges = [
    {
      name: 'First Reporter',
      icon: '🔔',
      description: 'You reported your first issue',
      earned: true,
      date: 'May 15, 2026',
      rarity: 'Common'
    },
    {
      name: 'Community Helper',
      icon: '🤝',
      description: 'You helped resolve community issues',
      earned: true,
      date: 'JUNE 20, 2026',
      rarity: 'Uncommon'
    },
    {
      name: 'Active Citizen',
      icon: '⚡',
      description: 'You reported 10+ issues in a month',
      earned: true,
      date: 'Mar 10, 2026',
      rarity: 'Uncommon'
    },
    {
      name: 'Top Contributor',
      icon: '🏆',
      description: 'You are in the top 20 leaderboard',
      earned: false,
      rarity: 'Rare'
    },
    {
      name: 'Civic Champion',
      icon: '🌟',
      description: 'You resolved 20+ issues',
      earned: false,
      rarity: 'Epic'
    },
    {
      name: 'Community Guardian',
      icon: '🛡️',
      description: 'You reached Platinum tier',
      earned: false,
      rarity: 'Legendary'
    },
  ];

  const completedChallenges = [
    {
      name: 'Weekly Warrior',
      description: 'Report 3 issues in a week',
      progress: 100,
      reward: '+150 XP',
      completed: true,
      completedDate: 'Jan 20, 2023'
    },
    {
      name: 'Community Champion',
      description: 'Reach 10 resolved issues',
      progress: 100,
      reward: '+300 XP',
      completed: true,
      completedDate: 'Mar 15, 2023'
    },
  ];

  const activeChallenges = [
    {
      name: 'Super Citizen',
      description: 'Maintain 2000+ points for 30 days',
      progress: 65,
      reward: '+500 XP',
      daysLeft: 14
    },
    {
      name: 'Resolved Master',
      description: 'Get 15 issues resolved',
      progress: 80,
      reward: '+200 XP',
      daysLeft: 10
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Achievements & Milestones
      </h2>

      {/* All Badges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">All Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <BadgeCard key={badge.name} badge={badge} darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Completed Challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Completed Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedChallenges.map((challenge) => (
            <div
              key={challenge.name}
              className={`p-6 rounded-xl border ${
                darkMode
                  ? 'bg-green-600/10 border-green-500/30'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-lg">{challenge.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {challenge.description}
                  </p>
                </div>
                <span className="text-3xl flex-shrink-0">✓</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-500 bg-green-500/20 px-3 py-1 rounded-full">
                  {challenge.reward}
                </span>
                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                  Completed {challenge.completedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">In Progress Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChallenges.map((challenge) => (
            <div
              key={challenge.name}
              className={`p-6 rounded-xl border ${
                darkMode
                  ? 'bg-blue-600/10 border-blue-500/30'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{challenge.name}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {challenge.daysLeft}d left
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {challenge.description}
                </p>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Progress</span>
                  <span className="font-bold text-blue-500">{challenge.progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full border overflow-hidden ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-500 bg-blue-500/20 px-3 py-1 rounded-full inline-block">
                {challenge.reward}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Milestones */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Contribution Milestones</h3>
        <div className={`rounded-xl border p-6 space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          {[5, 10, 20, 50].map((count) => {
            const completed = leaderboardData?.issuesReported >= count;
            return (
              <div key={count} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  completed
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : 'bg-slate-800/20 border-slate-700 text-slate-500'
                }`}>
                  {completed ? '✓' : count}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{count} Issues Reported</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                    {completed
                      ? 'Completed'
                      : `${count - (leaderboardData?.issuesReported || 0)} more to go`}
                  </p>
                </div>
                {completed && (
                  <span className="text-2xl">🏅</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          icon={Award}
          label="Badges Earned"
          value={leaderboardData?.badges?.length || 3}
          total={6}
          darkMode={darkMode}
        />
        <StatBox
          icon={Target}
          label="Challenges Completed"
          value={2}
          total={8}
          darkMode={darkMode}
        />
        <StatBox
          icon={Star}
          label="Reputation Score"
          value={leaderboardData?.communityImpactScore}
          total={10}
          darkMode={darkMode}
        />
        <StatBox
          icon={Heart}
          label="Community Votes"
          value={128}
          total={1000}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function BadgeCard({ badge, darkMode }) {
  const rarityColors = {
    'Common': 'text-slate-500',
    'Uncommon': 'text-green-500',
    'Rare': 'text-blue-500',
    'Epic': 'text-purple-500',
    'Legendary': 'text-yellow-500'
  };

  const rarityBg = {
    'Common': 'bg-slate-500/10',
    'Uncommon': 'bg-green-500/10',
    'Rare': 'bg-blue-500/10',
    'Epic': 'bg-purple-500/10',
    'Legendary': 'bg-yellow-500/10'
  };

  return (
    <div
      className={`p-6 rounded-xl border transition-all text-center ${
        badge.earned
          ? darkMode
            ? 'bg-blue-600/10 border-blue-500/30'
            : 'bg-blue-50 border-blue-200'
          : darkMode
          ? 'bg-slate-800/30 border-slate-700'
          : 'bg-slate-100 border-slate-300'
      }`}
    >
      <p className={`text-5xl mb-3 ${badge.earned ? '' : 'opacity-30'}`}>{badge.icon}</p>
      <p className="font-bold mb-1">{badge.name}</p>
      <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {badge.description}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-1 rounded ${rarityBg[badge.rarity]} ${rarityColors[badge.rarity]}`}>
          {badge.rarity}
        </span>
        {badge.earned && (
          <span className="text-xs text-green-500 font-bold">✓ Earned</span>
        )}
      </div>

      {badge.earned && badge.date && (
        <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          {badge.date}
        </p>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, total, darkMode }) {
  const percentage = (value / total) * 100;

  return (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
          {label}
        </p>
        <Icon className={`h-4 w-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}/{total}</p>
        <div className={`w-full h-2 rounded-full border overflow-hidden ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
