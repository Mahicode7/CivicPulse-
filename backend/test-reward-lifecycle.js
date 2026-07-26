import assert from 'assert';
import { initDb, db } from './database.js';
import { createUser } from './utils/jsonDatabase.js';

async function main() {
  await initDb();

  const timestamp = Date.now();
  const createdUser = await createUser({
    name: 'Lifecycle Tester',
    email: `lifecycle-${timestamp}@test.com`,
    password: 'password',
    role: 'user'
  });

  const before = await db.getUserById(createdUser.id);
  assert.ok(before, 'New auth user should be visible to the complaint/reward database layer');

  db.updateUserPoints(createdUser.id, 15);
  const after = await db.getUserById(createdUser.id);

  assert.strictEqual(after.availablePoints, 165, 'Reported issues should increase the available points balance');
  assert.strictEqual(after.totalPoints, 165, 'Reported issues should increase the total points balance');
  console.log('Reward lifecycle regression test passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
