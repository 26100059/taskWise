// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Task = require('../models/Task');
// const TimeSlot = require('../models/TimeSlot');
// const { getTimeSlotsByUserId, deleteTimeSlotsByUserId, createNewTimeSlots } = require('../dbFunctions');
// const authenticateToken = require('../authMiddleware');


// require('dotenv').config();

// const API_KEY = process.env.API_KEY;

// const MODEL_NAME = "deepseek-r1-distill-llama-70b";
// const API_URL = "https://api.groq.com/openai/v1/chat/completions";


// function extractJSON(content) {
//   try {
//     const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
//     const match = content.match(jsonRegex);

//     if (match && match[1]) {
//       const jsonData = JSON.parse(match[1]);
//       return JSON.stringify(jsonData, null, 2);
//     } else {
//       const possibleJSON = content.trim();
//       const jsonData = JSON.parse(possibleJSON);
//       return JSON.stringify(jsonData, null, 2);
//     }
//   } catch (error) {
//     return `Error processing the file: ${error.message}`;
//   }
// }

// const generatePrompt = (newTask, existingTimeSlots, info) => `
// You are an intelligent scheduling assistant. Based on the current time, a new task (with ID, duration, and deadline), and a list of existing time slots, generate one or more **non-overlapping time slots** that fulfill the new task's exact duration **before the deadline** and **after the current time**.

// ---

// ### Mandatory Rules (must **never** be violated):

// 1. Time slots must **not overlap** with existing ones, unless absolutely unavoidable (see Dynamic Rescheduling).
// 2. Time slots must **start after the current_time** and **end before the task's deadline**.
// 3. The **total scheduled time** must **exactly match the task's duration** (e.g., a 4-hour task should result in exactly 4 hours of time slots combined).
// 4. For any task **longer than 3 hours**, split it into **2 or more smaller time slots**.
// 5. Schedule time slots **only within working hours**: **08:00–18:00**, **Pakistan time (GMT+5)**.
// 6. There should be **at least a 30-minute break between any two time slots** (preferably 1–2 hours).
// 7. Avoid scheduling more than **6 hours of total tasks on any single day**.
// 8. Distribute workload **evenly across the week** — don't overload one day and leave others empty.
// 9. Return a **JSON array including both existing and new time slots**. No explanation, no additional output.

// ---

// ### Prioritization Note:
// - If user preferences (e.g., specific days or hours) are provided in the \`info\` field, they must take precedence over predefined rules such as distribution, break time, or daily workload limits.

// ---

// ### Model Enhancement: Dynamic Rescheduling (Only if Absolutely Necessary)

// If the new task **cannot be scheduled** without conflict due to lack of space, and the user has implied permission (via info or if no options exist), you may:
// - **Dynamically reschedule existing time slots** that conflict with the new task. By Dynamic rescheduling I mean shifting the previous time slots to a new time slots to make space for the new task. Make sure that the new calendar does not schedule any task beyonds its deadline.
// - You **must still follow all mandatory rules** when rescheduling old tasks (no overlaps, respect working hours, 30-min breaks, ≤6hr/day, even distribution, etc).
// - When rescheduling existing slots, ensure their total time and task IDs remain unchanged.

// ---

// ### *User's Input:*
// \`\`\`json
// {
//   "current_time": "${new Date().toISOString()}",
//   "newTask": {
//     "task_id": "${newTask._id}",
//     "duration": ${newTask.duration},
//     "deadline": "${new Date(newTask.deadline).toISOString()}"
//   },
//   "existingTimeSlots": ${JSON.stringify(existingTimeSlots, null, 2)},
//   "info": "${info}"
// }
// \`\`\`

// ---

// ### Expected Output Format:
// Return only a valid JSON array of time slots, formatted like this:

// \`\`\`json
// [
//   {
//     "task_id": "<task_id>",
//     "start_time": "<ISO timestamp>",
//     "end_time": "<ISO timestamp>"
//   }
// ]
// \`\`\`

// Ensure:
// - **All rules are strictly followed**.
// - **Total duration matches exactly**.
// - **Breaks, working hours, and fair distribution are respected unless user preference overrides them**.
// - Include **all existing time slots along with newly added ones**.
// - Only output a JSON array. No extra text.
// `;



// async function replaceTimeSlots(newTimeSlots, userId, session) {
//   try {
//     const deletedCount = await deleteTimeSlotsByUserId(userId, session);

//     if (typeof newTimeSlots === "string") {
//       newTimeSlots = JSON.parse(newTimeSlots);
//     }

//     if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
//       throw new Error("Invalid or empty time slots data");
//     }

//     const createdCount = await createNewTimeSlots(newTimeSlots, session);
//     if (deletedCount > createdCount) throw new Error("Model failed to generate valid response");


//   } catch (error) {
//     console.error("Failed to replace time slots:", error.message);
//     throw error;
//   }
// }


// router.post('/schedule-task', authenticateToken, async (req, res) => {

//   const userId = req.user.userId;

//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { name, deadline, duration, info } = req.body;
//     if (!name || !deadline || !duration) {
//       throw new Error("Missing required task fields");
//     }

//     const newTask = new Task({
//       user_id: new mongoose.Types.ObjectId(userId),
//       task_name: name,
//       deadline,
//       duration,
//       status: "pending"
//     });
//     await newTask.save({ session });

