// backend/routes/testingDB.js
const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const Suggestion = require('../models/Suggestion');
const UserProfileStats = require('../models/UserProfileStats');

/* ===== USERS CRUD ===== */
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
    res.json(user);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== TASKS CRUD ===== */
// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a task
router.post('/tasks', async (req, res) => {
  try {
    const { user_id, task_name, duration, deadline, status } = req.body;
    const task = new Task({ user_id, task_name, duration, deadline, status });
    await task.save();
    res.json(task);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task by ID
router.put('/tasks/:id', async (req, res) => {
  try {
    const { user_id, task_name, duration, deadline, status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { user_id, task_name, duration, deadline, status }, { new: true });
    res.json(task);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== TIME SLOTS CRUD ===== */
// Get all time slots
router.get('/timeslots', async (req, res) => {
  try {
    const timeslots = await TimeSlot.find();
    res.json(timeslots);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a time slot
router.post('/timeslots', async (req, res) => {
  try {
    const { task_id, start_time, end_time } = req.body;
    const timeslot = new TimeSlot({ task_id, start_time, end_time });
    await timeslot.save();
    res.json(timeslot);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a time slot by ID
router.put('/timeslots/:id', async (req, res) => {
  try {
    const { task_id, start_time, end_time } = req.body;
    const timeslot = await TimeSlot.findByIdAndUpdate(req.params.id, { task_id, start_time, end_time }, { new: true });
    res.json(timeslot);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a time slot by ID
router.delete('/timeslots/:id', async (req, res) => {
  try {
    await TimeSlot.findByIdAndDelete(req.params.id);
    res.json({ message: "Time slot deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== SUGGESTIONS CRUD ===== */
// Get all suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = await Suggestion.find();
    res.json(suggestions);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a suggestion
router.post('/suggestions', async (req, res) => {
  try {
    const { user_id, suggestion_text } = req.body;
    const suggestion = new Suggestion({ user_id, suggestion_text });
    await suggestion.save();
    res.json(suggestion);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a suggestion by ID
router.put('/suggestions/:id', async (req, res) => {
  try {
    const { user_id, suggestion_text } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { user_id, suggestion_text }, { new: true });
    res.json(suggestion);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a suggestion by ID
router.delete('/suggestions/:id', async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: "Suggestion deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== USER PROFILE STATS CRUD ===== */
// Get all profile stats
router.get('/userprofilestats', async (req, res) => {
  try {
    const stats = await UserProfileStats.find();
    res.json(stats);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Create profile stats
router.post('/userprofilestats', async (req, res) => {
  try {
    const { user_id, xp, level, productivity_score } = req.body;
    const stats = new UserProfileStats({ user_id, xp, level, productivity_score });
    await stats.save();
    res.json(stats);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile stats by ID
router.put('/userprofilestats/:id', async (req, res) => {
  try {
    const { user_id, xp, level, productivity_score } = req.body;
    const stats = await UserProfileStats.findByIdAndUpdate(req.params.id, { user_id, xp, level, productivity_score }, { new: true });
    res.json(stats);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete profile stats by ID
router.delete('/userprofilestats/:id', async (req, res) => {
  try {
    await UserProfileStats.findByIdAndDelete(req.params.id);
    res.json({ message: "User profile stats deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
