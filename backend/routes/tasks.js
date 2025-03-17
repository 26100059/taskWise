// backend/routes/tasks.js
//Note: This file handles both tasks and their corresponding timeslots. 

const express = require("express");
const Task = require("../models/Task")
const TimeSlot = require("../models/TimeSlot.js")
const router = express.Router();


//TASK ROUTES
//Create a task
router.post("/", async (req,res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(newTask);
    } catch (error){
        res.status(500).json({error: "Error creating task"});
    }
} );


//TIMESLOTS ROUTES
// Fetch all time slots
router.get("/timeSlots", async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find().populate("task_id"); // Populate task details if needed
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