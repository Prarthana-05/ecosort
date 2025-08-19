// backend/utils/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '1d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
