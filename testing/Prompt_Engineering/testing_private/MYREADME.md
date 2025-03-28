# Schedule Generation and Validation with LLM

This project generates multiple schedules using a language model (LLM) based on different user inputs and current schedules to test if the model works correctly in various scenarios. The main focus is on validating the model's ability to generate schedules in accordance with a predefined database schema.

## Overview

The core functionality of this project revolves around generating schedules and testing the LLM's responses. The project includes several key components:

1. **Data Generation (`testing_prompt_in_groq.js`)**: This script generates multiple schedules using the LLM based on various user inputs and current schedules.
2. **Response Cleaning (`cleaning_llm_response.js`)**: The response generated by LLM is cleaned to retain only the valid JSON output. A sample non-cleaned response is included in the project.
3. **ICS Conversion (`json_to_ics.js`)**: The cleaned JSON data is converted into ICS format to visualize and validate the generated schedules.
4. **Visual Analysis (`before_after_ics_files`)**: The ICS files can be analyzed visually using online tools to check the correctness of the generated schedules.

**Note**: Although ICS conversion was not strictly necessary, it was used to enable the visual validation of the generated schedules. Full Calendar or other visualization tools can be used for more interactive and comprehensive schedule visualization.

## Workflow

1. **Testing with LLM**:  
   The script `testing_prompt_in_groq.js` generates schedules by querying the LLM. The LLM responds with data that closely resembles the database schema but includes extra non-JSON content (annotations, extra text, etc.). These responses are stored in the `prompt_results` folder.

2. **Cleaning the LLM Response**:  
   After generating the responses, the script `cleaning_llm_response.js` is run to extract only the valid JSON from the response. This cleaned JSON data is used for further processing.

3. **Converting JSON to ICS**:  
   The cleaned JSON data is passed through the `json_to_ics.js` script, which converts the data into ICS format. These ICS files are stored in the `before_after_ics_files` folder. The ICS conversion allows visual validation of the generated schedules.

4. **Visual Analysis**:  
   To validate the output visually, the generated ICS files can be uploaded to online ICS visualization tools or Full Calendar for manual inspection. This step is crucial for checking the generated schedules and ensuring they meet expectations.

---

YOU CAN READ THE HUMAN VERSION OF THIS IN testing_prompt_in_groq.js file top comments.
