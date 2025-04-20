const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const Suggestion = require('../models/Suggestion');
const UserProfileStats = require('../models/UserProfileStats');

const {getTimeSlotsByUserId} = require('../dbFunctions'); 
const authenticateToken = require('../authMiddleware'); 

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
    res.json(user);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/tasks/:id', async (req, res) => {
  try {
    const { user_id, task_name, duration, deadline, status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { user_id, task_name, duration, deadline, status }, { new: true });
    res.json(task);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/timeSlots-by-userid',authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const timeSlots = await getTimeSlotsByUserId(userId);
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/timeslots', async (req, res) => {
  try {
    const timeslots = await TimeSlot.find();
    res.json(timeslots);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/timeslots/:id', async (req, res) => {
  try {
    const { task_id, start_time, end_time } = req.body;
    const timeslot = await TimeSlot.findByIdAndUpdate(req.params.id, { task_id, start_time, end_time }, { new: true });
    res.json(timeslot);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/timeslots/:id', async (req, res) => {
  try {
    await TimeSlot.findByIdAndDelete(req.params.id);
    res.json({ message: "Time slot deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = await Suggestion.find();
    res.json(suggestions);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/suggestions/:id', async (req, res) => {
  try {
    const { user_id, suggestion_text } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { user_id, suggestion_text }, { new: true });
    res.json(suggestion);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/suggestions/:id', async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: "Suggestion deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/userprofilestats', async (req, res) => {
  try {
    const stats = await UserProfileStats.find();
    res.json(stats);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/userprofilestats/:id', async (req, res) => {
  try {
    const { user_id, xp, level, productivity_score } = req.body;
    const stats = await UserProfileStats.findByIdAndUpdate(req.params.id, { user_id, xp, level, productivity_score }, { new: true });
    res.json(stats);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/userprofilestats/:id', async (req, res) => {
  try {
    await UserProfileStats.findByIdAndDelete(req.params.id);
    res.json({ message: "User profile stats deleted" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});



router.post('/usersregister', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email is already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/userslogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: "Login successful", token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;