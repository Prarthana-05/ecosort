// insertWasteCenters.js
const mongoose = require('mongoose');
require('dotenv').config();
const WasteCenter = require('./models/wastecenter'); // Make sure path is correct

// Sample data
const wasteCenters = [
  {
    name: "Green Thane Center",
    location: "Thane",
    lat: 19.2183,
    lng: 73.0107,
    contact: "022-12345678",
    wasteTypes: ["biodegradable", "non-biodegradable"],
    operatingHours: "9 AM - 6 PM"
  },
  {
    name: "Eco Mumbai Center",
    location: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    contact: "022-87654321",
    wasteTypes: ["biodegradable", "non-biodegradable"],
    operatingHours: "10 AM - 5 PM"
  },
  {
    name: "Pune Waste Collection Hub",
    location: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    contact: "020-33445566",
    wasteTypes: ["biodegradable", "non-biodegradable"],
    operatingHours: "8 AM - 4 PM"
  },
  {
    name: "Bandra Eco Center",
    location: "Mumbai",
    lat: 19.0590,
    lng: 72.8296,
    contact: "022-99887766",
    wasteTypes: ["biodegradable", "non-biodegradable"],
    operatingHours: "9 AM - 5 PM"
  },
  {
    name: "Thane City Recycling Spot",
    location: "Thane",
    lat: 19.2180,
    lng: 73.0080,
    contact: "022-11223344",
    wasteTypes: ["biodegradable", "non-biodegradable"],
    operatingHours: "10 AM - 6 PM"
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/ecosort', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected');
  
  // Insert data
  await WasteCenter.insertMany(wasteCenters);
  console.log('Waste centers inserted successfully');
  
  mongoose.connection.close();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
