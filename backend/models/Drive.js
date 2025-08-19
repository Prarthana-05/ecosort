const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  
  lat: Number,
  lng: Number,
   description: String // <-- Add this
});

module.exports = mongoose.model('Drive', driveSchema);
