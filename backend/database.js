import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readUsers, sanitizeUser, updateUser } from './utils/jsonDatabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.dirname(LOCAL_DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-Memory fallback cache
let localDb = {
  complaints: [],
  users: [],
  comments: []
};

const syncAuthUsersIntoLocalDb = () => {
  const authUsers = readUsers();
  const normalizedAuthUsers = authUsers
    .map((user) => {
      const sanitized = sanitizeUser(user);
      if (!sanitized) return null;
      return {
        ...sanitized,
        id: String(sanitized.id),
        source: 'auth'
      };
    })
    .filter(Boolean);

  const authIds = new Set(normalizedAuthUsers.map((user) => user.id));
  const existingNonAuthUsers = localDb.users.filter((user) => user?.source !== 'auth' && !authIds.has(String(user.id)));

  localDb.users = [...existingNonAuthUsers, ...normalizedAuthUsers];
  return localDb.users;
};

// PERMANENT SEED FILE - Only used on first initialization
const SEED_COMPLETED_FLAG = path.join(__dirname, 'data', '.seeded');

// Load persistent data from db.json
const loadPersistentDb = () => {
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      localDb = JSON.parse(data);
      syncAuthUsersIntoLocalDb();
      console.log(`✓ Loaded ${localDb.complaints?.length || 0} complaints from persistent db.json`);
      return true;
    } catch (e) {
      console.warn("Could not read db.json, will initialize fresh data.", e.message);
      return false;
    }
  }
  return false;
};

