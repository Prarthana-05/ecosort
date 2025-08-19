// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const generateQR = require('../utils/generateQR');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  await user.save();
  user.qrCodePath = await generateQR(user._id);
  await user.save();

  const token = generateToken(user);
  res.json({ token, user: { id: user._id, name: user.name, qrCode: user.qrCodePath } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, user: { id: user._id, name: user.name, qrCode: user.qrCodePath } });
};
