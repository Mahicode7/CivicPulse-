import express from 'express';
import { db } from './database.js';
import authRouter from './routes/auth.js';
import { authMiddleware, roleMiddleware } from './middleware/authMiddleware.js';
import { createReward, deleteReward, getRewardAnalytics, getRewardCatalog, getRewardCategories, getRewardHistory, getRewardSummary, getPointsHistory, redeemReward, saveRewardState, toggleRewardStatus, updateReward } from './utils/rewards.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRouter);

// Helper: Haversine distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // In meters
}

// Helper: Text similarity score (Jaccard index of word tokens)
function getTextSimilarity(text1, text2) {
  const getTokens = (str) => {
    return new Set(
      str
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  };

  const tokens1 = getTokens(text1);
  const tokens2 = getTokens(text2);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return intersection.size / union.size;
}

// --- AI Predict Endpoint ---
router.post('/ai/predict', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required for prediction.' });
  }

  const desc = description.toLowerCase();
  let category = 'Roads';
  let priority = 'Medium';
  let confidence = 0.50;
  let reasons = [];

  // Categorization Rules
  if (desc.includes('pothole') || desc.includes('road') || desc.includes('asphalt') || desc.includes('tar') || desc.includes('crater') || desc.includes('divider')) {
    category = 'Roads';
    confidence = 0.85;
    reasons.push('Detected road maintenance keywords.');
  } else if (desc.includes('garbage') || desc.includes('waste') || desc.includes('trash') || desc.includes('dump') || desc.includes('plastic') || desc.includes('burning') || desc.includes('litter')) {
    category = 'Garbage';
    confidence = 0.90;
    reasons.push('Detected refuse and garbage terms.');
  } else if (desc.includes('leak') || desc.includes('pipe') || desc.includes('water supply') || desc.includes('burst') || desc.includes('tap') || desc.includes('sprinkler')) {
    category = 'Water';
    confidence = 0.88;
    reasons.push('Detected water flow or leak references.');
  } else if (desc.includes(' streetlight') || desc.includes('bulb') || desc.includes('wire') || desc.includes('electricity') || desc.includes('power cut') || desc.includes('dark') || desc.includes('pole')) {
    category = 'Electricity';
    confidence = 0.87;
    reasons.push('Detected light pole or electricity elements.');
  } else if (desc.includes('drain') || desc.includes('sewage') || desc.includes('manhole') || desc.includes('gutter') || desc.includes('overflow') || desc.includes('stagnant')) {
    category = 'Drainage';
    confidence = 0.92;
    reasons.push('Detected drainage clogging/overflow descriptors.');
  } else if (desc.includes('safety') || desc.includes('theft') || desc.includes('harassment') || desc.includes('police') || desc.includes('crime') || desc.includes('street fight') || desc.includes('dark alley')) {
    category = 'Public Safety';
    confidence = 0.82;
    reasons.push('Detected physical safety or public surveillance markers.');
  }

  // Priority Prediction Rules
  if (
    desc.includes('accident') ||
    desc.includes('injury') ||
    desc.includes('critical') ||
    desc.includes('dangerous') ||
    desc.includes('hazard') ||
    desc.includes('skid') ||
    desc.includes('fell') ||
    desc.includes('flooding') ||
    desc.includes('burning') ||
    desc.includes('child') ||
    desc.includes('elderly')
  ) {
    priority = 'Severe';
    confidence += 0.08;
    reasons.push('Identified risk of bodily harm or high-impact environmental hazard.');
  } else if (desc.includes('annoy') || desc.includes('smell') || desc.includes('dirty') || desc.includes('broken') || desc.includes('slow')) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  // Cap confidence at 98%
  confidence = Math.min(0.98, confidence);

  res.json({
    category,
    priority,
    confidence: Math.round(confidence * 100) / 100,
    reason: reasons.join(' ') || 'General structural alignment.'
  });
});

