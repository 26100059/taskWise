const express = require("express");
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.API_KEY;

const MODEL_NAME = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.get("/", async (req, res) => {
  try {
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
