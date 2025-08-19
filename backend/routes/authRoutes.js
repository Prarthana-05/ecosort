const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, location } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('Email already registered');

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword, location });
    await user.save();

    // Generate QR code
    const qrText = user._id.toString(); // ✅ Use MongoDB _id only
const qrPath = path.join(__dirname, `../public/qr/${user._id}.png`);
await QRCode.toFile(qrPath, qrText);

user.qrCodePath = `/qr/${user._id}.png`;
await user.save();


    res.status(200).json({
      message: 'Registered!',
      qrPath: user.qrCodePath,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration error');
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(401).send('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        role: user.role,
        _id: user._id,
        token // ✅ If you're checking role on frontend with this
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login error');
  }
});

module.exports = router;
