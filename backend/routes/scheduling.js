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
You are a smart scheduling assistant. Given the current time, a new task (with an ID, duration, and deadline), and a list of already scheduled time slots, your job is to generate one or more **non-overlapping time slots** that:

- Fully cover the task's required duration,
- Start **after the current time**, and
- Finish **before the task's deadline**.

---

### Mandatory Rules (must **always** be followed):

1. Do **not overlap** new slots with existing ones — unless absolutely necessary (see Dynamic Rescheduling).
2. Time slots must **begin after the current_time** and **finish before the task’s deadline**.
3. The **total time scheduled** must **exactly match the task's duration**.
4. If the task is **longer than 3 hours**, split it into **two or more segments**.
5. Only schedule time during **working hours**: **08:00–18:00**, **Pakistan Time (GMT+5)**.
6. Maintain **at least a 30-minute break** between slots (ideally 1–2 hours).
7. Limit **total scheduled time to 6 hours per day**.
8. Aim for an **even workload distribution across the week** — avoid clustering tasks on one day.
9. Output a **JSON array** that includes both the existing and newly scheduled time slots. Do not include any explanations or additional content.

---

### Prioritization Rule:
- If user preferences are provided in the \`info\` field (e.g., specific days or times), these preferences override standard rules like daily limits, breaks, or distribution.

---

### Dynamic Rescheduling (Only if Absolutely Necessary)

If it's impossible to fit the new task due to time conflicts, and the user has either provided permission (via the \`info\` field) or there are no available alternatives:

- You may **reschedule existing time slots** to make room. This means moving them to new time slots that comply with all the same rules.
- You **must still respect all mandatory rules**, including non-overlap, working hours, breaks, and even workload.
- When rescheduling, ensure the **task ID and total duration** for existing tasks stay the same.

---

### *User Input:*
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

Return only a valid JSON array of time slots, like so:

\`\`\`json
[
  {
    "task_id": "<task_id>",
    "start_time": "<ISO timestamp>",
    "end_time": "<ISO timestamp>"
  }
]
\`\`\`

Make sure to:
- **Follow all rules strictly**.
- **Match the total required duration** exactly.
- **Respect breaks, working hours, and fair distribution**, unless user preferences override them.
- Include **both the existing and newly added time slots**.
- Output **only** the JSON array. No other text.
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
