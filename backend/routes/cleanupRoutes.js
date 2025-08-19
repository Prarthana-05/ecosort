const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WasteCenter = require('../models/wastecenter');
const axios = require('axios');

const GEOCODE_API = "https://nominatim.openstreetmap.org/search";
const geocodeCache = {}; // Simple in-memory cache

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

// GET nearby waste centers
router.get('/nearby', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID missing' });

    const user = await User.findById(userId);
    if (!user || !user.location) return res.status(404).json({ error: 'User or location not found' });

    // Use cache if available
    let userLat, userLon;
    if (geocodeCache[user.location]) {
      ({ lat: userLat, lon: userLon } = geocodeCache[user.location]);
    } else {
      const geoRes = await axios.get(GEOCODE_API, {
        params: { q: user.location, format: 'json', limit: 1 },
        headers: {
          'User-Agent': 'EcosortApp/1.0 (your-email@example.com)',
          'Referer': 'https://ecosort-6zu2.onrender.com'
        }
      });

      if (!geoRes.data.length) return res.status(400).json({ error: 'Invalid location' });

      userLat = parseFloat(geoRes.data[0].lat);
      userLon = parseFloat(geoRes.data[0].lon);

      geocodeCache[user.location] = { lat: userLat, lon: userLon }; // Cache it
    }

    const allCenters = await WasteCenter.find({});
    const nearbyCenters = allCenters.filter(c => {
      if (!c.lat || !c.lng) return false;
      const dist = calculateDistance(userLat, userLon, c.lat, c.lng);
      return dist <= 25;
    });

    res.json(nearbyCenters);
  } catch (err) {
    console.error('Error in /nearby:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
