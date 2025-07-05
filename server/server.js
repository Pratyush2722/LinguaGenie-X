const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const translateRoute = require("./routes/translateText");
const translatePdfRoute = require("./routes/translatePdf");
// const ytRoute = require("./routes/ytTranscript");
// const voiceRoute = require("./routes/voiceInput");

// Mount routes
app.use("/translate", translateRoute);
app.use("/translate-pdf", translatePdfRoute);

// app.use("/yt", ytRoute);                  // placeholder
// app.use("/voice", voiceRoute);            // placeholder

// Default route
app.get("/", (req, res) => {
  res.send("🧞‍♂️ Welcome to LinguaGenie X Backend!");
  

});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
