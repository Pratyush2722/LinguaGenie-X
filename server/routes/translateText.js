// routes/translateText.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

require('dotenv').config();

const groqApiKey = process.env.GROQ_API_KEY;

router.post("/", async (req, res) => {
  const { inputText, targetLanguage, tone } = req.body;

  if (!inputText || !targetLanguage) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `Translate the following text into ${targetLanguage} in a ${tone || "neutral"} tone:\n\n${inputText}`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "You are a professional translator." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`, // ✅,
          "Content-Type": "application/json"
        }
      }
    );

    const translated = response.data.choices[0].message.content;
    res.json({ translatedText: translated });
  } catch (error) {
    console.error("Translation error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Translation failed", details: error?.response?.data });
  }
});

module.exports = router;
