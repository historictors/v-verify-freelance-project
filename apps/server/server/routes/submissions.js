const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

// Create a submission only for authenticated users. No OTP side-effects.
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, phone, verificationType, relationship, email } = req.body;
    if (!fullName || !phone || !verificationType || !relationship) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const submission = new Submission({
      fullName,
      phone,
      verificationType,
      relationship,
      email: email || user.email,
      user: user._id,
    });
    await submission.save();

    return res.json({ message: 'Submission saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for the authenticated user
router.get('/me', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ submissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: check if user is admin (middleware already validates JWT)
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: list users (protected by ADMIN_TOKEN header)
router.get('/admin/users', auth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list submissions
router.get('/admin/submissions', auth, checkAdmin, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || undefined;
    const query = Submission.find().populate('user').sort({ createdAt: -1 });
    if (limit) query.limit(limit);
    const submissions = await query.lean();
    return res.json({ submissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update submission status
router.put('/admin/submissions/:id/status', auth, checkAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in-progress', 'completed', 'rejected'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.status = status;
    await submission.save();

    return res.json({ message: 'Status updated', submission });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
