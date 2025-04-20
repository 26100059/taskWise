const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot');
const Task = require("./models/Task");

const deleteTimeSlotsByUserId = async (userId, session) => {
  try {
    const tasks = await Task.find({ user_id: userId }).session(session);
    const taskIds = tasks.map(task => task._id);

    if (taskIds.length === 0) {

      return 0;
    }

    const deletedTimeSlots = await TimeSlot.deleteMany({ task_id: { $in: taskIds } }, { session });


    return deletedTimeSlots.deletedCount || 0;

  } catch (error) {
    console.error(`Error deleting time slots for user ${userId}:`, error.message);
    throw new Error(`Error deleting time slots: ${error.message}`);
  }
};


const createNewTimeSlots = async (newTimeSlots, session) => {
  try {
    if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
      throw new Error("Invalid or empty time slots data");
    }

    const timeSlotsToInsert = newTimeSlots.map((slot) => {
      if (!slot.start_time || !slot.end_time) {
        throw new Error("Missing start_time or end_time for time slot");
      }

      return {
        task_id: slot.task_id,
        start_time: new Date(slot.start_time),
        end_time: new Date(slot.end_time)
      };
    });

    const result = await TimeSlot.insertMany(timeSlotsToInsert, { session });


    return result.length;

  } catch (error) {
    console.error("Failed to create time slots:", error.message);
    throw error;
  }
};


const getTimeSlotsByUserId = async (userId) => {
  try {

    const tasks = await Task.find({ user_id: userId, status: "pending" });

    const taskIds = tasks.map(task => task._id);

    const timeSlots = await TimeSlot.find({ task_id: { $in: taskIds } })
      .populate('task_id', 'task_name status duration deadline')
      .exec();

    return timeSlots;
  } catch (error) {
    throw new Error("Error fetching time slots: " + error.message);
  }
};


module.exports = {
  getTimeSlotsByUserId,
  deleteTimeSlotsByUserId,
  createNewTimeSlots,
};
