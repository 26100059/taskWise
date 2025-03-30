// // backend/routes/tasks.js
// //Note: This file handles both tasks and their corresponding timeslots. 

// const express = require("express");
// const Task = require("../models/Task")
// const TimeSlot = require("../models/TimeSlot.js")
// const router = express.Router();


// //TASK ROUTES
// //Create a task
// router.post("/", async (req, res) => {
//     try {
//         const newTask = new Task(req.body);
//         await newTask.save();
//         res.json(newTask);
//     } catch (error) {
//         res.status(500).json({ error: "Error creating task" });
//     }
// });


// //TIMESLOTS ROUTES
// // Fetch all time slots
// router.get("/timeSlots", async (req, res) => {
//     try {
//         const timeSlots = await TimeSlot.find().populate("task_id"); // Populate task details if needed
//         res.json(timeSlots);
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching time slots" });
//     }
// });

// // Update time slot when dragged and dropped
// router.put("/timeSlots/:id", async (req, res) => {
//     const { id } = req.params;
//     const { start_time, end_time } = req.body;

//     try {
//         // Find and update the time slot
//         const updatedSlot = await TimeSlot.findByIdAndUpdate(
//             id,
//             { start_time, end_time }, // No need to manually set updated_at since its auto set in mongo schema
//             { new: true } // Returns the updated document
//         );

//         if (!updatedSlot) {
//             return res.status(404).json({ error: "Time slot not found" });
//         }

//         res.json(updatedSlot);
//     } catch (error) {
//         console.error("Error updating time slot:", error);
//         res.status(500).json({ error: "Failed to update time slot" });
//     }
// });

// //what timeSlots look like when fetched from DB above. Normally, they look like how the DB schema shows them.
// //This change is done using 'populate' function so that full calendar can be given the task name to display.

// /* Output:
// [
//   {
//     _id: "slot123",
//     task_id: {
//       _id: "task456",
//       task_name: "Finish project",
//       duration: 60,
//       status: 'pending'
//       deadline: "2025-03-20T10:00:00Z"
//       created_at: "2025-03-20T10:00:00Z"
//       updated_at: "2025-03-20T10:00:00Z"
//       created_at: "2025-03-20T10:00:00Z"
//       updated_at: "2025-03-20T10:00:00Z"

//     },
//     start_time: "2025-03-19T08:00:00Z",
//     end_time: "2025-03-19T09:00:00Z"
//     created_at: "2025-03-20T10:00:00Z"
//     updated_at: "2025-03-20T10:00:00Z"
//   }
// ]
// */

// module.exports = router;




// backend/routes/tasks.js
const express = require("express");
const Task = require("../models/Task");
const TimeSlot = require("../models/TimeSlot.js");
const UserProfileStats = require("../models/UserProfileStats.js");
const authenticateToken= require("../routes/token.js");
const router = express.Router();

// XP Configuration
const XP_VALUES = {
  TASK_CREATED: 10,
  TASK_COMPLETED: 30,
  TASK_OVERDUE: -15,
  TASK_UPDATED: 5
};

// ===== TASK ROUTES (Protected) =====
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Create task with user context
    const newTask = new Task({
      ...req.body,
      user_id: req.userId // From JWT token
    });

    await newTask.save();

    // Update profile stats
    await UserProfileStats.findOneAndUpdate(
      { user_id: req.userId },
      { 
        $inc: { xp: XP_VALUES.TASK_CREATED },
        $set: { updated_at: new Date() }
      },
      { upsert: true, new: true }
    );

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: "Error creating task" });
  }
});

// ===== NEW STATUS ENDPOINT =====
router.put("/:id/status", async (req, res) => {
  try {
    // Validate status transition
    const validTransitions = {
      pending: ['in-progress', 'canceled'],
      'in-progress': ['completed', 'blocked'],
      completed: ['reopened'],
      overdue: ['completed']
    };

    const task = await Task.findOne({ 
      _id: req.params.id,
      user_id: req.userId 
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    // Check valid status transition
    if (!validTransitions[task.status]?.includes(req.body.status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${task.status} to ${req.body.status}`
      });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // Calculate XP
    let xpDelta = 0;
    switch(req.body.status) {
      case 'completed':
        xpDelta = XP_VALUES.TASK_COMPLETED;
        break;
      case 'overdue':
        xpDelta = XP_VALUES.TASK_OVERDUE;
        break;
      default:
        xpDelta = XP_VALUES.TASK_UPDATED;
    }

    // Update profile stats
    let stats = await UserProfileStats.findOneAndUpdate(
      { user_id: req.userId },
      { 
        $inc: { xp: xpDelta },
        $set: { updated_at: new Date() }
      },
      { new: true, upsert: true }
    );
       // Make sure XP stays between 0 and 100 (exclusive)
        stats.xp = stats.xp % 100;
    // Auto-leveling
    const newLevel = Math.floor(stats.xp / 100) + 1;

    if (newLevel > stats.level) {
      await UserProfileStats.updateOne(
        { _id: stats._id },
        { $set: { level: newLevel } }
      );
        stats = await UserProfileStats.findOne({ user_id: req.userId });

    }

    res.json({
      task: updatedTask,
      stats: {
        xp: stats.xp,
        level: newLevel > stats.level ? newLevel : stats.level
      }
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Error updating task status" });
  }
});

// ===== ENHANCED TIMESLOTS ROUTES =====
router.get("/timeSlots", async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({ user_id: req.userId })
      .populate({
        path: "task_id",
        match: { user_id: req.userId } // Enforce user scope
      });
      
    res.json(timeSlots.filter(slot => slot.task_id)); // Filter orphaned slots
  } catch (error) {
    console.error("TimeSlot fetch error:", error);
    res.status(500).json({ error: "Error fetching time slots" });
  }
});

router.put("/timeSlots/:id", async (req, res) => {
  try {
    const updatedSlot = await TimeSlot.findOneAndUpdate(
      { 
        _id: req.params.id,
        user_id: req.userId // Add user scope
      },
      { start_time: req.body.start_time, end_time: req.body.end_time },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    // Update task association if needed
    if (req.body.task_id) {
      const task = await Task.findOne({
        _id: req.body.task_id,
        user_id: req.userId
      });
      
      if (!task) return res.status(400).json({ error: "Invalid task ID" });
      updatedSlot.task_id = task._id;
      await updatedSlot.save();
    }

    res.json(updatedSlot);
  } catch (error) {
    console.error("TimeSlot update error:", error);
    res.status(500).json({ error: "Failed to update time slot" });
  }
});

module.exports = router;