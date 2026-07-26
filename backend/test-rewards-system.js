import assert from 'assert';
import { getRewardSummary, redeemReward, getRewardHistory, getPointsHistory, rewardCatalog } from './utils/rewards.js';

const user = {
  id: 'usr_rewards_test',
  name: 'Test Citizen',
  availablePoints: 650,
  totalPoints: 650,
  redeemedPoints: 0,
  rewardHistory: [],
  earnedCertificates: [],
  earnedBadges: [],
  pointsLedger: [],
  issuesReported: 4,
  issuesResolved: 2,
  profileImage: 'https://example.com/avatar.png'
};

const summary = getRewardSummary(user);
assert.strictEqual(summary.availablePoints, 650, 'Summary should expose the available points balance');
assert.strictEqual(summary.issuesReported, 4, 'Summary should include reported issue counts');
assert.strictEqual(summary.issuesResolved, 2, 'Summary should include resolved issue counts');
assert.ok(summary.nextReward, 'Summary should provide the next reward milestone');

const reward = rewardCatalog.find((entry) => entry.id === 'best-citizen-silver');
assert.ok(reward, 'Catalog should include a reward that can be redeemed');

const result = redeemReward(user, reward.id);
assert.strictEqual(result.success, true, 'Redemption should succeed when the user has enough points');
assert.strictEqual(user.availablePoints, 150, 'Available points should be reduced after redemption');
assert.strictEqual(user.redeemedPoints, 500, 'Redeemed points should increase after redemption');
assert.strictEqual(user.rewardHistory.length, 1, 'Reward history should be appended after redemption');
assert.strictEqual(user.pointsLedger.length, 1, 'Points ledger should record the redemption');
assert.strictEqual(getRewardHistory(user).length, 1, 'Reward history helper should surface the new redemption');
assert.strictEqual(getPointsHistory(user).length, 1, 'Points history helper should surface the ledger event');

console.log('Reward system tests passed');
