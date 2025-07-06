
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const axios = require("axios");
// require("dotenv").config(); // Load environment variables

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // HTTP & WebSocket Server Setup
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // You can restrict this in prod
//   },
// });

// // Routes
// const translateRoute = require("./routes/translateText");
// const translatePdfRoute = require("./routes/translatePdf");

// app.use("/translate", translateRoute);
// app.use("/translate-pdf", translatePdfRoute);

// // Default route
// app.get("/", (req, res) => {
//   res.send("🧞‍♂️ Welcome to LinguaGenie X Backend!");
// });

// io.on("connection", (socket) => {
//   console.log("⚡ New client connected");

//   socket.on("join", ({ user, toLang }) => {
//     console.log(`🟢 ${user} joined with target language: ${toLang}`);
//     socket.user = user;
//     socket.toLang = toLang;
//   });

//   socket.on("voiceMessage", async ({ text, fromLang }) => {
//     console.log(`📩 Received voice message: "${text}" from ${fromLang}`);

//     try {
//       const translated = await translateWithGroq(text, socket.toLang || "Hindi");
//       console.log("✅ Translated text:", translated);

//       io.emit("translatedMessage", {
//         user: socket.user || "You",
//         original: text,
//         translated,
//         lang: socket.toLang || "Hindi",
//       });
//     } catch (error) {
//       console.error("❌ Error in translation:", error.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ A user disconnected");
//   });
// });



// // 🧠 GROQ Translator
// async function translateWithGroq(text, toLang) {
//   const prompt = `Translate this to ${toLang}:\n\n${text}`;

//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "meta-llama/llama-4-scout-17b-16e-instruct",
//       messages: [
//         { role: "system", content: "You are a professional translator." },
//         { role: "user", content: prompt },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data.choices[0].message.content;
// }

// // 🚀 Start the server
// server.listen(PORT, () => {
//   console.log(`🔥 LinguaGenie X is live on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Routes
const translateRoute = require("./routes/translateText");
const translatePdfRoute = require("./routes/translatePdf");

app.use("/translate", translateRoute);
app.use("/translate-pdf", translatePdfRoute);

app.get("/", (req, res) => {
  res.send("🧞‍♂️ Welcome to LinguaGenie X Backend!");
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected");

  socket.on("join", ({ user, toLang }) => {
    console.log(`🟢 ${user} joined with target language: ${toLang}`);
    socket.user = user;
    // socket.toLang = toLang;
  });

  // socket.on("voiceMessage", async ({ text, fromLang }) => {
  //   console.log(`📩 Received voice message: "${text}" from ${fromLang}`);

  //   try {
  //     const translated = await translateWithGroq(text, socket.toLang || "Hindi");
  //     console.log("✅ Translated text:", translated);

  //     socket.emit("translatedMessage", {
  //       user: socket.user || "You",
  //       original: text,
  //       translated,
  //       lang: socket.toLang || "Hindi",
  //     });

  //     console.log("📤 Emitted translatedMessage to all clients.");
  //   } catch (error) {
  //     console.error("❌ Error in translation:", error.message);
  //   }
  // });

  socket.on("voiceMessage", async ({ text, fromLang, toLang }) => {
  console.log(`📩 Received voice message: "${text}" from ${fromLang}, target: ${toLang}`);

  try {
    const translated = await translateWithGroq(text, toLang || "Hindi"); // 🔁 Use message toLang
    console.log("✅ Translated text:", translated);

    socket.emit("translatedMessage", {
      user: socket.user || "You",
      original: text,
      translated,
      lang: toLang || "Hindi",
    });

    console.log("📤 Emitted translatedMessage to client.");
  } catch (error) {
    console.error("❌ Error in translation:", error.message);
  }
});

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

async function translateWithGroq(text, toLang) {
  const prompt = `
Translate the following English sentence to ${toLang}.
ONLY return the translated version in ${toLang}, with **no explanations**, **no alternatives**, and **no additional text**.

Text:
${text}
`;
  console.log("🔍 Sending translation request to GROQ API...");

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "You are a professional translator." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("💥 GROQ Translation failed:", error?.response?.data || error.message);
    throw new Error("Translation API is temporarily unavailable. Please try again later.");
  }
}


server.listen(PORT, () => {
  console.log(`🔥 LinguaGenie X is live on http://localhost:${PORT}`);
});
