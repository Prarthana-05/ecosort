const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Drive = require('../models/Drive');
const axios = require('axios');

const GEOCODE_API = "https://nominatim.openstreetmap.org/search";

// Haversine formula to calculate distance between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = angle => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.get('/user-location', async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user || !user.location) {
      return res.status(404).json({ error: 'User or location not found' });
    }

    // Geocode user location
    const geoRes = await axios.get(GEOCODE_API, {
  params: { q: user.location, format: 'json', limit: 1 },
  headers: { 'User-Agent': 'EcosortApp/1.0 (https://ecosort-6zu2.onrender.com)' } 
});

    if (!geoRes.data.length) {
      return res.status(400).json({ error: 'Invalid location' });
    }

    const userLat = parseFloat(geoRes.data[0].lat);
    const userLon = parseFloat(geoRes.data[0].lon);

    const allDrives = await Drive.find({});
    const nearbyDrives = allDrives.filter(d => {
      if (!d.lat || !d.lng) return false;
      const dist = calculateDistance(userLat, userLon, d.lat, d.lng);
      return dist <= 25;
    });

    res.json(nearbyDrives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
