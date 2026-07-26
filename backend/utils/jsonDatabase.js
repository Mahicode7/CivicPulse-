import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersPath = path.join(__dirname, '../data/users.json');

// Initialize users.json if it doesn't exist
function initializeUsers() {
  if (!fs.existsSync(usersPath)) {
    const defaultUsers = [];
    fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2));
  }
}

// Read users from JSON file
export function readUsers() {
  initializeUsers();
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data || '[]');
}

// Write users to JSON file
export function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// Find user by email
export function findUserByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email);
}

// Find user by ID
export function findUserById(id) {
  const users = readUsers();
  return users.find((u) => String(u.id) === String(id));
}

// Create a new user
export async function createUser(userData) {
  const users = readUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create new user
  const initialPoints = Number(userData.totalPoints ?? userData.availablePoints ?? userData.points ?? 150);
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    points: initialPoints,
    totalPoints: initialPoints,
    availablePoints: initialPoints,
    redeemedPoints: 0,
    rewardHistory: [],
    earnedCertificates: [],
    earnedBadges: [],
    pointsLedger: [],
    issuesReported: 0,
    issuesResolved: 0,
    profileImage: userData.profileImage || null,
    currentLevel: 'Active Citizen',
    currentRank: 'Top 100'
  };
  
  users.push(newUser);
  writeUsers(users);
  
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
}

// Verify password
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Get user without password
export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...sanitized } = user;
  return {
    ...sanitized,
    totalPoints: Number(sanitized.totalPoints ?? sanitized.points ?? 0),
    availablePoints: Number(sanitized.availablePoints ?? sanitized.points ?? 0),
    redeemedPoints: Number(sanitized.redeemedPoints ?? 0),
    rewardHistory: sanitized.rewardHistory || [],
    earnedCertificates: sanitized.earnedCertificates || [],
    earnedBadges: sanitized.earnedBadges || [],
    pointsLedger: sanitized.pointsLedger || [],
    issuesReported: Number(sanitized.issuesReported ?? sanitized.reportsCount ?? 0),
    issuesResolved: Number(sanitized.issuesResolved ?? sanitized.resolvedCount ?? 0),
    profileImage: sanitized.profileImage || null,
    currentLevel: sanitized.currentLevel || 'Active Citizen',
    currentRank: sanitized.currentRank || 'Top 100'
  };
}

export function updateUser(userId, updates) {
  const users = readUsers();
  const index = users.findIndex((user) => String(user.id) === String(userId));

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...updates,
    points: Number(updates.points ?? updates.availablePoints ?? users[index].points ?? 0),
    totalPoints: Number(updates.totalPoints ?? updates.points ?? users[index].totalPoints ?? users[index].points ?? 0),
    availablePoints: Number(updates.availablePoints ?? updates.points ?? users[index].availablePoints ?? users[index].points ?? 0),
    redeemedPoints: Number(updates.redeemedPoints ?? users[index].redeemedPoints ?? 0),
    rewardHistory: updates.rewardHistory ?? users[index].rewardHistory ?? [],
    earnedCertificates: updates.earnedCertificates ?? users[index].earnedCertificates ?? [],
    earnedBadges: updates.earnedBadges ?? users[index].earnedBadges ?? [],
    pointsLedger: updates.pointsLedger ?? users[index].pointsLedger ?? [],
    issuesReported: Number(updates.issuesReported ?? users[index].issuesReported ?? users[index].reportsCount ?? 0),
    issuesResolved: Number(updates.issuesResolved ?? users[index].issuesResolved ?? users[index].resolvedCount ?? 0),
    profileImage: updates.profileImage ?? users[index].profileImage ?? null,
    currentLevel: updates.currentLevel ?? users[index].currentLevel ?? 'Active Citizen',
    currentRank: updates.currentRank ?? users[index].currentRank ?? 'Top 100'
  };

  writeUsers(users);
  return sanitizeUser(users[index]);
}

// Seed demo users
export async function seedDemoUsers() {
  const users = readUsers();
  
  // Check if demo users already exist
  if (users.length > 0) {
    console.log('Users already exist, skipping seed');
    return;
  }
  
  const demoUsers = [
    { name: 'Demo User', email: 'user@example.com', password: 'password', role: 'user' },
    { name: 'Demo Staff', email: 'staff@example.com', password: 'password', role: 'staff' },
    { name: 'Demo Admin', email: 'admin@example.com', password: 'password', role: 'admin' }
  ];
  
  for (const user of demoUsers) {
    try {
      await createUser(user);
      console.log(`✓ Created user: ${user.email}`);
    } catch (err) {
      console.log(`User already exists: ${user.email}`);
    }
  }
}
