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
You are an intelligent scheduling assistant. Based on the current time, a new task (with ID, duration, and deadline), and a list of existing time slots, generate one or more **non-overlapping time slots** that fulfill the new task's exact duration **before the deadline** and **after the current time**.

---

### Mandatory Rules (must **never** be violated):

1. Time slots must **not overlap** with existing ones, unless absolutely unavoidable (see Dynamic Rescheduling).
2. Time slots must **start after the current_time** and **end before the task's deadline**.
3. The **total scheduled time** must **exactly match the task's duration** (e.g., a 4-hour task should result in exactly 4 hours of time slots combined).
4. For any task **longer than 3 hours**, split it into **2 or more smaller time slots**.
5. Schedule time slots **only within working hours**: **08:00–18:00**, **Pakistan time (GMT+5)**.
6. There should be **at least a 30-minute break between any two time slots** (preferably 1–2 hours).
7. Avoid scheduling more than **6 hours of total tasks on any single day**.
8. Distribute workload **evenly across the week** — don't overload one day and leave others empty.
9. Return a **JSON array including both existing and new time slots**. No explanation, no additional output.

---

### Prioritization Note:
- If user preferences (e.g., specific days or hours) are provided in the \`info\` field, they must take precedence over predefined rules such as distribution, break time, or daily workload limits.

---

### Model Enhancement: Dynamic Rescheduling (Only if Absolutely Necessary)

If the new task **cannot be scheduled** without conflict due to lack of space, and the user has implied permission (via info or if no options exist), you may:
- **Dynamically reschedule existing time slots** that conflict with the new task. By Dynamic rescheduling I mean shifting the previous time slots to a new time slots to make space for the new task. Make sure that the new calendar does not schedule any task beyonds its deadline.
- You **must still follow all mandatory rules** when rescheduling old tasks (no overlaps, respect working hours, 30-min breaks, ≤6hr/day, even distribution, etc).
- When rescheduling existing slots, ensure their total time and task IDs remain unchanged.

---

### *User's Input:*
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

### Expected Output Format:
Return only a valid JSON array of time slots, formatted like this:

\`\`\`json
[
  {
    "task_id": "<task_id>",
    "start_time": "<ISO timestamp>",
    "end_time": "<ISO timestamp>"
  }
]
\`\`\`

Ensure:
- **All rules are strictly followed**.
- **Total duration matches exactly**.
- **Breaks, working hours, and fair distribution are respected unless user preference overrides them**.
- Include **all existing time slots along with newly added ones**.
- Only output a JSON array. No extra text.
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
