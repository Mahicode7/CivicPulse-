import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';

export default function LeaderboardSection({ currentUser, leaderboardData, darkMode }) {
  const [leaderboardView, setLeaderboardView] = useState('global'); // global, friends

  // Mock leaderboard data
  const topContributors = [
    { rank: 1, name: 'RajKumar', points: 4850, issues: 35, tier: 'Civic Hero', badge: '👑' },
    { rank: 2, name: 'Priya', points: 3920, issues: 28, tier: 'Platinum Citizen', badge: '⭐' },
    { rank: 3, name: 'Ahmed Hassan', points: 3450, issues: 24, tier: 'Gold Citizen', badge: '🥇' },
    { rank: 4, name: 'Aisha', points: 2890, issues: 20, tier: 'Gold Citizen', badge: '🥇' },
    { rank: 5, name: 'Vikram', points: 2650, issues: 18, tier: 'Silver Citizen', badge: '🥈' },
    { rank: 6, name: 'Neha', points: 2340, issues: 16, tier: 'Silver Citizen', badge: '🥈' },
    { rank: 7, name: 'Carlos', points: 2050, issues: 14, tier: 'Bronze Citizen', badge: '🥉' },
    { rank: 8, name: 'Latha', points: 1890, issues: 12, tier: 'Bronze Citizen', badge: '🥉' },
    { rank: 9, name: 'Arjun', points: 1650, issues: 10, tier: 'Bronze Citizen', badge: '🥉' },
    { rank: 10, name: 'Mahi', points: 1420, issues: 8, tier: 'Emerging Citizen', badge: '🌱' },
  ];

  const badges = [
    { name: 'First Reporter', icon: '🔔', description: 'Reported your first issue', earned: true },
    { name: 'Community Helper', icon: '🤝', description: 'Helped 5 community issues', earned: true },
    { name: 'Active Citizen', icon: '⚡', description: 'Reported 10+ issues', earned: true },
    { name: 'Top Contributor', icon: '🏆', description: 'Top 20 on leaderboard', earned: false },
    { name: 'Civic Champion', icon: '🌟', description: 'Resolved 20+ issues', earned: false },
    { name: 'Community Guardian', icon: '🛡️', description: 'Reached Platinum tier', earned: false },
  ];

  const tiers = [
    { name: 'Bronze Citizen', icon: '🥉', minPoints: 0, maxPoints: 1000, color: 'text-amber-700' },
    { name: 'Silver Citizen', icon: '🥈', minPoints: 1000, maxPoints: 2000, color: 'text-slate-500' },
    { name: 'Gold Citizen', icon: '🥇', minPoints: 2000, maxPoints: 3500, color: 'text-amber-500' },
    { name: 'Platinum Citizen', icon: '⭐', minPoints: 3500, maxPoints: 5000, color: 'text-cyan-500' },
    { name: 'Civic Hero', icon: '👑', minPoints: 5000, maxPoints: Infinity, color: 'text-yellow-500' },
  ];

  const currentTier = tiers.find(t => leaderboardData?.totalPoints >= t.minPoints && leaderboardData?.totalPoints < t.maxPoints);
  const nextTier = tiers.find(t => t.minPoints > leaderboardData?.totalPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - leaderboardData?.totalPoints : 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Leaderboard & Rankings</h2>

      {/* Current User Ranking Card */}
      <div className={`p-8 rounded-2xl border relative overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-blue-950/40 to-slate-950/40 border-blue-900/20'
          : 'bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200/50'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Trophy className="h-48 w-48 text-blue-500" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Your Current Rank</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-blue-500">#{leaderboardData?.currentRank}</span>
                <span className={`text-lg font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  out of 500 citizens
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Total Points</p>
              <p className="text-4xl font-black text-yellow-500">{leaderboardData?.totalPoints?.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>XP Points</p>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white/50 border-slate-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Current Tier</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentTier?.icon}</span>
                <div>
                  <p className="font-bold">{leaderboardData?.tier}</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Level {leaderboardData?.level}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white/50 border-slate-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Issues Resolved</p>
              <p className="text-3xl font-black text-green-500">{leaderboardData?.issuesResolved}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                of {leaderboardData?.issuesReported} reported
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white/50 border-slate-200'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              } mb-2`}>Community Impact</p>
              <p className="text-3xl font-black text-purple-500">{leaderboardData?.communityImpactScore}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>Impact Score</p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Progress to {nextTier.name}
                </span>
                <span className="text-sm font-bold text-blue-500">{pointsToNextTier} points to go</span>
              </div>
              <div className={`w-full h-4 rounded-full border overflow-hidden ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{
                    width: `${((leaderboardData?.totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Leaderboard */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Top Contributors
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Contributor</th>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Points</th>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Issues</th>
                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-widest">Tier</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((contributor) => {
                const isCurrentUser = contributor.rank === leaderboardData?.currentRank;
                return (
                  <tr
                    key={contributor.rank}
                    className={`border-b transition-colors ${
                      isCurrentUser
                        ? darkMode ? 'bg-blue-600/10' : 'bg-blue-100'
                        : darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                    } ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {contributor.rank === 1 ? '🥇' : contributor.rank === 2 ? '🥈' : contributor.rank === 3 ? '🥉' : ''}
                        </span>
                        <span className="font-bold text-lg">{contributor.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">{contributor.name}</p>
                        {isCurrentUser && (
                          <p className="text-xs text-blue-500 font-semibold">You</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-yellow-500">{contributor.points}</span>
                        <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>XP</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-500">{contributor.issues}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold">
                        <span>{contributor.badge}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          contributor.tier === 'Civic Hero' ? 'bg-yellow-500/20 text-yellow-500' :
                          contributor.tier === 'Platinum Citizen' ? 'bg-cyan-500/20 text-cyan-500' :
                          contributor.tier === 'Gold Citizen' ? 'bg-amber-500/20 text-amber-500' :
                          'bg-slate-500/20 text-slate-500'
                        }`}>
                          {contributor.tier}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier System */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Citizen Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-xl border transition-all text-center ${
                tier.name === leaderboardData?.tier
                  ? darkMode
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-blue-100 border-blue-500 shadow-lg'
                  : darkMode
                  ? 'bg-slate-800/30 border-slate-700'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <p className="text-4xl mb-2">{tier.icon}</p>
              <p className="font-bold text-sm mb-1">{tier.name}</p>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {tier.minPoints.toLocaleString()} - {tier.maxPoints === Infinity ? '∞' : tier.maxPoints.toLocaleString()} XP
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Badges & Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`p-4 rounded-lg border transition-all ${
                badge.earned
                  ? darkMode
                    ? 'bg-blue-600/10 border-blue-500/30'
                    : 'bg-blue-50 border-blue-200'
                  : darkMode
                  ? 'bg-slate-800/30 border-slate-700 opacity-50'
                  : 'bg-slate-100 border-slate-300 opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl flex-shrink-0 ${badge.earned ? '' : 'opacity-30'}`}>
                  {badge.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{badge.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <p className="text-xs text-green-500 font-semibold mt-1">✓ Earned</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
