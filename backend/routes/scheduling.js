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
You are an intelligent scheduling assistant. Your task is to schedule a new task into a user’s existing calendar while ensuring efficiency and avoiding conflicts. Follow the rules carefully and return only the updated schedule in a valid JSON format.

*IMPORTANT:*  
- You *must include all existing time slots as they are* and only add the newly scheduled ones.  
- *Do not modify, remove, or alter* any existing time slots.  
- The total duration of the new timeslots *must exactly match* the duration of the input task.
- If availability is not limited, distribute a task's time slots over multiple days instead of scheduling them all on the same day.
 

*Note:* Duration is in hours.

---

### *Scheduling Rules:*
1. *No Overlaps:* Ensure the new task does not conflict with existing tasks.
2. *Exact Duration Matching:* The total duration of the new timeslots *must exactly match* the duration of the input task.  
3. *Deadline Priority:* The task must be fully scheduled before the deadline.
4. *Current Time Constraint:* The new timeslots generated *must start after* the given current_time.
5. *Task Splitting (if needed):*  
   - If the task duration is *greater than 2 hours, you **can* split it into multiple time slots across different days *as long as the total duration remains correct* and it fits before the deadline.  
6. ** User Preferences (Highly Important, Must Follow):**  
   - If the user specifies preferred days (e.g., "Tuesday and Thursday only"), *you must check whether a given ISO timestamp falls on those days before using it.*  
   - Example: If "info": "Tuesday and Thursday only", *you must only schedule tasks on timestamps that match those days.*  
7. *Strict JSON Output:* The response must be a *valid JSON array* in the format below.  
8. *Retain Previous Time Slots:*  
   - *All existing time slots must be included* in the output without changes.  
   - *Only add new time slots* to accommodate the new task.
9. Schedule time slots only during work hours (i.e. 8am till 6pm) unless or otherwise stated differently by the user.


   ### Before finalizing the answer:
1. Double-check that *all existing time slots* are included in your response without any changes.
2. Verify that the sum of the durations of the new time slots matches the total duration of the task exactly.

---

### *User's Input:*
\\\`json
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


---

### **Expected Output Format:### **
Return only a valid JSON array of time slots. Make sure previous timeslots remain unchanged and the new ones you create strictly follow the rules. No extra text, explanations, or comments.

\\\`json
[
  {
    "task_id": "<task_id>",
    "start_time": "<ISO timestamp>",
    "end_time": "<ISO timestamp>"
  }
]
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
