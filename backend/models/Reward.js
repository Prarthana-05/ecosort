const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stars: { type: Number, default: 0 }, // optional, default 0
  voucher: { type: String },           // new field for voucher rewards
  redeemed: { type: Boolean, default: false },
  awardedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', rewardSchema);
