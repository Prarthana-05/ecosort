const mongoose = require('mongoose');

const wasteSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  biodegradable: {
    type: Number,
    required: true
  },
  nonBiodegradable: {
    type: Number,
    required: true
  },
  verifiedBio: {
    type: Boolean,
    default: false
  },
  verifiedNonBio: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WasteSubmission', wasteSubmissionSchema);
