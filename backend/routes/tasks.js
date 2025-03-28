const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const TimeSlot = require("../models/TimeSlot");
const router = express.Router();

// GET /timeSlots - Fetch time slots (optionally filter by user_id)
router.get("/timeSlots", async (req, res) => {
  try {
    const query = {};
    if (req.query.user_id) {
      query.user_id = req.query.user_id;
    }
    const timeSlots = await TimeSlot.find(query).populate("task_id");
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: "Error fetching time slots" });
  }
});

// PUT /timeSlots/:id - Update time slot when dragged and dropped
router.put("/timeSlots/:id", async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;
  try {
    const updatedSlot = await TimeSlot.findByIdAndUpdate(
      id,
      { start_time, end_time },
      { new: true }
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

// // PUT /tasks/mark-done/:id - Mark a task as done
// router.put("/mark-done/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updatedTask = await Task.findByIdAndUpdate(
//       id,
//       { status: "done" },
//       { new: true }
//     );
//     if (!updatedTask) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json(updatedTask);
//   } catch (error) {
//     console.error("Error marking task as done:", error);
//     res.status(500).json({ error: "Failed to update task status" });
//   }
// });

// Updated code
router.put("/mark-done/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // expects "done" or "pending"
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ error: "Failed to update task status" });
    }
  });
  

// (Optional) GET /tasks/tasksList - Fetch a list of tasks for the user
router.get("/tasksList", async (req, res) => {
  try {
    const query = {};
    if (req.query.user_id) {
      query.user_id = req.query.user_id;
    }
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks list" });
  }
});

module.exports = router;
