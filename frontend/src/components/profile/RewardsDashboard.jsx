import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Coins, Sparkles, Search, ArrowRight, CheckCircle2, Clock3, Gift, ShieldCheck, Download, Share2, Eye, CircleDollarSign, HeartHandshake, BadgeCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const categoryLabels = {
  all: 'All Rewards',
  certificate: 'Certificates',
  badge: 'Badges',
  voucher: 'Gift Vouchers',
  donation: 'Donation Rewards'
};

export default function RewardsDashboard() {
  const { user, refreshUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState({ type: 'info', text: '' });
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [summaryRes, catalogRes, categoryRes, historyRes, pointsRes] = await Promise.all([
          axios.get(`${API_BASE}/rewards/summary`),
          axios.get(`${API_BASE}/rewards/catalog`),
          axios.get(`${API_BASE}/rewards/categories`),
          axios.get(`${API_BASE}/rewards/history`),
          axios.get(`${API_BASE}/rewards/points-history`)
        ]);
        setSummary(summaryRes.data || null);
        setCatalog(catalogRes.data || []);
        setCategories(categoryRes.data || []);
        setRewardHistory(historyRes.data || []);
        setPointsHistory(pointsRes.data || []);
        setSelectedReward((catalogRes.data || [])[0] || null);
      } catch (error) {
        setBanner({ type: 'error', text: error.response?.data?.error || 'Unable to load rewards.' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredRewards = useMemo(() => {
    return catalog.filter((reward) => {
      const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory || (selectedCategory === 'premium' && reward.featured);
      const haystack = `${reward.name} ${reward.description} ${reward.benefits?.join(' ') || ''}`.toLowerCase();
      return matchesCategory && haystack.includes(searchTerm.toLowerCase());
    });
  }, [catalog, searchTerm, selectedCategory]);

  useEffect(() => {
    if (!selectedReward && filteredRewards.length > 0) {
      setSelectedReward(filteredRewards[0]);
    }
  }, [filteredRewards, selectedReward]);

  const pointsBalance = summary?.availablePoints ?? user?.availablePoints ?? user?.points ?? 0;
  const totalPoints = summary?.totalPoints ?? user?.totalPoints ?? user?.points ?? 0;
  const redeemedPoints = summary?.redeemedPoints ?? user?.redeemedPoints ?? 0;

  const handleRedeem = async () => {
    if (!selectedReward) return;
    setSubmitting(true);
    setBanner({ type: 'info', text: 'Preparing your redemption...' });

    try {
      const response = await axios.post(`${API_BASE}/rewards/redeem`, { rewardId: selectedReward.id });
      const updatedUser = response.data.user;
      await refreshUser();
      setSummary({ ...(summary || {}), availablePoints: updatedUser.availablePoints, redeemedPoints: updatedUser.redeemedPoints, totalPoints: updatedUser.totalPoints, rewardHistory: updatedUser.rewardHistory || [] });
      setRewardHistory(updatedUser.rewardHistory || []);
      setBanner({ type: 'success', text: `${selectedReward.name} redeemed successfully.` });
    } catch (error) {
      setBanner({ type: 'error', text: error.response?.data?.error || 'Redemption failed.' });
    } finally {
      setSubmitting(false);
      setConfirming(false);
    }
  };

  const selectedCanAfford = pointsBalance >= (selectedReward?.pointsRequired || 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                <Gift className="h-4 w-4" /> Reward Platform
              </div>
              <h1 className="text-3xl font-bold">Real rewards, real impact, real civic progress</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Your reports, resolutions, and community engagement now translate into meaningful certificates, badges, vouchers, and donation rewards.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="text-sm text-slate-300">Available Points</div>
            <div className="mt-1 text-3xl font-semibold text-cyan-300">{pointsBalance}</div>
          </div>
        </div>
      </div>

      {banner.text ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${banner.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : banner.type === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'}`}>
          {banner.text}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <img src={summary?.profileImage || user?.avatar || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120'} alt={summary?.userName || user?.name || 'User'} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <div className="text-sm text-cyan-300">{summary?.citizenLevel || 'Active Citizen'}</div>
                  <h2 className="text-xl font-semibold text-white">{summary?.userName || user?.name || 'Civic Citizen'}</h2>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-400">
                    <span>Rank {summary?.currentRank || 'Top 100'}</span>
                    <span>•</span>
                    <span>{summary?.xpPoints ?? totalPoints} XP</span>
                    <span>•</span>
                    <span>Community Score {summary?.communityScore ?? totalPoints}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <div>Current Rank</div>
                <div className="mt-1 text-xl font-semibold text-white">{summary?.currentRank || 'Top 100'}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Total Points Earned', summary?.totalPointsEarned ?? totalPoints],
                ['Available Points', pointsBalance],
                ['Redeemed Points', redeemedPoints],
                ['Lifetime Points', summary?.lifetimePoints ?? totalPoints]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Issues Reported', summary?.issuesReported ?? 0],
                ['Issues Resolved', summary?.issuesResolved ?? 0],
                ['Certificates Earned', summary?.certificatesEarned ?? 0],
                ['Badges Earned', summary?.badgesEarned ?? 0]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Reward progress</h2>
                <p className="text-sm text-slate-400">{summary?.nextReward?.message || 'Keep participating to unlock your next milestone.'}</p>
              </div>
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
                {summary?.nextReward?.remainingPoints || 0} more points to unlock next reward
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{pointsBalance} / {summary?.nextReward?.points ?? 0} points</span>
                <span>{summary?.nextReward?.progressPercent ?? 0}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${summary?.nextReward?.progressPercent || 0}%` }} />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4 text-sm text-slate-300">
                <div className="font-semibold text-white">Upcoming rewards</div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {summary?.upcomingRewards?.map((reward) => (
                    <div key={reward.points} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                      <div className="text-cyan-300">{reward.points} Points</div>
                      <div className="mt-1 text-white">{reward.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Explore rewards</h2>
                <p className="text-sm text-slate-400">Filter by category, discover new opportunities, and redeem the ones you unlock.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-2 pl-9 pr-3 text-sm text-white outline-none" placeholder="Search rewards" />
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`rounded-full px-3 py-1.5 text-sm ${selectedCategory === category.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {loading ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">Loading your reward catalog…</div>
              ) : filteredRewards.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">No rewards match your current search.</div>
              ) : filteredRewards.map((reward) => {
                const canAfford = pointsBalance >= reward.pointsRequired;
                return (
                  <motion.button key={reward.id} whileHover={{ y: -3 }} onClick={() => setSelectedReward(reward)} className={`rounded-3xl border p-4 text-left transition ${selectedReward?.id === reward.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-800/70 hover:border-slate-600'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">{reward.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{reward.name}</div>
                          <div className="text-sm text-slate-400">{reward.rewardType || reward.category}</div>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs ${canAfford ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{reward.availability}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{reward.description}</p>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                      <span>{reward.pointsRequired} pts</span>
                      <span className="flex items-center gap-1">{canAfford ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Clock3 className="h-4 w-4 text-amber-400" />} {canAfford ? 'Unlocked' : `Earn ${reward.pointsRequired - pointsBalance} more`}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-white">Reward preview</h2>
            </div>
            {selectedReward ? (
              <>
                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-white via-slate-100 to-slate-200 p-5 text-slate-900">
                  <img src={selectedReward.image} alt={selectedReward.name} className="h-36 w-full rounded-2xl object-cover" />
                  <div className="mt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{selectedReward.rewardType || 'Reward'}</div>
                    <h3 className="mt-2 text-xl font-semibold">{selectedReward.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{selectedReward.description}</p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-300 bg-white/70 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Points Required</span>
                      <span className="font-semibold text-slate-900">{selectedReward.pointsRequired}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Availability</span>
                      <span className="font-semibold text-slate-900">{selectedReward.availability}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Processing Time</span>
                      <span className="font-semibold text-slate-900">{selectedReward.processingTime || 'Immediate'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300"><BadgeCheck className="h-4 w-4 text-cyan-400" /> Benefits</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-400">
                    {(selectedReward.benefits || []).map((benefit) => <li key={benefit}>• {benefit}</li>)}
                  </ul>
                  <div className="mt-3 text-sm text-slate-400">{selectedReward.terms}</div>
                </div>
                <button onClick={() => setConfirming(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !selectedCanAfford}>
                  {submitting ? 'Processing...' : `Redeem for ${selectedReward.pointsRequired} points`} <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">Select a reward to preview it.</div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">Reward history</h2>
            </div>
            {rewardHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">No reward history yet. Your first redemption will appear here.</div>
            ) : (
              <div className="space-y-2">
                {rewardHistory.slice(0, 6).map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white">{entry.rewardName}</div>
                        <div className="text-sm text-slate-400">{new Date(entry.redemptionDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-300">{entry.pointsSpent} pts</div>
                        <div className="text-xs text-slate-400">{entry.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Points ledger</h2>
            </div>
            {pointsHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">No points activity captured yet.</div>
            ) : (
              <div className="space-y-2">
                {pointsHistory.slice(0, 6).map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-3 text-sm text-slate-400">
                    <div className="flex items-center justify-between gap-2">
                      <span>{entry.activity}</span>
                      <span>{entry.pointsEarned > 0 ? `+${entry.pointsEarned}` : `-${entry.pointsSpent}`}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <span>Balance {entry.balance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-300">
              <CircleDollarSign className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Confirm redemption</h3>
            </div>
            <p className="mt-4 text-sm text-slate-400">You are about to redeem {selectedReward?.name}. This will cost {selectedReward?.pointsRequired} points.</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setConfirming(false)} className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300">Cancel</button>
              <button onClick={handleRedeem} className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
