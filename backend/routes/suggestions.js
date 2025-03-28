// routes/suggestions.js
const express = require("express");
const router = express.Router();

const API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.get("/", async (req, res) => {
  try {
    // Generate a productivity tip prompt
    // const prompt =
    //   "You are an intelligent productivity assistant. Provide a brief and concise productivity tip to enhance the user's workflow. The tip must not exceed 300 characters. Provide only the tip text.";
      const prompt =
      "You are an intelligent productivity assistant. Provide a brief and concise productivity tip (under 300 characters) to enhance the user's workflow. Try to make the phrase catchy or rhyming, and funny of possible **Do not include any internal reasoning or chain-of-thought. Only return the tip text.**";
    
    const llmResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const llmJson = await llmResponse.json();
    let tip = llmJson.choices?.[0]?.message?.content?.trim() || "";
    // Ensure tip does not exceed 300 characters (trim if necessary)
    if (tip.length > 300) {
      tip = tip.substring(0, 300);
    }
    res.json({ suggestion: tip });
  } catch (error) {
    console.error("Error generating suggestion:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
