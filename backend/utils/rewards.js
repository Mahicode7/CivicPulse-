import { findUserById, sanitizeUser, updateUser } from './jsonDatabase.js';
import { db } from '../database.js';

const milestoneRewards = [
  { points: 100, name: 'Community Helper Badge', rewardId: 'community-helper-badge' },
  { points: 250, name: 'Digital Achievement Certificate', rewardId: 'digital-achievement' },
  { points: 500, name: 'Best Citizen Silver Certificate', rewardId: 'best-citizen-silver' },
  { points: 1000, name: 'Best Citizen Gold Certificate', rewardId: 'best-citizen-gold' },
  { points: 2000, name: 'Civic Champion', rewardId: 'civic-champion' },
  { points: 5000, name: 'Community Leader', rewardId: 'community-leadership' }
];

export const rewardCatalog = [
  { id: 'republic-day-vip-pass', name: 'Republic Day VIP Pass', description: 'Priority access for civic events, official ceremonies, and community celebrations.', benefits: ['Priority Entry', 'Special Seating', 'Official Civic Event Access'], pointsRequired: 10000, category: 'voucher', rewardType: 'Voucher', availability: 'Limited', icon: '🎟️', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600', processingTime: '2-3 days', partner: 'City Cultural Affairs', voucherValue: 'VIP Entry Access', expiryDate: '31 January 2026', redemptionLimit: '1 per account', terms: 'Valid for the registered event day only.', active: true, featured: true },
  { id: 'independence-day-vip-pass', name: 'Independence Day VIP Pass', description: 'A premium pass for the city’s patriotic celebrations and hosted civic events.', benefits: ['VIP Entry', 'Front Row Seating', 'Ceremony Access'], pointsRequired: 8500, category: 'voucher', rewardType: 'Voucher', availability: 'Limited', icon: '🇮🇳', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600', processingTime: '1-2 days', partner: 'Municipal Festivities Office', voucherValue: 'VIP Entry Access', expiryDate: '15 August 2026', redemptionLimit: '1 per account', terms: 'Subject to event availability and verification.', active: true, featured: true },
  { id: 'kannada-rajyotsava-pass', name: 'Kannada Rajyotsava Pass', description: 'Celebrate local heritage with access to cultural showcases and public programs.', benefits: ['Cultural Access', 'Community Event Entry', 'Official Recognition'], pointsRequired: 7200, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '🎭', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600', processingTime: '3-5 days', partner: 'Kannada Cultural Board', voucherValue: 'Cultural Access', expiryDate: '1 November 2026', redemptionLimit: '2 per account', terms: 'Redeemable only with the provided confirmation code.', active: true, featured: false },
  { id: 'museum-entry-pass', name: 'Museum Entry Pass', description: 'A curated pass for city museums, heritage tours, and public educational exhibits.', benefits: ['Museum Access', 'Guided Tour Benefit', 'Learning Experience'], pointsRequired: 5600, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '🏛️', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600', processingTime: '2-4 days', partner: 'City Museum Network', voucherValue: 'Museum Entry', expiryDate: '30 December 2026', redemptionLimit: '2 per account', terms: 'Non-transferable and valid for one entry only.', active: true, featured: false },
  { id: 'temple-darshan-pass', name: 'Temple Special Darshan Pass', description: 'Fast-track access for cultural and spiritual visits during civic festivals.', benefits: ['Priority Darshan', 'Trusted Entry', 'Community Benefit'], pointsRequired: 4800, category: 'voucher', rewardType: 'Voucher', availability: 'Limited', icon: '🛕', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600', processingTime: '1-2 days', partner: 'Temple Trust', voucherValue: 'Darshan Access', expiryDate: '31 December 2026', redemptionLimit: '1 per account', terms: 'Needs advance booking and ID verification.', active: true, featured: false },
  { id: 'public-transport-pass', name: 'Public Transport Pass', description: 'A transit pass that supports everyday mobility and reliable civic travel.', benefits: ['Transit Support', 'Commuter Savings', 'Reliable Access'], pointsRequired: 4200, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '🚌', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600', processingTime: '2-3 days', partner: 'Metro Mobility Partner', voucherValue: 'Transit Credit', expiryDate: '31 March 2026', redemptionLimit: '1 per month', terms: 'Valid on partnered transit routes only.', active: true, featured: false },
  { id: 'coffee-coupon', name: 'Coffee Coupon', description: 'Enjoy a complimentary coffee at partnered civic hubs and community centers.', benefits: ['Coffee Voucher', 'Local Cafe Access', 'Community Perks'], pointsRequired: 1800, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '☕', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'City Connect Cafes', voucherValue: '₹200 Coffee Credit', expiryDate: '30 September 2026', redemptionLimit: '3 per account', terms: 'Valid for the listed outlets only.', active: true, featured: false },
  { id: 'food-coupon', name: 'Food Coupon', description: 'A meal voucher for community kitchens, local canteens, and civic events.', benefits: ['Meal Support', 'Community Access', 'Local Vendor Benefit'], pointsRequired: 2400, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '🍽️', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Food Network', voucherValue: '₹300 Food Credit', expiryDate: '31 October 2026', redemptionLimit: '2 per account', terms: 'Can be used at partner stalls and cafés only.', active: true, featured: false },
  { id: 'mobile-recharge-voucher', name: 'Mobile Recharge Voucher', description: 'Stay connected with a prepaid recharge voucher for everyday communication.', benefits: ['Phone Recharge', 'Connectivity Support', 'Emergency Access'], pointsRequired: 3200, category: 'voucher', rewardType: 'Voucher', availability: 'Available', icon: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Digital Connectivity Partner', voucherValue: '₹500 Recharge', expiryDate: '31 December 2026', redemptionLimit: '1 per account', terms: 'Valid for the listed telecom partner only.', active: true, featured: false },
  { id: 'community-helper-badge', name: 'Community Helper Badge', description: 'Recognizes dependable civic participation and active issue reporting.', benefits: ['Community Recognition', 'Profile Highlight', 'Volunteer Visibility'], pointsRequired: 100, category: 'badge', rewardType: 'Badge', availability: 'Available', icon: '🏅', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Recognition Council', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Badge is issued instantly after redemption.', active: true, featured: true },
  { id: 'digital-achievement', name: 'Digital Achievement Certificate', description: 'A polished certificate suited for portfolios, applications, and professional profiles.', benefits: ['Resume Value', 'College Applications', 'Portfolio', 'Community Recognition'], pointsRequired: 250, category: 'certificate', rewardType: 'Certificate', availability: 'Available', icon: '📜', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Digital Recognition Desk', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Certificate preview is ready to download immediately.', active: true, featured: true },
  { id: 'bronze-citizen', name: 'Bronze Citizen Badge', description: 'A first step recognition for active community contribution and public service.', benefits: ['Badge Display', 'Achievement Mark', 'Community Visibility'], pointsRequired: 350, category: 'badge', rewardType: 'Badge', availability: 'Available', icon: '🥉', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Recognition Council', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Badge is added to the profile immediately.', active: true, featured: false },
  { id: 'silver-citizen', name: 'Silver Citizen Badge', description: 'Honors dependable, sustained civic participation in the community.', benefits: ['Enhanced Profile', 'City Recognition', 'Achievement Spotlight'], pointsRequired: 600, category: 'badge', rewardType: 'Badge', availability: 'Available', icon: '🥈', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Recognition Council', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Badge unlocks after the points threshold is met.', active: true, featured: false },
  { id: 'gold-citizen', name: 'Gold Citizen Badge', description: 'A premium badge for long-term civic leadership and service.', benefits: ['Premium Recognition', 'Visible Badge', 'Leadership Profile'], pointsRequired: 900, category: 'badge', rewardType: 'Badge', availability: 'Limited', icon: '🥇', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Recognition Council', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Awarded only once a user reaches the threshold.', active: true, featured: false },
  { id: 'best-citizen-silver', name: 'Best Citizen Silver Certificate', description: 'Recognizes strong civic participation and responsible community involvement.', benefits: ['Resume Value', 'College Applications', 'Portfolio', 'Community Recognition'], pointsRequired: 500, category: 'certificate', rewardType: 'Certificate', availability: 'Available', icon: '🥈', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'City Awards Office', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Downloadable as a digital certificate.', active: true, featured: true },
  { id: 'best-citizen-gold', name: 'Best Citizen Gold Certificate', description: 'Awarded to top contributors with sustained civic engagement.', benefits: ['Premium Recognition', 'Resume Enhancement', 'Verified Leadership'], pointsRequired: 1000, category: 'certificate', rewardType: 'Certificate', availability: 'Limited', icon: '🥇', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'City Awards Office', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Issued as a premium digital certificate.', active: true, featured: true },
  { id: 'civic-champion', name: 'Civic Champion Certificate', description: 'Recognizes users who regularly report issues and improve public services.', benefits: ['Leadership Highlight', 'Official Recognition', 'Impact Story'], pointsRequired: 2000, category: 'certificate', rewardType: 'Certificate', availability: 'Available', icon: '🛡️', image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Civic Excellence Office', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Recognition is issued instantly after approval.', active: true, featured: true },
  { id: 'community-leadership', name: 'Community Leadership Certificate', description: 'Highlights leadership in local issue reporting and community action.', benefits: ['Leadership Badge', 'Community Visibility', 'Service Record'], pointsRequired: 5000, category: 'certificate', rewardType: 'Certificate', availability: 'Available', icon: '🧭', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600', processingTime: 'Instant', partner: 'Leadership Recognition Desk', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Best suited for civic leadership and service portfolios.', active: true, featured: true },
  { id: 'tree-plantation', name: 'Plant a Tree', description: 'Direct your points toward a real environmental initiative and community greening.', benefits: ['Tree Planting', 'Eco Impact', 'Community Sustainability'], pointsRequired: 650, category: 'donation', rewardType: 'Donation', availability: 'Available', icon: '🌳', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600', processingTime: '3-7 days', partner: 'Green City Foundation', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Allocated toward the partnered environmental campaign.', active: true, featured: false },
  { id: 'book-donation', name: 'Donate Books', description: 'Channel your points into book donation drives for underserved learners.', benefits: ['Books for Learning', 'Education Equity', 'Community Outreach'], pointsRequired: 800, category: 'donation', rewardType: 'Donation', availability: 'Available', icon: '📚', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600', processingTime: '2-5 days', partner: 'Learning for All', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Donations are logged and shared with partner organizations.', active: true, featured: false },
  { id: 'feed-children', name: 'Feed Children', description: 'Support community meal programs that provide food security for children.', benefits: ['Meal Support', 'Child Welfare', 'Community Care'], pointsRequired: 1200, category: 'donation', rewardType: 'Donation', availability: 'Available', icon: '🍲', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', processingTime: '3-6 days', partner: 'Civic Care Network', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Supports partner kitchens and community welfare programs.', active: true, featured: false },
  { id: 'animal-welfare', name: 'Animal Welfare', description: 'Support animal rescue and sheltered care initiatives with your points.', benefits: ['Animal Support', 'Shelter Care', 'Community Compassion'], pointsRequired: 1400, category: 'donation', rewardType: 'Donation', availability: 'Available', icon: '🐕', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600', processingTime: '2-4 days', partner: 'Compassion Trust', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Partnered animal welfare initiatives receive the contribution.', active: true, featured: false },
  { id: 'clean-city-campaign', name: 'Clean City Campaign', description: 'Fund community clean-up drives and greener public spaces.', benefits: ['Clean-Up Support', 'Neighborhood Pride', 'Waste Reduction'], pointsRequired: 900, category: 'donation', rewardType: 'Donation', availability: 'Available', icon: '♻️', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600', processingTime: '2-5 days', partner: 'Clean Streets Initiative', voucherValue: null, expiryDate: null, redemptionLimit: null, terms: 'Funding supports neighborhood cleanup and awareness efforts.', active: true, featured: false }
];

export function getRewardCatalog() {
  return rewardCatalog.map((reward) => ({ ...reward }));
}

export function getRewardCategories() {
  return [
    { id: 'all', label: 'All Rewards', icon: '✨' },
    { id: 'certificate', label: 'Certificates', icon: '🏆' },
    { id: 'badge', label: 'Badges', icon: '🥇' },
    { id: 'voucher', label: 'Gift Vouchers', icon: '🎁' },
    { id: 'donation', label: 'Donation Rewards', icon: '🌱' },
    { id: 'premium', label: 'Premium Recognition', icon: '🎖️' }
  ];
}

function getNormalizedState(user) {
  const availablePoints = Number(user.availablePoints ?? user.points ?? 0);
  const totalPoints = Number(user.totalPoints ?? user.points ?? 0);
  const redeemedPoints = Number(user.redeemedPoints ?? 0);
  const issuesReported = Number(user.issuesReported ?? user.reportsCount ?? 0);
  const issuesResolved = Number(user.issuesResolved ?? user.resolvedCount ?? 0);
  const rewardHistory = Array.isArray(user.rewardHistory) ? user.rewardHistory : [];
  const earnedCertificates = Array.isArray(user.earnedCertificates) ? user.earnedCertificates : [];
  const earnedBadges = Array.isArray(user.earnedBadges) ? user.earnedBadges : [];
  const pointsLedger = Array.isArray(user.pointsLedger) ? user.pointsLedger : [];

  return {
    totalPoints,
    availablePoints,
    redeemedPoints,
    rewardHistory,
    earnedCertificates,
    earnedBadges,
    pointsLedger,
    issuesReported,
    issuesResolved
  };
}

function getUserLevel(points) {
  if (points >= 5000) return 'Community Leader';
  if (points >= 2000) return 'Civic Champion';
  if (points >= 1000) return 'Gold Citizen';
  if (points >= 500) return 'Silver Citizen';
  if (points >= 250) return 'Bronze Citizen';
  return 'Active Citizen';
}

function getBadgeName(points) {
  if (points >= 5000) return 'Community Leader';
  if (points >= 2000) return 'Civic Champion';
  if (points >= 1000) return 'Gold Citizen';
  if (points >= 500) return 'Silver Citizen';
  if (points >= 250) return 'Bronze Citizen';
  return 'Community Helper';
}

function getCurrentRank(points, leaderboard = []) {
  if (!leaderboard.length) return 'Top 100';
  const ranked = [...leaderboard].sort((a, b) => Number(b.points ?? 0) - Number(a.points ?? 0));
  const index = ranked.findIndex((entry) => String(entry.id) === String(points.id));
  if (index === -1) return `Top ${ranked.length}`;
  return `#${index + 1}`;
}

export function getRewardSummary(user, leaderboard = []) {
  const state = getNormalizedState(user);
  const availablePoints = state.availablePoints;
  const nextMilestone = milestoneRewards.find((entry) => entry.points > availablePoints) || milestoneRewards[milestoneRewards.length - 1];
  const previousMilestone = [...milestoneRewards].reverse().find((entry) => entry.points <= availablePoints) || milestoneRewards[0];
  const range = nextMilestone.points - previousMilestone.points || 1;
  const progressPercent = Math.min(100, Math.round(((availablePoints - previousMilestone.points) / range) * 100));
  const remainingPoints = Math.max(0, nextMilestone.points - availablePoints);
  const nextReward = {
    ...nextMilestone,
    remainingPoints,
    progressPercent,
    message: remainingPoints > 0 ? `Only ${remainingPoints} more points to unlock ${nextMilestone.name}` : `You have unlocked ${nextMilestone.name}`
  };

  const totalLifetimePoints = Number(user.totalPoints ?? user.points ?? 0);
  const currentLevel = user.currentLevel || user.level || getUserLevel(availablePoints);
  const currentRank = user.currentRank || getCurrentRank(user, leaderboard);

  return {
    ...state,
    profileImage: user.profileImage || user.avatar || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120',
    userName: user.name || 'Civic Citizen',
    citizenLevel: currentLevel,
    currentRank,
    xpPoints: totalLifetimePoints,
    communityScore: totalLifetimePoints + state.issuesResolved * 50 + state.issuesReported * 15,
    totalPointsEarned: totalLifetimePoints,
    totalPoints: totalLifetimePoints,
    availablePoints,
    redeemedPoints: state.redeemedPoints,
    lifetimePoints: totalLifetimePoints,
    issuesReported: state.issuesReported,
    issuesResolved: state.issuesResolved,
    certificatesEarned: state.earnedCertificates.length,
    badgesEarned: state.earnedBadges.length,
    rewardsRedeemed: state.rewardHistory.length,
    nextReward,
    upcomingRewards: milestoneRewards.slice(0, 6),
    progressPercent,
    rewardCategories: getRewardCategories(),
    pointsHistory: state.pointsLedger,
    rewardHistory: state.rewardHistory
  };
}

export function getRewardHistory(user) {
  return Array.isArray(user.rewardHistory) ? user.rewardHistory : [];
}

export function getPointsHistory(user) {
  return Array.isArray(user.pointsLedger) ? user.pointsLedger : [];
}

export function redeemReward(user, rewardId) {
  const reward = rewardCatalog.find((entry) => entry.id === rewardId);

  if (!reward) {
    return { success: false, error: 'Reward not found.' };
  }

  if (!reward.active) {
    return { success: false, error: 'This reward is currently unavailable.' };
  }

  const state = getNormalizedState(user);
  const availablePoints = state.availablePoints;

  if (availablePoints < reward.pointsRequired) {
    return {
      success: false,
      error: `You need ${reward.pointsRequired - availablePoints} more points to redeem this reward.`,
      additionalPointsNeeded: reward.pointsRequired - availablePoints
    };
  }

  const nextHistory = [
    {
      id: `redeem_${Date.now()}`,
      rewardId: reward.id,
      rewardName: reward.name,
      redemptionDate: new Date().toISOString(),
      pointsSpent: reward.pointsRequired,
      status: reward.category === 'voucher' ? 'Pending' : 'Redeemed',
      category: reward.category,
      rewardType: reward.rewardType,
      image: reward.image,
      hasPreview: true
    },
    ...(state.rewardHistory || [])
  ];

  const nextLedgerEntry = {
    id: `ledger_${Date.now()}`,
    date: new Date().toISOString(),
    activity: `Redeemed ${reward.name}`,
    pointsEarned: 0,
    pointsSpent: reward.pointsRequired,
    balance: availablePoints - reward.pointsRequired,
    type: 'redeem'
  };

  user.totalPoints = state.totalPoints;
  user.availablePoints = availablePoints - reward.pointsRequired;
  user.redeemedPoints = state.redeemedPoints + reward.pointsRequired;
  user.rewardHistory = nextHistory;
  user.pointsLedger = [nextLedgerEntry, ...(state.pointsLedger || [])];
  user.earnedCertificates = reward.category === 'certificate' ? [...new Set([...(state.earnedCertificates || []), reward.name])] : state.earnedCertificates;
  user.earnedBadges = reward.category === 'badge' ? [...new Set([...(state.earnedBadges || []), reward.name])] : state.earnedBadges;
  user.points = user.availablePoints;
  user.currentLevel = getUserLevel(user.availablePoints);
  user.level = user.currentLevel;
  user.badge = getBadgeName(user.availablePoints);
  user.currentRank = user.currentRank || 'Top 100';

  return { success: true, reward, user };
}

export function saveRewardState(userId, userUpdates) {
  const user = findUserById(userId);

  if (!user) {
    return null;
  }

  const updatedUser = updateUser(userId, userUpdates);
  const syncedLocalUser = db.updateUserState(userId, userUpdates);

  return sanitizeUser({
    ...(updatedUser || {}),
    ...(syncedLocalUser || {}),
    id: userId,
    points: Number(userUpdates.availablePoints ?? userUpdates.points ?? updatedUser?.availablePoints ?? user?.points ?? 0),
    totalPoints: Number(userUpdates.totalPoints ?? userUpdates.points ?? updatedUser?.totalPoints ?? user?.totalPoints ?? user?.points ?? 0),
    availablePoints: Number(userUpdates.availablePoints ?? userUpdates.points ?? updatedUser?.availablePoints ?? user?.availablePoints ?? user?.points ?? 0),
    redeemedPoints: Number(userUpdates.redeemedPoints ?? updatedUser?.redeemedPoints ?? user?.redeemedPoints ?? 0),
    rewardHistory: userUpdates.rewardHistory ?? updatedUser?.rewardHistory ?? user?.rewardHistory ?? [],
    earnedCertificates: userUpdates.earnedCertificates ?? updatedUser?.earnedCertificates ?? user?.earnedCertificates ?? [],
    earnedBadges: userUpdates.earnedBadges ?? updatedUser?.earnedBadges ?? user?.earnedBadges ?? [],
    pointsLedger: userUpdates.pointsLedger ?? updatedUser?.pointsLedger ?? user?.pointsLedger ?? []
  });
}

export function createReward(rewardData) {
  const reward = {
    id: rewardData.id || `reward_${Date.now()}`,
    ...rewardData,
    active: rewardData.active !== false,
    featured: Boolean(rewardData.featured)
  };
  rewardCatalog.push(reward);
  return reward;
}

export function updateReward(rewardId, updates) {
  const index = rewardCatalog.findIndex((entry) => entry.id === rewardId);
  if (index === -1) return null;
  rewardCatalog[index] = { ...rewardCatalog[index], ...updates };
  return rewardCatalog[index];
}

export function deleteReward(rewardId) {
  const index = rewardCatalog.findIndex((entry) => entry.id === rewardId);
  if (index === -1) return false;
  rewardCatalog.splice(index, 1);
  return true;
}

export function toggleRewardStatus(rewardId) {
  const reward = rewardCatalog.find((entry) => entry.id === rewardId);
  if (!reward) return null;
  reward.active = !reward.active;
  return reward;
}

export function getRewardAnalytics() {
  return {
    totalRewards: rewardCatalog.length,
    activeRewards: rewardCatalog.filter((entry) => entry.active).length,
    inactiveRewards: rewardCatalog.filter((entry) => !entry.active).length,
    categoryBreakdown: rewardCatalog.reduce((accumulator, reward) => {
      accumulator[reward.category] = (accumulator[reward.category] || 0) + 1;
      return accumulator;
    }, {})
  };
}
