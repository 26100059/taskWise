const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");
const TimeSlot = require("../models/TimeSlot");
// For file operations if needed
const fs = require("fs");

const API_KEY = "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";
const MODEL_NAME = "deepseek-r1-distill-llama-70b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// For testing, use fixed user ID if none provided
const FIXED_USER_ID = "67d96ed12fa6e5fb171af63f";

// Helper to extract JSON block from content
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

// Generate LLM prompt for scheduling
const generatePrompt = (newTask, existingTimeSlots, info) => `
You are an intelligent scheduling assistant. Your task is to schedule a new task into a user’s existing calendar while ensuring efficiency and avoiding conflicts. Follow these rules and return only the updated schedule in valid JSON format.

Rules:
1. No overlaps.
2. The new task must be scheduled before its deadline.
3. Place the task at the earliest available time slot.
4. For long tasks, split into multiple slots if needed.
5. If additional info is provided, prioritize it.
6. Return a valid JSON array that includes both the existing and new time slots.

Input:
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

Expected Output (only a JSON array):
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
    // Delete all existing time slots in the transaction
    await TimeSlot.deleteMany({}, { session });
    if (typeof newTimeSlots === "string") {
      newTimeSlots = JSON.parse(newTimeSlots);
    }
    if (!Array.isArray(newTimeSlots) || newTimeSlots.length === 0) {
      throw new Error("Invalid or empty time slots data");
    }
    // Insert each new time slot
    for (const slot of newTimeSlots) {
      await fetch("http://localhost:7000/testingDB/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: slot.task_id,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }),
      });
    }
    console.log("Successfully replaced time slots.");
  } catch (error) {
    console.error("Failed to replace time slots:", error.message);
    throw error;
  }
}

router.post("/schedule-task", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, deadline, duration, info, user_id } = req.body;
    if (!name || !deadline || !duration) {
      throw new Error("Missing required task fields");
    }
    const currentUserId = user_id || FIXED_USER_ID;
    const newTask = new Task({
      user_id: new mongoose.Types.ObjectId(currentUserId),
      task_name: name,
      deadline,
      duration,
      status: "pending",
    });
    await newTask.save({ session });
    // Fetch existing time slots for this user
    const existingTimeSlots = await TimeSlot.find({ user_id: currentUserId }).session(session);
    const llmPrompt = generatePrompt(newTask, existingTimeSlots, info);
    const llmResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: llmPrompt }],
        max_tokens: 4096,
      }),
    });
    const llmJson = await llmResponse.json();
    const llmOutput = llmJson.choices?.[0]?.message?.content || "";
    const newTimeSlotsStr = extractJSON(llmOutput);
    console.log("New Time Slots:", newTimeSlotsStr);
    await replaceTimeSlots(newTimeSlotsStr, session);
    await session.commitTransaction();
    session.endSession();
    res.json({ success: true, newTimeSlots: newTimeSlotsStr });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
