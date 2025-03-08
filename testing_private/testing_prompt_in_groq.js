import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";


/**
 * testing_prompt_in_groq.js generates multiple schedules from the llm based on different user input and current schedules to check if the model
 * is working correctly in different scenarios. The data format was set best to follow the DB schema. If there are any changes 
 * keep that in mind. The response from llm has to be cleaned. (to only include the json) A sample response from the llm
 * has been shared below which was not cleaned. The non cleaned files were first stored in prompt_results, upon which the script 
 * of cleaning_llm_response.js was run and it cleaned the responses. Then the json_to_ics was run in on these json files
 * and results stored in before_after_ics_files so that 
 * a visual anaylsis of the schedule can be done (there are online websites that u can use to see ics schedules).
 * Note: ICS conversion was not necessary for now, but i chose it so i could visualize the results.
 * It would be best that we could visually see the results using Full Calendar in order for prompt testing results
 * to be validated visually.
 */

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;
const MODEL_NAME = "deepseek-r1-distill-llama-70b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";


// Directory for test results
const OUTPUT_DIR = "testing_private/prompt_results/";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Test Cases
const testCases = [
  {
    test_name: "Empty Schedule",
    user_input: {
      task_name: "Workout",
      deadline: "2025-03-09T08:00",
      duration: 1,
      additional_details: "Preferably in the morning before 8 AM."
    },
    current_schedule: []
  },
  {
    test_name: "Simple Insertion",
    user_input: {
      task_name: "Coding Practice",
      deadline: "2025-03-10T20:00",
      duration: 2,
      additional_details: "Preferably in the evening."
    },
    current_schedule: [
      {
        slot_id: 1,
        task_name: "Finish Report",
        start_time: "2025-03-10T09:00:00",
        end_time: "2025-03-10T10:30:00"
      },
      {
        slot_id: 2,
        task_name: "Lunch Break",
        start_time: "2025-03-10T13:00:00",
        end_time: "2025-03-10T14:00:00"
      }
    ]
  },
  {
    test_name: "Finding a Slot Between Tasks",
    user_input: {
      task_name: "Study Session",
      deadline: "2025-03-10T22:00",
      duration: 1.5,
      additional_details: "Needs focus time before 10 PM."
    },
    current_schedule: [
      {
        slot_id: 1,
        task_name: "Morning Walk",
        start_time: "2025-03-10T07:00:00",
        end_time: "2025-03-10T07:30:00"
      },
      {
        slot_id: 2,
        task_name: "Team Meeting",
        start_time: "2025-03-10T17:00:00",
        end_time: "2025-03-10T18:00:00"
      },
      {
        slot_id: 3,
        task_name: "Dinner",
        start_time: "2025-03-10T20:00:00",
        end_time: "2025-03-10T21:00:00"
      }
    ]
  },
  {
    test_name: "No Space Available",
    user_input: {
      task_name: "Doctor Appointment",
      deadline: "2025-03-12T12:00",
      duration: 1,
      additional_details: "Must be done before noon."
    },
    current_schedule: [
      {
        slot_id: 1,
        task_name: "Project Deadline",
        start_time: "2025-03-12T08:00:00",
        end_time: "2025-03-12T12:00:00"
      },
      {
        slot_id: 2,
        task_name: "Lunch",
        start_time: "2025-03-12T12:30:00",
        end_time: "2025-03-12T13:30:00"
      }
    ]
  },
  {
    test_name: "Overnight Task",
    user_input: {
      task_name: "Complete Research Paper",
      deadline: "2025-03-13T08:00",
      duration: 5,
      additional_details: "Can work late at night if needed."
    },
    current_schedule: [
      {
        slot_id: 1,
        task_name: "Work Shift",
        start_time: "2025-03-12T18:00:00",
        end_time: "2025-03-12T23:00:00"
      }
    ]
  }
];

// The scheduling prompt template
const promptTemplate = (userInput, currentSchedule) => `
You are an intelligent scheduling assistant. Your task is to integrate a new task into an existing schedule while ensuring no overlapping conflicts. Prioritize earlier available slots before the deadline while considering user preferences. Return the updated schedule as a JSON array.Note that returning a json array response is crucial.

A user wants to add a new task to their schedule. Here is their input:

- **Task Name**: ${userInput.task_name}
- **Deadline**: ${userInput.deadline}
- **Duration**: ${userInput.duration} hours
- **Additional Details**: ${userInput.additional_details}

### **User's Current Schedule:**
\`\`\`json
${JSON.stringify(currentSchedule, null, 2)}
\`\`\`

### **Scheduling Rules:**
- **No Overlaps**: Ensure the new task does not overlap with existing tasks.
- **Deadline Consideration**: The task must be scheduled before its deadline.
- **Optimal Placement**: Use the earliest available free time slot before the deadline.


### **Output Format:**
Return the updated schedule as a valid JSON array following this structure:

\`\`\`json
[
  {
    "slot_id": 1,
    "task_name": "Existing Task",
    "start_time": "YYYY-MM-DDTHH:MM:SS",
    "end_time": "YYYY-MM-DDTHH:MM:SS"
  },
  {
    "slot_id": 2,
    "task_name": "${userInput.task_name}",
    "start_time": "YYYY-MM-DDTHH:MM:SS",
    "end_time": "YYYY-MM-DDTHH:MM:SS"
  }
]
\`\`\`

Return only the JSON array without additional explanations.
`;

async function testScheduling() {
  for (const testCase of testCases) {
    console.log(`Running test: ${testCase.test_name}...`);

    const requestData = {
      model: MODEL_NAME,
      messages: [{ role: "user", content: promptTemplate(testCase.user_input, testCase.current_schedule) }],
      max_tokens: 4096
    };

    try {
      const response = await axios.post(API_URL, requestData, {
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" }
      });

      const updatedSchedule = response.data.choices[0].message.content;

      // Save before and after JSON files
      fs.writeFileSync(`${OUTPUT_DIR}/${testCase.test_name}_before.json`, JSON.stringify(testCase.current_schedule, null, 2));
      fs.writeFileSync(`${OUTPUT_DIR}/${testCase.test_name}_after.json`, updatedSchedule);

      console.log(`✅ Test "${testCase.test_name}" completed! Results saved.`);
    } catch (error) {
      console.error(`❌ Error in "${testCase.test_name}":`, error.response?.data || error.message);
    }
  }
}

testScheduling();





//LLM RESPONSE (uncleaned)
/*

<think>
Okay, I need to help the user schedule their new "Workout" task. Let's see, the user's current schedule is empty, so that should make things easier. The task has a deadline of 2025-03-09T08:00, which is 8 AM on March 9th, 2025. The workout needs to be 1 hour long and the user prefers it in the morning before 8 AM.

Since the schedule is empty, I can just add the workout without worrying about conflicts. The earliest available slot would be as early as possible, but considering the user's preference for the morning before 8 AM. So maybe starting at 7 AM.

Wait, but I should check if the user has any other tasks that might have been added after I last checked. But in this case, the schedule is empty, so no issues there. 

So the start time could be 2025-03-09T07:00:00, ending at 08:00:00. That fits within the deadline and meets the user's preference. 

I should structure the JSON with slot_id 1, task_name "Workout", and the start and end times as specified. Since there are no other tasks, the array will only have this one entry.
</think>

```json
[
  {
    "slot_id": 1,
    "task_name": "Workout",
    "start_time": "2025-03-09T07:00:00",
    "end_time": "2025-03-09T08:00:00"
  }
]
```

*/