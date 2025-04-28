// const mongoose = require('mongoose');
// const TimeSlot = require('./models/TimeSlot');
// const Task = require("./models/Task");

// const deleteTimeSlotsByUserId = async (userId, session) => {
//   try {
//     const tasks = await Task.find({ user_id: userId }).session(session);
//     const taskIds = tasks.map(task => task._id);

//     if (taskIds.length === 0) {

//       return 0;
//     }

//     const deletedTimeSlots = await TimeSlot.deleteMany({ task_id: { $in: taskIds } }, { session });


//     return deletedTimeSlots.deletedCount || 0;

//   } catch (error) {
//     console.error(`Error deleting time slots for user ${userId}:`, error.message);
//     throw new Error(`Error deleting time slots: ${error.message}`);
//   }
// };


// const createNewTimeSlots = async (newTimeSlots, session) => {
//   try {
//     if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
//       throw new Error("Invalid or empty time slots data");
//     }

//     const timeSlotsToInsert = newTimeSlots.map((slot) => {
//       if (!slot.start_time || !slot.end_time) {
//         throw new Error("Missing start_time or end_time for time slot");
//       }

//       return {
//         task_id: slot.task_id,
//         start_time: new Date(slot.start_time),
//         end_time: new Date(slot.end_time)
//       };
//     });

//     const result = await TimeSlot.insertMany(timeSlotsToInsert, { session });


//     return result.length;

//   } catch (error) {
//     console.error("Failed to create time slots:", error.message);
//     throw error;
//   }
// };


// const getTimeSlotsByUserId = async (userId) => {
//   try {

//     const tasks = await Task.find({ user_id: userId, status: "pending" });

//     const taskIds = tasks.map(task => task._id);

//     const timeSlots = await TimeSlot.find({ task_id: { $in: taskIds } })
//       .populate('task_id', 'task_name status duration deadline')
//       .exec();

//     return timeSlots;
//   } catch (error) {
//     throw new Error("Error fetching time slots: " + error.message);
//   }
// };


// module.exports = {
//   getTimeSlotsByUserId,
//   deleteTimeSlotsByUserId,
//   createNewTimeSlots,
// };




//nafees

// dbFunctions.js
const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot');  // Assuming TimeSlot model is defined
const Task = require("./models/Task");

const deleteTimeSlotsByUserId = async (userId, session) => {
  try {
    const tasks = await Task.find({ user_id: userId }).session(session);
    const taskIds = tasks.map(task => task._id);

    if (taskIds.length === 0) {
      console.log(`No tasks found for user ${userId}. No time slots to delete.`);
      return 0;
    }

    const deletedTimeSlots = await TimeSlot.deleteMany({ task_id: { $in: taskIds } }, { session });
    console.log(`${deletedTimeSlots.deletedCount} time slots deleted for user ${userId}.`);

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
    console.log(`${result.length} time slot(s) created successfully.`);

    return result.length;

  } catch (error) {
    console.error("Failed to create time slots:", error.message);
    throw error;
  }
};


//Fetches timeslots and populates them with task name.
const getTimeSlotsByUserId = async (userId) => {
  try {

    // Step 1: Find all tasks associated with the user_id plus only the pending tasks.
    const tasks = await Task.find({ user_id: userId, status: "pending" });

    // Step 2: Extract task IDs from the tasks
    const taskIds = tasks.map(task => task._id);

    // Step 3: Fetch all time slots for the extracted task IDs, and populate task details (task_name, status, etc.)
    const timeSlots = await TimeSlot.find({ task_id: { $in: taskIds } })
      .populate('task_id', 'task_name status duration deadline') // Populate the task_id with selected task fields
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
