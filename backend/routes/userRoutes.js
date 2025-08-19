const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ✅ Required for ObjectId validation
const bcrypt = require('bcrypt');     // ✅ For password hashing
const User = require('../models/User'); // ✅ User model

// ==============================
// GET User Profile
// ==============================
router.get('/profile', async (req, res) => {
  const userId = req.headers['userid'];

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  try {
    const user = await User.findById(userId).select('name email location qrCodePath');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================
// PUT Update Location
// ==============================
router.put('/update-location', async (req, res) => {
  const userId = req.headers['userid'];
  const location = req.body.location?.trim();

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  if (!location || location.length < 2) {
    return res.status(400).json({ error: 'Location must be at least 2 characters' });
  }

  try {
    await User.findByIdAndUpdate(userId, { location });
    res.json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Location update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==============================
// PUT Update Password
// ==============================
router.put('/update-password', async (req, res) => {
  const userId = req.headers['userid'];
  const password = req.body.password?.trim();

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
