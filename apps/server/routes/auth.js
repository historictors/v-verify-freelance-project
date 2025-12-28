const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');
const { sendMail } = require('../utils/mailer');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

async function sendOtpEmail(email, otp) {
  const subject = 'Your OTP for V-Verify';
  const text = `Your OTP code is ${otp}. It expires in 10 minutes.`;
  await sendMail({ to: email, subject, text, html: `<p>${text}</p>` });
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    const wasVerified = user?.isVerified;

    if (user && user.passwordHash && wasVerified) {
      return res.status(400).json({ message: 'Account already exists. Please log in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    if (!user) {
      user = new User({ email, name, passwordHash, isVerified: false });
    } else {
      user.passwordHash = passwordHash;
      user.name = name || user.name;
      user.isVerified = Boolean(wasVerified);
    }

    const needsVerification = !user.isVerified;

    if (needsVerification) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendOtpEmail(email, otp);
      return res.json({ message: 'Signup successful. Check your email for the OTP to verify your account.' });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.json({ message: 'Account updated. You can now log in.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
      await sendOtpEmail(email, otp);
      return res.status(403).json({ message: 'Account not verified. We sent you a fresh OTP.', requiresVerification: true });
    }

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);
    return res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpires && user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    // Set admin role if email matches ADMIN_EMAIL
    if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
      user.role = 'admin';
    }

    await user.save();

    const token = signToken(user);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -otp -otpExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const sanitized = user.toObject();
    delete sanitized.passwordHash;
    delete sanitized.otp;
    delete sanitized.otpExpires;

    return res.json({ user: sanitized, message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check-admin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isAdmin = user.role === 'admin';
    return res.json({ isAdmin, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/hello',(req, res) => {

  return res.send('<h1>Hello from V-Verify backend server</h1>');
});

module.exports = router;
