// Script to clean JSON file and extract only the JSON content.

/**
 * Use this to clean the response from Deep Seek Distill.
 */
const fs = require('fs');

// Function to extract JSON from text content
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

// Main function
function cleanJSONFile(inputPath, outputPath) {
  try {
    // Read the input file
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    
    // Extract and clean the JSON
    const cleanedJSON = extractJSON(fileContent);
    
    // Write to output file
    fs.writeFileSync(outputPath, cleanedJSON);
    
    console.log(`Cleaned JSON has been saved to ${outputPath}`);
    console.log("Cleaned JSON content:");
    console.log(cleanedJSON);
  } catch (error) {
    console.error(`Failed to process the file: ${error.message}`);
  }
}



// Usage (you can modify these file paths as needed)
const inputFile = 'testing_private/prompt_results/Simple Insertion_after.json';
const outputFile = 'testing_private/prompt_results/Simple Insertion_after.json';

cleanJSONFile(inputFile, outputFile);











