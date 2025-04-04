const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const { getTimeSlotsByUserId, deleteTimeSlotsByUserId, createNewTimeSlots } = require('../dbFunctions'); // Import from dbFunctions.js
const authenticateToken = require('../authMiddleware'); // Import the middleware for redux state


require('dotenv').config();

const API_KEY = process.env.API_KEY;

const MODEL_NAME = "deepseek-r1-distill-llama-70b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";


// Function to extract JSON block from text content
function extractJSON(content) {
  try {
    // Look for content between JSON code blocks
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = content.match(jsonRegex);

    if (match && match[1]) {
      // Parse and stringify to validate and format the JSON
      const jsonData = JSON.parse(match[1]);
      return JSON.stringify(jsonData, null, 2);
    } else {
      // If no code blocks found, try to find and parse JSON directly
      const possibleJSON = content.trim();
      const jsonData = JSON.parse(possibleJSON);
      return JSON.stringify(jsonData, null, 2);
    }
  } catch (error) {
    return `Error processing the file: ${error.message}`;
  }
}

// Function to generate LLM prompt
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
    // Step 1: Delete all time slots associated with the taskId (or userId, as needed) within the session
    // Assuming task_id is related to user_id, and you want to delete based on task_id
    const deletedCount = await deleteTimeSlotsByUserId(userId, session);

    // Step 2: Ensure newTimeSlots is an array of objects
    if (typeof newTimeSlots === "string") {
      newTimeSlots = JSON.parse(newTimeSlots);
    }

    if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
      throw new Error("Invalid or empty time slots data");
    }

    // Step 3: Create new time slots for the user only
    const createdCount = await createNewTimeSlots(newTimeSlots, session);
    // await createNewTimeSlots(newTimeSlots, session);
    if (deletedCount > createdCount) throw new Error("Model failed to generate valid response");

    console.log("Successfully replaced time slots.");
  } catch (error) {
    console.error("Failed to replace time slots:", error.message);
    throw error;
  }
}


router.post('/schedule-task', authenticateToken, async (req, res) => {

  //redux user id is available now
  const userId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, deadline, duration, info } = req.body;
    if (!name || !deadline || !duration) {
      throw new Error("Missing required task fields");
    }

    // Step 1: Create a new task with fixed user_id
    const newTask = new Task({
      user_id: new mongoose.Types.ObjectId(userId),
      task_name: name,
      deadline,
      duration,
      status: "pending"
    });
    await newTask.save({ session });

    const taskId = newTask._id;

    // Step 2: Fetch only timeslots of the user id
    const existingTimeSlots = await getTimeSlotsByUserId(userId);

    // Format the fetched time slots back to the original format (only task_id as ObjectId)
    const formattedTimeSlots = existingTimeSlots.map((slot) => ({
      _id: slot._id,
      task_id: slot.task_id._id,  // Only include task_id as ObjectId
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));

    console.log(formattedTimeSlots);

    // Step 3: Prepare input for LLM API
    const llmPrompt = generatePrompt(newTask, formattedTimeSlots, info);

    // console.log("LLM API INPUT", llmPrompt);

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

    // Ensure response is in JSON format
    const llmJson = await llmResponse.json();

    // Extract the raw content (text response from LLM)
    const llmOutput = llmJson.choices?.[0]?.message?.content || "";

    // console.log("--line before llm out put--")
    // console.log(llmOutput)

    // Extract JSON from the response content
    const newTimeSlots = extractJSON(llmOutput);

    // console.log("--line before new Time slots--")
    console.log(newTimeSlots);

    // Step 4: Replace time slots within transaction
    await replaceTimeSlots(newTimeSlots, userId, session);

    // // Step 7: Commit the transaction and return response
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
