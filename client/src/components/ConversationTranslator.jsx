import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./ConversationTranslator.css"; // <- Don't forget to create this file!

const socket = io("http://localhost:5000");

export default function ConversationTranslator() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [toLang, setToLang] = useState("Hindi");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  

  useEffect(() => {
    socket.emit("join", { user: "You", toLang });

    const handleMessage = (msg) => {
      console.log("📬 Got translated message from server:", msg);
      setMessages((prev) => [...prev, msg]);
      setLoading(false);

      const utter = new SpeechSynthesisUtterance(msg.translated);
      utter.lang = toLangString(toLang);
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    };

    socket.on("translatedMessage", handleMessage);

    return () => {
      socket.off("translatedMessage", handleMessage);
    };
  }, [toLang]);

  const handleStop = () => {
    console.log("🛑 Stopping microphone...");
    SpeechRecognition.stopListening();

    setLoading(true);
setTimeout(() => {
  console.log("🎤 Final transcript captured:", transcript);
  if (transcript.trim() !== "") {
    socket.emit("voiceMessage", { text: transcript, fromLang: "en", toLang });
    console.log("📨 Sent voiceMessage to server");
  } else {
    console.warn("⚠️ No transcript detected!");
  }
  resetTranscript();
  setLoading(false);
}, 500);

  };

  return (
   <div className="translator-container">
  <h2 className="title">🧞 Real-Time Translator</h2>

  <div className="controls">
    <select onChange={(e) => setToLang(e.target.value)} value={toLang}>
      <option>French</option>
      <option>Hindi</option>
      <option>Spanish</option>
    </select>

    <button onClick={() => SpeechRecognition.startListening({ continuous: true })} disabled={listening}>
      🎙️ Start
    </button>

    <button onClick={handleStop} disabled={!listening}>
      🛑 Stop
    </button>

    {listening && <div className="speaking-wave" title="Listening..."></div>}
    {loading && <div className="spinner" title="Translating..."></div>}
  </div>

  <div className="chat-box">
    {messages.map((msg, i) => (
      <div key={i} className={`message ${msg.user === "You" ? "user" : "bot"}`}>
        <div className="bubble">
          <div>{msg.original}</div>
          <div className="translated">→ {msg.translated}</div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

function toLangString(lang) {
  if (lang === "French") return "fr-FR";
  if (lang === "Hindi") return "hi-IN";
  if (lang === "Spanish") return "es-ES";
  return "en-US";
}
