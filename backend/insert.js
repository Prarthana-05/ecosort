// insertDrives.js

const mongoose = require('mongoose');
const Drive = require('./models/Drive'); // adjust path if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecosort', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Hardcoded drive data with lat/lng
const driveData = [
  {
    name: "Mumbai City Cleanup",
    location: "Mumbai, Maharashtra",
    date: "2025-09-01",
    lat: 19.0760,
    lng: 72.8777,
    description: "Join us to clean up the streets of Mumbai and spread awareness."
  },
  {
    name: "Kalyan River Drive",
    location: "Kalyan, Maharashtra",
    date: "2025-09-10",
    lat: 19.2403,
    lng: 73.1305,
    description: "Help restore the beauty of Kalyan’s riverside."
  },
  {
    name: "Thane Lake Cleanup",
    location: "Thane, Maharashtra",
    date: "2025-09-15",
    lat: 19.2183,
    lng: 72.9781,
    description: "A community effort to clean up around Thane Lake."
  }
];

// Insert into the database
Drive.insertMany(driveData)
  .then(() => {
    console.log("✅ Cleanup drives inserted successfully!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error inserting drives:", err);
    mongoose.connection.close();
  });
