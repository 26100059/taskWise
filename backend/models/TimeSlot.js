const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