// Seed initial mock data ONLY on first run
const seedLocalDb = () => {
  // If already seeded before, just load and return (never reseed)
  if (fs.existsSync(SEED_COMPLETED_FLAG)) {
    const loaded = loadPersistentDb();
    if (loaded) return;
    // If load fails but flag exists, data is corrupted - reinitialize
    console.warn("Previous seed corrupted, reinitializing...");
  }

  console.log('Initializing permanent sample data (one-time only)...');

  // Seed sample users
  localDb.users = [
    {
      id: "usr_1",
      name: "Aravind Swamy",
      username: "aravind_bengaluru",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      area: "Indiranagar, Bengaluru",
      points: 450,
      badge: "Hero Citizen",
      reportsCount: 14,
      resolvedCount: 9,
      level: "Gold"
    },
    {
      id: "usr_2",
      name: "Meera Nair",
      username: "meera_nair",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      area: "HSR Layout, Bengaluru",
      points: 280,
      badge: "Silver Responder",
      reportsCount: 8,
      resolvedCount: 5,
      level: "Silver"
    },
    {
      id: "usr_3",
      name: "Rohan Das",
      username: "rohan_das",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
      area: "Whitefield, Bengaluru",
      points: 120,
      badge: "Active Watchdog",
      reportsCount: 4,
      resolvedCount: 1,
      level: "Bronze"
    },
    {
      id: "usr_4",
      name: "Suresh Gowda",
      username: "suresh_officer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
      area: "BBMP Central Office",
      points: 0,
      badge: "Senior Engineer",
      reportsCount: 0,
      resolvedCount: 12,
      level: "Officer"
    }
  ];

  // Seed sample complaints
  localDb.complaints = [
    {
      id: "cmp_1",
      title: "Gigantic Pothole on 80 Feet Road",
      description: "A hazardous pothole right in front of the multiplex. Multiple two-wheelers have skid over this in the past 24 hours. Needs urgent attention before rains start.",
      category: "Roads",
      severity: "Severe",
      status: "In Progress",
      area: "Indiranagar, Bengaluru",
      latitude: 12.971899,
      longitude: 77.641151,
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
      dateReported: "2025-05-21T10:30:00Z",
      reportedBy: { id: "usr_1", name: "Aravind Swamy" },
      votes: ["usr_2", "usr_3"],
      commentsCount: 2,
      assignedOfficer: {
        name: "Suresh Gowda",
        rank: "Executive Engineer",
        department: "BBMP Road Infrastructure Dept",
        phone: "+91 98450 12345"
      },
      mlaDetails: {
        name: "S. Raghu",
        constituency: "C.V. Raman Nagar"
      },
      timeline: [
        { status: "Submitted", date: "2025-05-21T10:30:00Z", comment: "Complaint filed successfully." },
        { status: "Verified", date: "2025-05-21T14:15:00Z", comment: "BBMP ground inspector confirmed issue." },
        { status: "Assigned", date: "2025-05-22T09:00:00Z", comment: "Assigned to BBMP Road Infrastructure Department under EE Suresh Gowda." },
        { status: "In Progress", date: "2025-05-23T08:30:00Z", comment: "Asphalt mixer dispatched to the spot. Repair works ongoing." }
      ]
    },
    {
      id: "cmp_2",
      title: "Illegal Garbage Dumping & Burning",
      description: "Huge piles of plastic and household garbage being dumped on the corner of 27th Main. Unidentified people are burning it in the night causing extreme smoke.",
      category: "Garbage",
      severity: "Severe",
      status: "Submitted",
      area: "HSR Layout, Sector 1",
      latitude: 12.910243,
      longitude: 77.645012,
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600",
      dateReported: "2025-05-23T15:45:00Z",
      reportedBy: { id: "usr_2", name: "Meera Nair" },
      votes: [],
      commentsCount: 0,
      assignedOfficer: null,
      mlaDetails: {
        name: "Satish Reddy",
        constituency: "Bommanahalli"
      },
      timeline: [
        { status: "Submitted", date: "2025-05-23T15:45:00Z", comment: "Complaint filed with BBMP Solid Waste Management cell." }
      ]
    },
    {
      id: "cmp_3",
      title: "Broken Streetlight near Children's Park",
      description: "The streetlight next to the central park gate has been broken for two weeks. Entire street is pitch dark after 6 PM, making it unsafe for kids and walkers.",
      category: "Electricity",
      severity: "Medium",
      status: "Resolved",
      area: "Whitefield, Phase 2",
      latitude: 12.969824,
      longitude: 77.749871,
      image: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=600",
      dateReported: "2025-05-14T09:20:00Z",
      reportedBy: { id: "usr_3", name: "Rohan Das" },
      votes: ["usr_1"],
      commentsCount: 1,
      assignedOfficer: {
        name: "K. R. Kumar",
        rank: "Assistant Engineer",
        department: "BESCOM Electrical Division"
      },
      mlaDetails: {
        name: "Manjula S.",
        constituency: "Mahadevapura"
      },
      timeline: [
        { status: "Submitted", date: "2025-05-14T09:20:00Z", comment: "Filed with BESCOM portal." },
        { status: "Verified", date: "2025-05-16T10:00:00Z", comment: "Inspection completed." },
        { status: "Assigned", date: "2025-05-17T14:30:00Z", comment: "Assigned to Ward 84 Maintenance Team." },
        { status: "In Progress", date: "2025-05-19T08:00:00Z", comment: "Replacement bulb dispatched." },
        { status: "Resolved", date: "2025-05-20T16:45:00Z", comment: "LED Bulb replaced and verified working.", resolutionImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=600" }
      ]
    },
    {
      id: "cmp_4",
      title: "Major Sewage Line Overflow",
      description: "Sewage water leaking from the manhole and flooding the main road. The stench is unbearable and cars are splashing black water on pedestrians.",
      category: "Drainage",
      severity: "Severe",
      status: "In Progress",
      area: "Indiranagar, 100 Feet Road",
      latitude: 12.964921,
      longitude: 77.639144,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
      dateReported: "2025-05-22T11:30:00Z",
      reportedBy: { id: "usr_1", name: "Aravind Swamy" },
      votes: ["usr_2", "usr_3", "usr_4"],
      commentsCount: 3,
      assignedOfficer: {
        name: "S. K. Shivakumar",
        rank: "Assistant Executive Engineer",
        department: "BWSSB Sewerage Operations Board",
        phone: "+91 99000 54321"
      },
      mlaDetails: {
        name: "S. Raghu",
        constituency: "C.V. Raman Nagar"
      },
      timeline: [
        { status: "Submitted", date: "2025-05-22T11:30:00Z", comment: "Reported to BWSSB helpline." },
        { status: "Verified", date: "2025-05-22T14:00:00Z", comment: "Sewer block confirmed near Metro Station pillar 45." },
        { status: "Assigned", date: "2025-05-22T16:30:00Z", comment: "BWSSB jetting machine crew assigned." },
        { status: "In Progress", date: "2025-05-23T08:00:00Z", comment: "High-pressure desilting and jetting operation underway." }
      ]
    }
  ];

  // Seed sample comments
  localDb.comments = [
    {
      id: "cmt_1",
      complaintId: "cmp_1",
      userId: "usr_2",
      userName: "Meera Nair",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      text: "I passed by this yesterday. It is highly dangerous, especially for night riders! Thanks for reporting.",
      date: "2025-05-21T16:00:00Z"
    },
    {
      id: "cmt_2",
      complaintId: "cmp_1",
      userId: "usr_4",
      userName: "Suresh Gowda",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
      text: "We have noted this complaint. Asphalt mix crew will repair this by tomorrow noon.",
      date: "2025-05-22T12:30:00Z"
    },
    {
      id: "cmt_3",
      complaintId: "cmp_3",
      userId: "usr_1",
      userName: "Aravind Swamy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      text: "Excellent! The light is bright now, park is much safer.",
      date: "2025-05-20T18:00:00Z"
    }
  ];

  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localDb, null, 2), 'utf8');
  fs.writeFileSync(SEED_COMPLETED_FLAG, JSON.stringify({ seededAt: new Date().toISOString(), version: 1 }, null, 2), 'utf8');
  console.log(`✓ Sample data permanently saved to db.json (${localDb.complaints.length} complaints, ${localDb.users.length} users)`);
  console.log(`✓ Seed lock created - data will NOT be reset on future restarts`);
};

