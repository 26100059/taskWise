// dbFunctions.js
const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot');  // Assuming TimeSlot model is defined
const Task = require("./models/Task");

// Function to delete all time slots for a given userId
const deleteTimeSlotsByUserId = async (userId, session) => {
    try {
      // Step 1: Find all task_ids that belong to the user
      const tasks = await Task.find({ user_id: userId }).session(session);
      const taskIds = tasks.map(task => task._id);
  
      if (taskIds.length === 0) {
        console.log(`No tasks found for user ${userId}. No time slots to delete.`);
        return;
      }
  
      // Step 2: Delete time slots where task_id is in the list of taskIds
      const deletedTimeSlots = await TimeSlot.deleteMany({ task_id: { $in: taskIds } }, { session });
  
      console.log(`${deletedTimeSlots.deletedCount} time slots deleted for user ${userId}.`);
  
    } catch (error) {
      console.error(`Error deleting time slots for user ${userId}:`, error.message);
      throw new Error(`Error deleting time slots: ${error.message}`);
    }
  };
  

// Function to create new time slots
const createNewTimeSlots = async (newTimeSlots, session) => {
    try {
      if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
        throw new Error("Invalid or empty time slots data");
      }
  
      // Prepare the time slots for insertion, using task_id already present in the slot
      const timeSlotsToInsert = newTimeSlots.map((slot) => {
        if (!slot.start_time || !slot.end_time) {
          throw new Error("Missing start_time or end_time for time slot");
        }
  
        return {
          task_id: slot.task_id,  // Use task_id from the provided slot data
          start_time: new Date(slot.start_time), // Ensure it is a Date object
          end_time: new Date(slot.end_time)      // Ensure it is a Date object
        };
      });
  
      // Insert all time slots at once
      const result = await TimeSlot.insertMany(timeSlotsToInsert, { session });
  
      // Log the count of successfully inserted time slots
      console.log(`${result.length} time slot(s) created successfully.`);
  
    } catch (error) {
      console.error("Failed to create time slots:", error.message);
      throw error;
    }
  };
  


//Fetches timeslots and populates them with task name.
const getTimeSlotsByUserId = async (userId) => {
    try {
      
      // Step 1: Find all tasks associated with the user_id only.
      // const tasks = await Task.find({ user_id: userId });
      
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
    createNewTimeSlots
};
