// routes/translatePdf.js
const express = require("express");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const multer = require("multer");
const router = express.Router();
require('dotenv').config();

const groqApiKey = process.env.GROQ_API_KEY;


// Multer config for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), async (req, res) => {
     console.log("📥 Received PDF upload");
  if (!req.file) {
    console.log("❌ No file found in request");
    return res.status(400).json({ error: "No PDF uploaded." });
  }
  console.log("📄 File path:", req.file.path);

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);
    const rawText = data.text;

    const targetLang = req.body.targetLanguage || "Hindi";
const prompt = `
Translate the following document to ${targetLang}.

📌 Instructions:
- Use short paragraphs and natural breaks
- Maintain original structure if possible
- Highlight key points (if any)
- Keep it clean and readable

Here's the text:

${rawText}
`;


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
          Authorization: `Bearer ${groqApiKey}`, // ✅
          "Content-Type": "application/json",
        }
      }
    );

    const translatedText = response.data.choices[0].message.content;
    res.json({ translatedText });
  } catch (err) {
    console.error("🔥 PDF Translation Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "PDF translation failed", details: err?.response?.data });
  } finally {
    // Optional: cleanup the uploaded file
    fs.unlink(req.file.path, () => {});
  }
});

router.post("/test", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  return res.json({
    message: "✅ File uploaded successfully!",
    fileInfo: req.file,
  });
});

module.exports = router;
