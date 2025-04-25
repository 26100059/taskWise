const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const { getTimeSlotsByUserId, deleteTimeSlotsByUserId, createNewTimeSlots } = require('../dbFunctions');
const authenticateToken = require('../authMiddleware');


require('dotenv').config();

const API_KEY = process.env.API_KEY;

const MODEL_NAME = "deepseek-r1-distill-llama-70b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";


function extractJSON(content) {
  try {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = content.match(jsonRegex);

    if (match && match[1]) {
      const jsonData = JSON.parse(match[1]);
      return JSON.stringify(jsonData, null, 2);
    } else {
      const possibleJSON = content.trim();
      const jsonData = JSON.parse(possibleJSON);
      return JSON.stringify(jsonData, null, 2);
    }
  } catch (error) {
    return `Error processing the file: ${error.message}`;
  }
}

const generatePrompt = (newTask, existingTimeSlots, info) => `
You are a smart scheduling assistant. Based on the current time, a new task (with ID, duration, and deadline), and existing time slots, generate one or more **non-overlapping time slots** that fit the task's **exact duration**, **before the deadline**, and **after the current time**.

---

### Hard Rules (must always be followed):

1. No overlapping with existing slots (unless dynamic rescheduling is allowed).
2. Time slots must be within **08:00–18:00 Pakistan time (GMT+5)**.
3. Start after \`current_time\`, end before \`deadline\`.
4. Total scheduled time must **exactly match the task duration**.
5. Split tasks **>3 hours** into **2+ parts**.
6. Include **30+ min breaks** between time slots (preferably 1–2 hours).
7. Limit **≤6 hours of tasks per day**.
8. Spread tasks **evenly across the week**.
9. Output only a **JSON array** with **existing + new slots** (no extra text).

---

### Prioritization:
If \`info\` includes user preferences (e.g., preferred times/days), **these override** other soft rules (like distribution, breaks, or daily caps).

---

### Dynamic Rescheduling (Only if Needed):
If no valid schedule is possible and user allows it:
- Shift existing slots to make room.
- Keep original task IDs and durations.
- Still follow **all rules** when rescheduling.

---

### Input:
\`\`\`json
{
  "current_time": "${new Date().toISOString()}",
  "newTask": {
    "task_id": "${newTask._id}",
    "duration": ${newTask.duration},
    "deadline": "${new Date(newTask.deadline).toISOString()}"
  },
  "existingTimeSlots": ${JSON.stringify(existingTimeSlots, null, 2)},
  "info": "${info}"
}
\`\`\`

---

### Output:
Return a JSON array like:
\`\`\`json
[
  {
    "task_id": "<task_id>",
    "start_time": "<ISO timestamp>",
    "end_time": "<ISO timestamp>"
  }
]
\`\`\`

Only return the array. No explanations.
`;




async function replaceTimeSlots(newTimeSlots, userId, session) {
  try {
    const deletedCount = await deleteTimeSlotsByUserId(userId, session);

    if (typeof newTimeSlots === "string") {
      newTimeSlots = JSON.parse(newTimeSlots);
    }

    if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
      throw new Error("Invalid or empty time slots data");
    }

    const createdCount = await createNewTimeSlots(newTimeSlots, session);
    if (deletedCount > createdCount) throw new Error("Model failed to generate valid response");


  } catch (error) {
    console.error("Failed to replace time slots:", error.message);
    throw error;
  }
}


router.post('/schedule-task', authenticateToken, async (req, res) => {

  const userId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, deadline, duration, info } = req.body;
    if (!name || !deadline || !duration) {
      throw new Error("Missing required task fields");
    }

    const newTask = new Task({
      user_id: new mongoose.Types.ObjectId(userId),
      task_name: name,
      deadline,
      duration,
      status: "pending"
    });
    await newTask.save({ session });

    const taskId = newTask._id;

    const existingTimeSlots = await getTimeSlotsByUserId(userId);

    const formattedTimeSlots = existingTimeSlots.map((slot) => ({
      _id: slot._id,
      task_id: slot.task_id._id,
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));


    const llmPrompt = generatePrompt(newTask, formattedTimeSlots, info);


    const llmResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: llmPrompt }],
        max_tokens: 6000,
        temperature: 0.2
      })
    });

    const llmJson = await llmResponse.json();

    const llmOutput = llmJson.choices?.[0]?.message?.content || "";

    const newTimeSlots = extractJSON(llmOutput);



    await replaceTimeSlots(newTimeSlots, userId, session);

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, newTimeSlots });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
