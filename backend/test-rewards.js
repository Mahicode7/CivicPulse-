import assert from 'assert';
import { redeemReward, rewardCatalog } from './utils/rewards.js';

const user = {
  id: 'usr_test',
  name: 'Test Citizen',
  availablePoints: 120,
  totalPoints: 120,
  redeemedPoints: 0,
  rewardHistory: []
};

const reward = {
  id: 'reward_voucher_50',
  name: '₹50 Shopping Voucher',
  pointsRequired: 100,
  active: true,
  category: 'voucher'
};

rewardCatalog.push(reward);

const result = redeemReward(user, reward.id);
assert.strictEqual(result.success, true, 'Reward redemption should succeed for enough points');
assert.strictEqual(user.availablePoints, 20, 'Available points should decrease after redemption');
assert.strictEqual(user.redeemedPoints, 100, 'Redeemed points should increase after redemption');
assert.strictEqual(user.rewardHistory.length, 1, 'Reward history should be updated');
console.log('Reward tests passed');
