/**
 * This script reads all JSON files in a directory, converts each to ICS format,
 * and saves individual ICS files named after their source JSON files. 
 * HOW TO USE:
 * run this command and specify the path or the default path is /testing_private/prompt_results :
 * node convert-json-to-ics.js [directory_path]
 * 
 * For my directory this command below works:
 * 
 * node convert-json-to-ics.js testing_private/prompt_results
 * 
 */

const { createEvents } = require("ics");
const fs = require("fs");
const path = require("path");

// Function to parse date string into [YYYY, MM, DD, HH, MM]
const parseDateTime = (dateTime) => {
  const [date, time] = dateTime.split("T"); // Split date and time
  const [year, month, day] = date.split("-").map(Number); // Extract YYYY, MM, DD
  const [hour, minute] = time.split(":").map(Number); // Extract HH, MM
  return [year, month, day, hour, minute]; // Return array format required by ics
};

// Function to convert a single JSON file to ICS
function convertJsonToIcs(jsonFilePath) {
  try {
    // Read and parse the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const eventsData = JSON.parse(jsonData);
    
    // Get the filename without extension for naming the output file
    const fileName = path.basename(jsonFilePath, '.json');
    
    // Convert JSON data to ICS event format
    const formattedEvents = eventsData.map(event => ({
      start: parseDateTime(event.start_time),
      end: parseDateTime(event.end_time),
      title: event.task_name
    }));
    
    // Generate ICS file
    createEvents(formattedEvents, (error, value) => {
      if (error) {
        console.error(` Error generating ICS for ${fileName}:`, error);
      } else {
        // Create output directory if it doesn't exist
        const outputDir = 'testing_private/before_after_ics_files';
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }
        
        // Write the ICS file
        const outputPath = path.join(outputDir, `${fileName}.ics`);
        fs.writeFileSync(outputPath, value);
        console.log(` ICS file generated successfully: ${outputPath}`);
      }
    });
  } catch (error) {
    console.error(`Error processing ${jsonFilePath}:`, error.message);
  }
}

// Main function to process all JSON files in a directory
function processDirectory(directoryPath) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      console.error(` Directory does not exist: ${directoryPath}`);
      return;
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(directoryPath);
    
    // Filter for JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
    
    if (jsonFiles.length === 0) {
      console.log(` No JSON files found in ${directoryPath}`);
      return;
    }
    
    console.log(`Found ${jsonFiles.length} JSON file(s) to process.`);
    
    // Process each JSON file
    jsonFiles.forEach(file => {
      const filePath = path.join(directoryPath, file);
      console.log(`Processing: ${filePath}`);
      convertJsonToIcs(filePath);
    });
    
  } catch (error) {
    console.error("❌ Error processing directory:", error.message);
  }
}

// Get directory path from command line argument or use default
const directoryPath = process.argv[2] || 'testing_private/prompt_results';
console.log(`Starting to process JSON files in: ${directoryPath}`);
processDirectory(directoryPath);

console.log(`
Note: This script requires the 'ics' npm module to run.
If not already installed, run: npm install ics
`);