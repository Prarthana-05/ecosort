const mongoose = require('mongoose');

const CollectionCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String, // e.g., "Thane"
    required: true,
  },
  lat: {
    type: Number, // latitude
    required: true,
  },
  lng: {
    type: Number, // longitude
    required: true,
  },
  contact: {
    type: String, // phone/email
  },
  wasteTypes: {
    type: [String], // e.g., ['biodegradable', 'non-biodegradable', 'electronics']
    default: [],
  },
  operatingHours: {
    type: String, // e.g., "9 AM - 5 PM"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CollectionCenter', CollectionCenterSchema);
