// dummyData.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const TimeSlot = require('./models/TimeSlot');
const UserProfileStats = require('./models/UserProfileStats');

// Define your connection string directly
const uri = "mongodb+srv://taskWiseDB:taskWiseAdmin@taskwisedb.d4zpp.mongodb.net/?retryWrites=true&w=majority&appName=taskWiseDB";

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const insertDummyData = async () => {
  await connect();

  // Create or update the user
  let user = await User.findById("67d96ed12fa6e5fb171af63f");
  if (!user) {
    user = new User({
      _id: "67d96ed12fa6e5fb171af63f",
      name: "shelock holmes",
      email: "holmes@aol.com",
      password: "$2b$10$aFbs6igUrpCRRMY0xMFjn.9YkdR11yKvMUKt2iQQEH.kdiwrejIqe",
      created_at: new Date("2025-03-18T13:02:09.441Z"),
      updated_at: new Date("2025-03-18T13:02:09.441Z")
    });
    await user.save();
    console.log("User created:", user);
  } else {
    console.log("User already exists.");
  }

  // Remove any existing tasks and timeslots for a clean slate
  await Task.deleteMany({ user_id: "67d96ed12fa6e5fb171af63f" });
  await TimeSlot.deleteMany({});

  // Define dates for each weekday (using UTC for consistency)
  const dayDates = {
    MON: new Date("2025-03-17T10:00:00Z"),
    TUE: new Date("2025-03-18T10:00:00Z"),
    WED: new Date("2025-03-19T10:00:00Z"),
    THU: new Date("2025-03-20T10:00:00Z"),
    FRI: new Date("2025-03-21T10:00:00Z")
  };

  // Define tasks count per day
  const tasksPlan = [
    { day: "MON", count: 2 },
    { day: "TUE", count: 1 },
    { day: "WED", count: 3 },
    { day: "THU", count: 2 },
    { day: "FRI", count: 1 }
  ];

  let taskIndex = 0;
  const tasksInserted = [];
  for (const plan of tasksPlan) {
    const { day, count } = plan;
    for (let i = 0; i < count; i++) {
      // Alternate statuses: even-index tasks are done, odd-index are pending
      const status = (taskIndex % 2 === 0) ? "done" : "pending";
      const deadline = dayDates[day];
      const task = new Task({
        user_id: "67d96ed12fa6e5fb171af63f",
        task_name: `Task ${taskIndex + 1} for ${day}`,
        duration: 60,
        deadline: deadline,
        status: status,
        created_at: new Date(),
        updated_at: deadline
      });
      const savedTask = await task.save();
      tasksInserted.push(savedTask);

      // Create one timeslot per task: start 1 hour before deadline, end at deadline
      const timeslot = new TimeSlot({
        task_id: savedTask._id,
        start_time: new Date(deadline.getTime() - 60 * 60 * 1000),
        end_time: deadline,
        created_at: new Date(),
        updated_at: deadline
      });
      await timeslot.save();

      taskIndex++;
    }
  }
  console.log(`${tasksInserted.length} tasks (with timeslots) inserted for user 67d96ed12fa6e5fb171af63f.`);

  // Remove existing profile stats and then create new one.
  await UserProfileStats.deleteMany({ user_id: "67d96ed12fa6e5fb171af63f" });
  const profileStats = new UserProfileStats({
    user_id: "67d96ed12fa6e5fb171af63f",
    xp: 37,
    level: 37,
    productivity_score: 0.37,
    created_at: new Date(),
    updated_at: new Date()
  });
  await profileStats.save();
  console.log("Profile stats inserted for user:", profileStats);

  mongoose.connection.close();
};

insertDummyData();