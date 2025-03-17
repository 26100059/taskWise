const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  suggestion_text: { type: String, required: true, maxlength: 300 } // roughly 50 words max
}, { timestamps: { updatedAt: 'updated_at' } });

module.exports = mongoose.model('Suggestion', suggestionSchema);