// --- AI Duplicate Check Endpoint ---
router.post('/complaints/check-duplicate', async (req, res) => {
  const { title, description, latitude, longitude, category } = req.body;

  if (!latitude || !longitude || !category) {
    return res.status(400).json({ error: 'Latitude, longitude, and category are required.' });
  }

  const complaints = await db.getComplaints();
  const duplicates = [];

  for (const cmp of complaints) {
    // Check if unresolved
    if (cmp.status === 'Resolved') continue;

    // Check same category
    if (cmp.category.toLowerCase() !== category.toLowerCase()) continue;

    // Check spatial proximity (< 200 meters)
    const distance = getDistance(latitude, longitude, cmp.latitude, cmp.longitude);
    if (distance > 200) continue;

    // Check description or title similarity
    const titleSim = getTextSimilarity(title || '', cmp.title);
    const descSim = getTextSimilarity(description || '', cmp.description);
    const maxSim = Math.max(titleSim, descSim);

    if (maxSim > 0.20 || distance < 60) {
      duplicates.push({
        complaint: cmp,
        distanceInMeters: Math.round(distance),
        similarityScore: Math.round(maxSim * 100) / 100
      });
    }
  }

  // Sort by similarity score descending, distance ascending
  duplicates.sort((a, b) => b.similarityScore - a.similarityScore || a.distanceInMeters - b.distanceInMeters);

  if (duplicates.length > 0) {
    res.json({
      isDuplicate: true,
      matches: duplicates
    });
  } else {
    res.json({
      isDuplicate: false,
      matches: []
    });
  }
});

// --- Complaints Endpoints ---
router.get('/complaints', async (req, res) => {
  try {
    const list = await db.getComplaints();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/complaints/:id', async (req, res) => {
  const complaint = await db.getComplaintById(req.params.id);
  if (complaint) {
    res.json(complaint);
  } else {
    res.status(404).json({ error: 'Complaint not found.' });
  }
});

router.post('/complaints', async (req, res) => {
  try {
    const complaint = await db.createComplaint(req.body);
    // Broadcast notification trigger via helper (if active, server will capture)
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/complaints/:id/vote', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const result = await db.addVote(req.params.id, userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json({ error: result.error });
  }
});

router.get('/complaints/:id/comments', async (req, res) => {
  const comments = await db.getCommentsByComplaintId(req.params.id);
  res.json(comments);
});

router.post('/complaints/:id/comments', async (req, res) => {
  const comment = await db.addComment(req.params.id, req.body);
  if (comment) {
    res.status(201).json(comment);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

// --- Leaderboard ---
router.get('/leaderboard', async (req, res) => {
  const board = await db.getLeaderboard();
  res.json(board);
});

// --- User Profile ---
router.get('/users/:id', async (req, res) => {
  const user = await db.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// --- Rewards Endpoints ---
router.get('/rewards/catalog', authMiddleware, async (req, res) => {
  res.json(getRewardCatalog());
});

router.get('/rewards/categories', authMiddleware, async (req, res) => {
  res.json(getRewardCategories());
});

router.get('/rewards/details/:rewardId', authMiddleware, async (req, res) => {
  const reward = getRewardCatalog().find((entry) => entry.id === req.params.rewardId);
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found' });
  }

  res.json(reward);
});

router.get('/rewards/summary', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(getRewardSummary(user));
});

router.get('/rewards/history', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(getRewardHistory(user));
});

router.get('/rewards/points-history', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(getPointsHistory(user));
});

router.post('/rewards/redeem', authMiddleware, async (req, res) => {
  const { rewardId } = req.body;
  if (!rewardId) {
    return res.status(400).json({ error: 'Reward ID is required.' });
  }

  const user = await db.getUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const result = redeemReward(user, rewardId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  const savedUser = saveRewardState(req.user.userId, result.user);
  if (!savedUser) {
    return res.status(500).json({ error: 'Unable to update reward state.' });
  }

  res.json({ success: true, reward: result.reward, user: savedUser });
});

router.post('/admin/rewards', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const reward = createReward(req.body);
    res.json({ success: true, reward });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create reward.' });
  }
});

router.put('/admin/rewards/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const reward = updateReward(req.params.id, req.body);
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found.' });
  }

  res.json({ success: true, reward });
});

