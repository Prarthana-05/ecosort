// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  location: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Verified', 'Rejected']
  },
  qrCodePath: String // store QR image path
});

module.exports = mongoose.model('User', userSchema);
