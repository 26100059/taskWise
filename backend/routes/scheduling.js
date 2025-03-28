const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const Task = require('../models/Task');
const TimeSlot = require('../models/TimeSlot');
const fs = require('fs');

// dotenv.config();

const API_KEY = "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";
const MODEL_NAME = "deepseek-r1-distill-llama-70b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Fixed user ID for testing
const FIXED_USER_ID = "67d96ed12fa6e5fb171af63f";


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
You are an intelligent scheduling assistant. Your task is to schedule a new task into a user’s existing calendar while ensuring efficiency and avoiding conflicts. Follow the rules carefully and return only the updated schedule in a valid JSON format. Make sure that your final answer includes previous timeslots as well as the new ones you made.

### **Scheduling Rules:**
1. **No Overlaps:** Ensure the new task does not conflict with existing tasks.
2. **Deadline Priority:** The task must be scheduled before the deadline.
3. **Earliest Placement:** Select the earliest available time slot before the deadline.
4. **Task Splitting:** For long tasks you can break them into multiple time slots and even seperate days as long as they fit before deadline.
5. **User Preferences:** If additional information is provided, prioritize it over general rules.
7. **Strict JSON Output:** The response must be a **valid JSON array** with the format shown below.

---

### **User's Input:**
\`\`\`json
{
  "newTask": {
    "task_id": "${newTask._id}",
    "duration": ${newTask.duration},
    "deadline": "${newTask.deadline}"
  },
  "existingTimeSlots": ${JSON.stringify(existingTimeSlots, null, 2)},
  "info": "${info}"
}
\`\`\`

---

### **Expected Output Format:**
Return only a valid JSON array of time slots. Make sure that previous timeslots are also there added with new ones you made. No extra text, explanations, or comments.

\`\`\`json
[
  {
    "task_id": "<task_id>",
    "start_time": "<ISO timestamp>",
    "end_time": "<ISO timestamp>"
  }
]
\`\`\`
`;


async function replaceTimeSlots(newTimeSlots, session) {
    try {
        // Step 1: Delete all time slots within the transaction
        await TimeSlot.deleteMany({}, { session });

        // Step 2: Ensure newTimeSlots is an array of objects
        if (typeof newTimeSlots === "string") {
            newTimeSlots = JSON.parse(newTimeSlots);
        }

        if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
            throw new Error("Invalid or empty time slots data");
        }

        // Step 3: Insert each new time slot using the POST API method
        for (const slot of newTimeSlots) {
            await fetch("http://localhost:7000/testingDB/timeslots", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task_id: slot.task_id,
                    start_time: slot.start_time,
                    end_time: slot.end_time
                })
            });
        }

        console.log("Successfully replaced time slots.");
    } catch (error) {
        console.error("Failed to replace time slots:", error.message);
        throw error;
    }
}



router.post('/schedule-task', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, deadline, duration, info } = req.body;
        if (!name || !deadline || !duration) {
            throw new Error("Missing required task fields");
        }

        // Step 1: Create a new task with fixed user_id
        const newTask = new Task({
            user_id: new mongoose.Types.ObjectId(FIXED_USER_ID),
            task_name: name,
            deadline,
            duration,
            status: "pending"
        });
        await newTask.save({ session });

        // Step 2: Fetch all time slots
        const existingTimeSlots = await TimeSlot.find().session(session);

        // Step 3: Prepare input for LLM API
        const llmPrompt = generatePrompt(newTask, existingTimeSlots, info);

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
                max_tokens: 4096
            })
        });

        // Ensure response is in JSON format
        const llmJson = await llmResponse.json();

        // Extract the raw content (text response from LLM)
        const llmOutput = llmJson.choices?.[0]?.message?.content || "";

        // Extract JSON from the response content
        const newTimeSlots = extractJSON(llmOutput);


        console.log("--line before new Time slots--")
        console.log(newTimeSlots);

        // Step 4: Replace time slots within transaction
        await replaceTimeSlots(newTimeSlots, session);

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