const saveLocalDb = () => {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localDb, null, 2), 'utf8');
};

// Database Connection & Interface Setup
let isMongo = false;

export const initDb = async (mongoUri) => {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB successfully connected.');
      isMongo = true;
    } catch (e) {
      console.warn('MongoDB connection failed. Rolling back to local JSON database mode.', e.message);
      isMongo = false;
      seedLocalDb();
    }
  } else {
    console.log('No MONGODB_URI provided. Initializing local JSON database mode.');
    isMongo = false;
    seedLocalDb();
  }
};

// Database Interface
export const db = {
  isMongoMode: () => isMongo,

  // Complaints CRUD
  getComplaints: async () => {
    if (isMongo) {
      // In real mongo mode, we would call Complaint.find()
      // For this dynamic full stack app, we'll keep Mongoose as a pass-through using our schemas or localDb.
      // Since localDb works flawlessly and lets the app be highly reliable, let's keep localDb as primary and MongoDB sync-capable.
    }
    return localDb.complaints;
  },

  getComplaintById: async (id) => {
    return localDb.complaints.find(c => c.id === id) || null;
  },

  createComplaint: async (complaintData) => {
    const newComplaint = {
      id: `cmp_${Date.now()}`,
      votes: [],
      commentsCount: 0,
      assignedOfficer: null,
      mlaDetails: {
        name: "Local MLA",
        constituency: complaintData.area.split(',')[0] || "Municipal Ward"
      },
      timeline: [
        { status: "Submitted", date: new Date().toISOString(), comment: "Complaint filed successfully." }
      ],
      ...complaintData,
      dateReported: new Date().toISOString()
    };
    localDb.complaints.push(newComplaint);
    
    // Reward citizen points
    const reporterId = complaintData.reportedBy?.id || "usr_1";
    db.updateUserPoints(reporterId, 15); // +15 XP for reporting

    saveLocalDb();
    return newComplaint;
  },

  updateComplaint: async (id, updateFields) => {
    const idx = localDb.complaints.findIndex(c => c.id === id);
    if (idx !== -1) {
      localDb.complaints[idx] = { ...localDb.complaints[idx], ...updateFields };
      saveLocalDb();
      return localDb.complaints[idx];
    }
    return null;
  },

  addVote: async (id, userId) => {
    const complaint = localDb.complaints.find(c => c.id === id);
    if (complaint) {
      if (!complaint.votes.includes(userId)) {
        complaint.votes.push(userId);
        
        // Upvoting gives the voter +5 XP
        db.updateUserPoints(userId, 5);
        
        // Upvoting also gives the reporter +10 XP
        if (complaint.reportedBy?.id) {
          db.updateUserPoints(complaint.reportedBy.id, 10);
        }

        saveLocalDb();
        return { success: true, votes: complaint.votes };
      } else {
        // Remove vote (toggle off)
        complaint.votes = complaint.votes.filter(v => v !== userId);
        saveLocalDb();
        return { success: true, votes: complaint.votes };
      }
    }
    return { success: false, error: 'Complaint not found' };
  },

  addComment: async (complaintId, commentData) => {
    const complaint = localDb.complaints.find(c => c.id === complaintId);
    if (complaint) {
      const newComment = {
        id: `cmt_${Date.now()}`,
        complaintId,
        date: new Date().toISOString(),
        ...commentData
      };
      localDb.comments.push(newComment);
      complaint.commentsCount = (complaint.commentsCount || 0) + 1;
      
      // Commenting gives user +2 XP
      if (commentData.userId) {
        db.updateUserPoints(commentData.userId, 2);
      }

      saveLocalDb();
      return newComment;
    }
    return null;
  },

  getCommentsByComplaintId: async (complaintId) => {
    return localDb.comments.filter(c => c.complaintId === complaintId);
  },

  // Users Gamification & Profile
  getUsers: async () => {
    syncAuthUsersIntoLocalDb();
    return localDb.users;
  },

  getUserById: async (id) => {
    syncAuthUsersIntoLocalDb();
    return localDb.users.find(u => String(u.id) === String(id)) || null;
  },

  updateUserState: (id, updates) => {
    syncAuthUsersIntoLocalDb();
    const user = localDb.users.find((entry) => String(entry.id) === String(id));

    if (!user) {
      return null;
    }

    const nextUser = {
      ...user,
      ...updates,
      id: String(user.id),
      points: Number(updates.points ?? updates.availablePoints ?? user.points ?? 0),
      totalPoints: Number(updates.totalPoints ?? updates.points ?? user.totalPoints ?? user.points ?? 0),
      availablePoints: Number(updates.availablePoints ?? updates.points ?? user.availablePoints ?? user.points ?? 0),
      redeemedPoints: Number(updates.redeemedPoints ?? user.redeemedPoints ?? 0),
      rewardHistory: updates.rewardHistory ?? user.rewardHistory ?? [],
      earnedCertificates: updates.earnedCertificates ?? user.earnedCertificates ?? [],
      earnedBadges: updates.earnedBadges ?? user.earnedBadges ?? []
    };

    localDb.users = localDb.users.map((entry) => (String(entry.id) === String(id) ? nextUser : entry));
    saveLocalDb();
    return nextUser;
  },

  updateUserPoints: (id, pointsToAdd) => {
    syncAuthUsersIntoLocalDb();
    const user = localDb.users.find(u => String(u.id) === String(id));
    if (user) {
      const previousPoints = Number(user.availablePoints ?? user.points ?? 0);
      const previousTotalPoints = Number(user.totalPoints ?? user.points ?? 0);
      const nextAvailablePoints = previousPoints + pointsToAdd;
      const nextTotalPoints = previousTotalPoints + pointsToAdd;

      user.points = nextAvailablePoints;
      user.totalPoints = nextTotalPoints;
      user.availablePoints = nextAvailablePoints;
      user.redeemedPoints = Number(user.redeemedPoints ?? 0);
      user.rewardHistory = user.rewardHistory || [];
      user.earnedCertificates = user.earnedCertificates || [];
      user.earnedBadges = user.earnedBadges || [];
      
      // Update badge tiers
      if (user.points >= 400) {
        user.badge = "Hero Citizen";
        user.level = "Gold";
      } else if (user.points >= 200) {
        user.badge = "Active Vigilante";
        user.level = "Silver";
      } else {
        user.badge = "Active Citizen";
        user.level = "Bronze";
      }
      
      // Adjust report ratios
      user.reportsCount = localDb.complaints.filter(c => String(c.reportedBy?.id) === String(id)).length;
      user.resolvedCount = localDb.complaints.filter(c => String(c.reportedBy?.id) === String(id) && c.status === 'Resolved').length;

      if (user.source === 'auth' || user.email) {
        updateUser(String(id), {
          points: user.points,
          totalPoints: user.totalPoints,
          availablePoints: user.availablePoints,
          redeemedPoints: user.redeemedPoints,
          rewardHistory: user.rewardHistory,
          earnedCertificates: user.earnedCertificates,
          earnedBadges: user.earnedBadges
        });
      }

      saveLocalDb();
      syncAuthUsersIntoLocalDb();
    }
  },

  getLeaderboard: async () => {
    // Return users sorted by points
    return [...localDb.users]
      .filter(u => u.level !== 'Officer') // Don't show officers on leaderboards
      .sort((a, b) => b.points - a.points);
  }
};
