// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const UserProfileStats = require('../models/UserProfileStats');

// Helper: Get current week's Monday and Sunday

function getCurrentWeekBoundaries() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

  

// GET /api/profile/:userId/analytics   
router.get('/:userId/analytics', async (req, res) => {
  try {
    const { userId } = req.params;
    const { monday, sunday } = getCurrentWeekBoundaries();

    // Find tasks for the user with status 'done' during the current week.
    const tasks = await Task.find({
      user_id: userId,
      status: 'done',
      updated_at: { $gte: monday, $lte: sunday }
    });

    // Initialize productivity counts for each day
    const productivity = {
      MON: 0,
      TUE: 0,
      WED: 0,
      THU: 0,
      FRI: 0,
      SAT: 0,
      SUN: 0
    };

    // Group tasks by day of week using updated_at
    tasks.forEach(task => {
      const date = new Date(task.updated_at);
      let dayIndex = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      let dayAbbrev;
      switch (dayIndex) {
        case 1: dayAbbrev = "MON"; break;
        case 2: dayAbbrev = "TUE"; break;
        case 3: dayAbbrev = "WED"; break;
        case 4: dayAbbrev = "THU"; break;
        case 5: dayAbbrev = "FRI"; break;
        case 6: dayAbbrev = "SAT"; break;
        case 0: dayAbbrev = "SUN"; break;
        default: dayAbbrev = "";
      }
      if (dayAbbrev) productivity[dayAbbrev] += 1;
    });

    // Fetch profile stats and user name
    const profileStats = await UserProfileStats.findOne({ user_id: userId });
    const user = await User.findById(userId);

    res.json({
      profileStats: { name: user.name, xp: profileStats ? profileStats.xp : 0 },
      productivity: {
        weeklyTrend: productivity,
        // These values could be calculated or stored; adjust as needed:
        taskDistribution: { Completed: 8, Pending: 4, Overdue: 2 },
        overallProductivity: profileStats ? profileStats.productivity_score : 0
      }
    });
  } catch (error) {
    console.error("Error fetching productivity data:", error);
    res.status(500).json({ error: error.message });
  }
});




// NEW FUNCTION ADDED BELOW


// New function to calculate cumulative time of completed tasks
router.get('/:userId/commulative', async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from req.params

    // Find all tasks with status 'done' for the given user
    const completedTasks = await Task.find({ user_id: userId, status: 'done' });

    // Calculate cumulative time in hours
    const cumulativeTime = completedTasks.reduce((total, task) => {
      return total + (task.duration || 0); // Assuming 'time_spent' is in hours
    }, 0);


    res.json({ cumulativeTime });
  } catch (error) {
    console.error("Error calculating cumulative time:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/weekly-completed-tasks', async (req, res) => {
  try {
      const { userId } = req.params;
      const { monday, sunday } = getCurrentWeekBoundaries();
      const completedTasks = await Task.find({
          user_id: userId,
          status: 'done',
          updated_at: { $gte: monday, $lte: sunday }   // Include updated_at
      });


      const dailyCounts = Array(7).fill(0); // Initialize array for each day of the week

      completedTasks.forEach(task => {
          const taskDate = new Date(task.updated_at);
          const dayOfWeek = taskDate.getDay(); // 0 (Sunday) to 6 (Saturday)
          const dayIndex = (dayOfWeek + 6) % 7; // Convert to Monday(0) to Sunday(6)
          dailyCounts[dayIndex]++;
      });

      res.json(dailyCounts);
  } catch (error) {
      console.error("Error fetching weekly completed tasks:", error);
      res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/task-summary', async (req, res) => {
  try {
    const { userId } = req.params;

    // Calculate total tasks
    const totalTasks = await Task.countDocuments({ user_id: userId });

    // Calculate completed tasks
    const completedTasks = await Task.countDocuments({ user_id: userId, status: 'done' });

    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      user_id: userId,
      status: 'pending',
      deadline: { $lt: now }
    });

    // Calculate pending tasks
    const pendingTasks = totalTasks - completedTasks - overdueTasks;

    res.json({
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks
    });

  } catch (error) {
    console.error("Error calculating task summary:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;