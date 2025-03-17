

/**
 * This code verifies the conversion from json to ics based on our DB schema. We are only using "name" field from
 * "tasks" table and joining it with "time_slots" table. Notice that RRrule is not required to generate recurring events
 * since our DB already stores each recurring event (multiple instances of the same event e.g fix car 1 hours for 4 days)
 * as an independent event. Therefore, ics generation is fairly simple and its best that we use JSON format for the schedule.
 */

const { createEvents } = require("ics");
const fs = require("fs");

// Sample data from the database (tasks + time_slots)
const eventsData = [
  {
    slot_id: 1,
    task_name: "Finish Report",
    start_time: "2025-03-10T09:00:00",
    end_time: "2025-03-10T10:30:00"
  },
  {
    slot_id: 2,
    task_name: "Team Meeting",
    start_time: "2025-03-11T14:00:00",
    end_time: "2025-03-11T15:00:00"
  }
];

// Function to parse date string into [YYYY, MM, DD, HH, MM]
const parseDateTime = (dateTime) => {
  const [date, time] = dateTime.split("T"); // Split date and time
  const [year, month, day] = date.split("-").map(Number); // Extract YYYY, MM, DD
  const [hour, minute] = time.split(":").map(Number); // Extract HH, MM
  return [year, month, day, hour, minute]; // Return array format required by ics
};

// Convert JSON data to ICS event format
const formattedEvents = eventsData.map(event => ({
  start: parseDateTime(event.start_time),
  end: parseDateTime(event.end_time),
  title: event.task_name
}));

// Generate ICS file
createEvents(formattedEvents, (error, value) => {
  if (error) {
    console.error("❌ Error generating ICS:", error);
  } else {
    fs.writeFileSync("Prompt_Engineering/json_to_ics_results.ics", value);
    console.log("✅ ICS file generated successfully: schedule.ics");
  }
});


//Note: u will require npm ics module installed to test this.
//Run this command which will create a file: node Prompt_Engineering\testing_json_to_ics.js



