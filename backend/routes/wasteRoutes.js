const express = require('express');
const router = express.Router();
const WasteSubmission = require('../models/WasteSubmission');
const { verifyToken } = require('../middleware/isAdmin');

// 📜 GET: Waste history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await WasteSubmission.find({ userId }).sort({ submittedAt: -1 });

    const formatted = submissions.map(entry => ({
      submittedAt: entry.submittedAt,
      biodegradable: entry.biodegradable,
      nonBiodegradable: entry.nonBiodegradable,
      status: entry.status,
      verifiedBio: entry.verifiedBio || false,
      verifiedNonBio: entry.verifiedNonBio || false
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching user history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ PATCH: Verify bio or non-bio waste
router.patch('/verify', verifyToken, async (req, res) => {
  try {
    const { userId, verifiedBio, verifiedNonBio } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const updated = [];

    if (verifiedBio !== undefined) {
      const bioEntry = await WasteSubmission.findOne({
        userId,
        biodegradable: { $gt: 0 },
        verifiedBio: false
      }).sort({ submittedAt: -1 });

      if (bioEntry) {
        await WasteSubmission.findByIdAndUpdate(bioEntry._id, { verifiedBio });
        updated.push('biodegradable');
      }
    }

    if (verifiedNonBio !== undefined) {
      const nonBioEntry = await WasteSubmission.findOne({
        userId,
        nonBiodegradable: { $gt: 0 },
        verifiedNonBio: false
      }).sort({ submittedAt: -1 });

      if (nonBioEntry) {
        await WasteSubmission.findByIdAndUpdate(nonBioEntry._id, { verifiedNonBio });
        updated.push('nonBiodegradable');
      }
    }

    res.status(200).json({ message: `Updated: ${updated.join(', ')}`, updatedTypes: updated });
  } catch (err) {
    console.error('Verification update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✍️ POST: Submit waste split by type
router.post('/submit-waste', async (req, res) => {
  try {
    const { userId, biodegradable = 0, nonBiodegradable = 0, status } = req.body;

    // ❌ Prevent empty submission
    if (biodegradable === 0 && nonBiodegradable === 0) {
      return res.status(400).json({ error: 'No waste data submitted' });
    }

    const submission = new WasteSubmission({
      userId,
      biodegradable,
      nonBiodegradable,
      status: status || 'Pending',
      submittedAt: new Date()
    });

    await submission.save();
    res.status(200).json({ message: 'Waste submission saved successfully' });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