//     const taskId = newTask._id;

//     const existingTimeSlots = await getTimeSlotsByUserId(userId);

//     const formattedTimeSlots = existingTimeSlots.map((slot) => ({
//       _id: slot._id,
//       task_id: slot.task_id._id,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//     }));


//     const llmPrompt = generatePrompt(newTask, formattedTimeSlots, info);


//     const llmResponse = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: MODEL_NAME,
//         messages: [{ role: "user", content: llmPrompt }],
//         max_tokens: 6000,
//         temperature: 0.2
//       })
//     });

//     const llmJson = await llmResponse.json();

//     const llmOutput = llmJson.choices?.[0]?.message?.content || "";

//     const newTimeSlots = extractJSON(llmOutput);



//     await replaceTimeSlots(newTimeSlots, userId, session);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ success: true, newTimeSlots });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;








//nafees

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


/**
 * **Objective**: Generate **non-overlapping time slots** for a new task after the current time, before the deadline, and following the rules.

**Pathway**:

1. **Determine available time range**:
   - Check the current time and the task's deadline.
   - Identify the **overall available time window** (from the current time to the task deadline).
   
2. **Assess existing time slots**:
   - Look at the existing time slots.
   - Identify the **less cluttered days** (those with fewer or no time slots already scheduled) and **more cluttered days** (those with many scheduled time slots).
   
3. **Prioritize less cluttered days**:
   - Start by considering **less cluttered days** for allocating the task.
   - If no valid slot exists there, move to more cluttered days.

4. **Check working hours**:
   - Prioritize **working hours (08:00–20:00)** unless:
     - Info allows a different time, or
     - No valid working-hour slots exist.
   - Allocate slots during this time frame first.

5. **Allocate task slots**:
   - Try to split the task into **smaller chunks** of less than 3 hours (if possible) to maximize flexibility.
   - Allocate time slots sequentially based on available gaps in each day, ensuring no overlap with existing tasks.

6. **Balance time per day**:
   - **Limit each day’s total task duration to 6 hours**.
   - If the task exceeds 6 hours, split it across **multiple days**, ensuring **no single day is overloaded**.

7. **Check for distant deadlines**:
   - If the task deadline is more than 5 days away:
     - **Use earlier free days** if they exist, even if this means scheduling the task earlier than the closest day to the deadline.
     - If earlier days conflict with existing tasks, or no earlier days are free, schedule closer to the deadline.
   
8. **Final allocation check**:
   - Ensure the task **exactly matches the required duration** across all time slots.
   - Ensure all newly created slots **do not overlap** with existing ones.

9. **Output time slots**:
   - Return a **JSON array** of the newly allocated time slots. No extra comments, texts, explanation.
 * 
 * 
 */


/**
 * 
 * 
 */

// Function to generate LLM prompt
const generatePrompt = (newTask, existingTimeSlots, info) => `
You are a scheduling assistant. Based on the current time, a new task (with ID, duration, and deadline), and a list of existing time slots, generate one or more **non-overlapping time slots** that fulfill the new task's exact duration **before the deadline** and **after the current time**.

Rules:
1. Time slots must **not overlap** with existing ones.
2. Total scheduled time must **exactly match the task's duration**.
3. **Start after current_time**, and **end on or before the deadline**.
4. Split the task across **multiple days** if needed. Avoid **back-to-back slots** on the same day unless no other option exists.
5. Prefer **working hours (08:00–20:00)** unless:
   - Info field allows otherwise, or
   - No valid working-hour slots exist.
6. Never schedule more than **6 hours on any single day**. Always split tasks across multiple days when the duration exceeds this limit, even if the day has enough free hours.
7. For tasks with distant deadlines (more than 5 days away):
   - If **free days are available before the deadline**, **use them first** for the task, even if it means starting earlier than the closest day to the deadline.
   - If **no free days** are available before the deadline or if earlier scheduling conflicts with other rules (such as task duration or existing time slots), **schedule closer to the deadline**.
   - Only choose a **single day** for scheduling if the task duration is ≤ 6 hours.
8. **Split tasks into optimal chunks** of **less than 3 hours** per time slot to maximize flexibility and avoid overworking any single day.
9. Ensure the total scheduled time on any day **does not exceed 6 hours**, even if multiple time slots are available. This includes considering the total hours scheduled across all tasks on that day.
10. Return only a **JSON array of new time slots**. No explanation.

### Before finalizing the answer:
1. Verify that the sum of the durations of the new time slots matches the total duration of the task exactly.

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
    if (typeof newTimeSlots === "string") {
      newTimeSlots = JSON.parse(newTimeSlots);
    }

    if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
      throw new Error("Invalid or empty time slots data");
    }

    // Step 3: Create new time slots for the user only
    const createdCount = await createNewTimeSlots(newTimeSlots, session);

    console.log(`Successfully replaced time slots. ${createdCount} new slots were created. `);
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
    const llmPrompt = generatePrompt(newTask, formattedTimeSlots, info); //The newTask's task id is linked to timeslots by gpt itself.

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

    console.log("--line before llm out put--")
    console.log(llmOutput)

    // Extract JSON from the response content
    const newTimeSlots = extractJSON(llmOutput);

    console.log("--line before new Time slots--")
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