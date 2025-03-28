// backend/routes/tasks.js
//Note: This file handles both tasks and their corresponding timeslots. 
const mongoose = require('mongoose');

const express = require("express");
const Task = require("../models/Task")
const TimeSlot = require("../models/TimeSlot.js")
const router = express.Router();


// const FIXED_USER_ID = new mongoose.Types.ObjectId("67d96ed12fa6e5fb171af63f"); //sherlock holmes


//TIMESLOTS ROUTES
// Fetch all time slots. Note: This is a different kind of fetch of timeslots as it updates the timeslots slightly.
//For normal use of fetching timeslots, testingDB shall be used.
router.get("/timeSlots", async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find().populate("task_id"); // Populate task details if needed
        // const timeSlots = await TimeSlot.find({ user_id: FIXED_USER_ID }).populate("task_id");
        res.json(timeSlots);
    } catch (error) {
        res.status(500).json({ error: "Error fetching time slots" });
    }
});

// Update time slot when dragged and dropped
router.put("/timeSlots/:id", async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;

    try {
        // Find and update the time slot
        const updatedSlot = await TimeSlot.findByIdAndUpdate(
            id,
            { start_time, end_time }, // No need to manually set updated_at since its auto set in mongo schema
            { new: true } // Returns the updated document
        );

        if (!updatedSlot) {
            return res.status(404).json({ error: "Time slot not found" });
        }

        res.json(updatedSlot);
    } catch (error) {
        console.error("Error updating time slot:", error);
        res.status(500).json({ error: "Failed to update time slot" });
    }
});

//what timeSlots look like when fetched from DB above. Normally, they look like how the DB schema shows them.
//This change is done using 'populate' function so that full calendar can be given the task name to display.

/* Output:
[
  {
    _id: "slot123",
    task_id: {
      _id: "task456",
      task_name: "Finish project",
      duration: 60,
      status: 'pending'
      deadline: "2025-03-20T10:00:00Z"
      created_at: "2025-03-20T10:00:00Z"
      updated_at: "2025-03-20T10:00:00Z"
      created_at: "2025-03-20T10:00:00Z"
      updated_at: "2025-03-20T10:00:00Z"

    },
    start_time: "2025-03-19T08:00:00Z",
    end_time: "2025-03-19T09:00:00Z"
    created_at: "2025-03-20T10:00:00Z"
    updated_at: "2025-03-20T10:00:00Z"
  }
]
*/

module.exports = router;