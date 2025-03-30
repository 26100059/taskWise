const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Import models
const User = require('../models/User');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const Suggestion = require('../models/Suggestion');
const UserProfileStats = require('../models/UserProfileStats');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// XP Configuration (Moved Here)
const XP_VALUES = {
    TASK_CREATED: 10,
    TASK_COMPLETED: 30,
    TASK_OVERDUE: -15,
    TASK_UPDATED: 5
};

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    });
};


//New endpoint to fetch tasks by day for the current week
router.get('/weeklyTaskData', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const startOfWeek = moment().startOf('week').toDate();
        const endOfWeek = moment().endOf('week').toDate();

        const weeklyData = {};
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (const day of days) {
            const startOfDay = moment(startOfWeek).add(days.indexOf(day), 'days').startOf('day').toDate();
            const endOfDay = moment(startOfDay).endOf('day').toDate();

            const tasks = await Task.find({
                user_id: userId,
                created_at: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            weeklyData[day] = tasks.length;
        }

        res.status(200).json({ success: true, weeklyData });
    } catch (error) {
        console.error("Error fetching weekly task data:", error);
        res.status(500).json({ success: false, error: "Failed to fetch weekly task data" });
    }
});


// Register a new user
router.post('/usersregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: "Username or email is already in use" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // console.log("User registered:", userId);

        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// backend/routes/token.js
router.post('/userslogin', async (req, res) => {
    try {
        // Your existing login logic
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const payload = { userId: user._id, email: user.email };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/profileStats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch UserProfileStats
        let profileStats = await UserProfileStats.findOne({ user_id: userId });

        if (!profileStats) {
            profileStats = new UserProfileStats({
                user_id: userId,
                xp: 0,
                level: 1,
                productivity_score: 0,
            });
            await profileStats.save();
        }
        // 1. Get the start and end of the week
        const startOfWeek = moment().startOf('week').toDate();
        const endOfWeek = moment().endOf('week').toDate();

        // 2. Query to get all tasks for the user for the current week
        const tasks = await Task.find({
            user_id: userId,
            created_at: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        });

        // 3. Calculate tasks in this week.
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;

        // 4. Calculate task productivity
        let productivityScore = 0;
        if (totalTasks > 0) {
            productivityScore = completedTasks / totalTasks;
        }

        profileStats.productivity_score = productivityScore;

        await profileStats.save();

        res.status(200).json({ success: true, profileStats, analytics: {} });
    } catch (error) {
        console.error("Error fetching profile stats:", error);
        res.status(500).json({ success: false, error: "Failed to fetch profile stats" });
    }
});

// --------------------------------------------

// Token verification endpoint
router.get('/verifyToken', authenticateToken, (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid', user: req.user });
});

// app.use('/token', router);

module.exports = router;


// module.exports = {
//     authenticateToken: authenticateToken, // Export the Express app instance
//     router: router, // Export the Express router instance
//     XP_VALUES: XP_VALUES
// };


