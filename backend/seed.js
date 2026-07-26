/**
 * Seed script to create demo users in MongoDB
 * Run this after updating the database
 * 
 * Usage: node seed.js
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const DEMO_USERS = [
  {
    name: 'Aravind Swamy',
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  },
  {
    name: 'Officer Suresh',
    email: 'staff@example.com',
    password: 'password',
    role: 'staff'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-pulse');
    console.log('✓ Connected to MongoDB');

    // Check if users already exist
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log(`⚠ Database already has ${existingUsers.length} users. Skipping seed.`);
      console.log('To reset, delete the User collection and run this script again.');
      process.exit(0);
    }

    // Create demo users
    const createdUsers = [];
    for (const userData of DEMO_USERS) {
      const user = new User(userData);
      await user.save();
      createdUsers.push({
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id
      });
    }

    console.log('\n✅ Demo users created successfully!');
    console.log('\n📋 Demo Credentials:\n');
    createdUsers.forEach(user => {
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: password\n`);
    });

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedUsers();
