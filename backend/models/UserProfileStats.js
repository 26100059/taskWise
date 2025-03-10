const mongoose = require('mongoose');

const userProfileStatsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  productivity_score: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('UserProfileStats', userProfileStatsSchema);