router.delete('/admin/rewards/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const removed = deleteReward(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Reward not found.' });
  }

  res.json({ success: true, removed });
});

router.put('/admin/rewards/:id/toggle', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const reward = toggleRewardStatus(req.params.id);
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found.' });
  }

  res.json({ success: true, reward });
});

router.get('/admin/rewards/analytics', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  res.json(getRewardAnalytics());
});

// --- Admin Endpoints ---
router.put('/admin/complaints/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const { status, officerName, officerDept, officerPhone, officerRank, resolutionImage, adminComment } = req.body;
  const complaint = await db.getComplaintById(req.params.id);

  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const updates = {};
  if (status) {
    updates.status = status;
  }

  // Create officer object if details provided
  if (officerName) {
    updates.assignedOfficer = {
      name: officerName,
      rank: officerRank || 'Senior Inspector',
      department: officerDept || 'Municipal Ward Services',
      phone: officerPhone || '+91 90000 12345'
    };
  }

  // Add event to timeline
  const timeline = [...(complaint.timeline || [])];
  let customTimelineMsg = adminComment || `Complaint status updated to ${status}.`;

  if (status === 'Assigned' && officerName) {
    customTimelineMsg = `Assigned to Officer ${officerName} (${updates.assignedOfficer.department}).`;
  } else if (status === 'Resolved') {
    customTimelineMsg = adminComment || `Issue resolved successfully. Verified on field.`;
    if (resolutionImage) {
      updates.resolutionImage = resolutionImage;
    }
    
    // Reward points for resolution (+50 XP to reporter, +25 to officer)
    if (complaint.reportedBy?.id) {
      db.updateUserPoints(complaint.reportedBy.id, 50);
    }
  }

  timeline.push({
    status: status || complaint.status,
    date: new Date().toISOString(),
    comment: customTimelineMsg,
    ...(status === 'Resolved' && resolutionImage ? { resolutionImage } : {})
  });
  updates.timeline = timeline;

  const updatedComplaint = await db.updateComplaint(req.params.id, updates);
  res.json(updatedComplaint);
});

router.put('/admin/complaints/bulk', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const {
    ids,
    status,
    officerName,
    officerDept,
    officerRank,
    officerPhone,
    resolutionImage,
    adminComment
  } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No complaint IDs provided for bulk update.' });
  }

  const updatedIssues = [];

  for (const id of ids) {
    const complaint = await db.getComplaintById(id);
    if (!complaint) continue;

    const updates = {};
    if (status) {
      updates.status = status;
    }

    if (status === 'Assigned' || status === 'In Progress') {
      updates.assignedOfficer = {
        name: officerName || complaint.assignedOfficer?.name || 'Admin Dispatch Unit',
        rank: officerRank || complaint.assignedOfficer?.rank || 'Chief Administrator',
        department: officerDept || complaint.assignedOfficer?.department || 'BBMP Central Operations',
        phone: officerPhone || complaint.assignedOfficer?.phone || '+91 90000 00000'
      };
    }

    if (status === 'Resolved' && resolutionImage) {
      updates.resolutionImage = resolutionImage;
    }

    const timeline = [...(complaint.timeline || [])];
    let customTimelineMsg = adminComment || `Bulk admin status update to ${status}.`;

    if (status === 'Assigned') {
      customTimelineMsg = `Bulk assigned by admin to ${updates.assignedOfficer.name}.`;
    } else if (status === 'Resolved') {
      customTimelineMsg = adminComment || 'Bulk resolved by admin.';
    }

    timeline.push({
      status: status || complaint.status,
      date: new Date().toISOString(),
      comment: customTimelineMsg,
      ...(status === 'Resolved' && resolutionImage ? { resolutionImage } : {})
    });

    updates.timeline = timeline;

    const updatedComplaint = await db.updateComplaint(id, updates);
    if (updatedComplaint) {
      updatedIssues.push(updatedComplaint);
    }
  }

  res.json({ success: true, updatedCount: updatedIssues.length, updatedIssues });
});

export default router;
