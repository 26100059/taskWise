const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task_name: { type: String, required: true },
  duration: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Task', taskSchema);
