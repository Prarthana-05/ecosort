const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward'); // ✅ Add this

const Waste = require('../models/WasteSubmission');
const { verifyToken, isAdmin } = require('../middleware/isAdmin');
const mongoose = require('mongoose'); // ✅ REQUIRED for ObjectId check
// Admin dashboard route
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWaste = await Waste.aggregate([
      {
        $group: {
          _id: null,
          totalBio: { $sum: '$biodegradable' },
          totalNonBio: { $sum: '$nonBiodegradable' }
        }
      }
    ]);

    res.json({
      totalUsers,
      wasteSummary: totalWaste[0] || { totalBio: 0, totalNonBio: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// Route to get scanned user info
// Scan and retrieve user data by ID
// Route to get scanned user info
router.get('/scan/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const latestWaste = await Waste.findOne({ userId: id }).sort({ submittedAt: -1 });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      date: latestWaste?.submittedAt || user.lastVisitDate || 'N/A',
      status: user.status || 'Pending',
      bio: latestWaste?.biodegradable || 0,
      nonBio: latestWaste?.nonBiodegradable || 0,
      verifiedBio: latestWaste?.verifiedBio || false,
      verifiedNonBio: latestWaste?.verifiedNonBio || false,
      canVerifyBio: latestWaste?.biodegradable > 0,
      canVerifyNonBio: latestWaste?.nonBiodegradable > 0
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Error retrieving user info' });
  }
});



// Update status
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;

  const updatedWaste = await Waste.findOneAndUpdate(
    { userId: req.params.id },
    { status },
    { new: true, sort: { submittedAt: -1 } }
  );

   await User.findByIdAndUpdate(req.params.id, { status }); // ✨ Add this
  if (!updatedWaste) {
    return res.status(404).json({ error: 'No waste data found' });
  }

  res.json({ message: 'Status updated in waste submission', updatedWaste });
});





// Flexible update for biodegradable and/or nonBiodegradable waste
router.put('/waste/:id', verifyToken, isAdmin, async (req, res) => {
  const { biodegradable, nonBiodegradable } = req.body;

  const updatePayload = {};
  if (biodegradable !== undefined) updatePayload.biodegradable = biodegradable;
  if (nonBiodegradable !== undefined) updatePayload.nonBiodegradable = nonBiodegradable;

  try {
    const updatedWaste = await Waste.findOneAndUpdate(
      { userId: req.params.id },
      { $set: updatePayload },
      { new: true, sort: { submittedAt: -1 } }
    );

    if (!updatedWaste) {
      return res.status(404).json({ error: 'Waste submission not found' });
    }

    res.json({ message: 'Waste updated successfully', updatedWaste });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Error updating waste entry' });
  }
});


// Route for individual verification updates
router.put('/verify/:id', verifyToken, isAdmin, async (req, res) => {
  const { verifiedBio, verifiedNonBio } = req.body;

  try {
    // Update the latest waste submission verification
    const updatedWaste = await Waste.findOneAndUpdate(
      { userId: req.params.id },
      { $set: { verifiedBio, verifiedNonBio } },
      { new: true, sort: { submittedAt: -1 } }
    );

    if (!updatedWaste) return res.status(404).json({ error: 'Waste submission not found' });

    // List of possible rewards
    const rewards = [
      'McDonalds Free Voucher 🎁',
      'Starbucks Coffee Voucher ☕',
      'Flipkart Discount Coupon 🛒'
    ];

    // Pick a random reward
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    // Save the reward in DB
    const rewardEntry = new Reward({
      userId: req.params.id,
      voucher: randomReward
    });
    await rewardEntry.save();

    res.json({
      message: 'Verification updated and reward awarded',
      updatedWaste,
      rewards: [randomReward]
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Error updating verification' });
  }
});



router.get('/rewards', verifyToken, async (req, res) => {
   
  try {
    const userId = req.user._id; // fix here
    const rewards = await Reward.find({ userId }).sort({ awardedAt: -1 });

    if (!rewards.length) {
      return res.json({ message: 'No rewards yet', rewards: [] });
    }

    res.json({ rewards });
  } catch (err) {
    console.error('Error fetching rewards:', err);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});


module.exports = router;
