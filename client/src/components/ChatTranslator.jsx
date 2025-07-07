import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { HiSpeakerWave } from "react-icons/hi2";

const socket = io(`https://linguagenie-x.onrender.com`);

// const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");


export default function ConversationTranslator() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [toLang, setToLang] = useState("Hindi");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [speaking, setSpeaking] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    socket.emit("join", { user: "You", toLang });

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setLoading(false);

      const utter = new SpeechSynthesisUtterance(msg.translated);
      utter.lang = toLangString(toLang);
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    };

    socket.on("translatedMessage", handleMessage);
    return () => socket.off("translatedMessage", handleMessage);
  }, [toLang]);

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setLoading(true);
    setTimeout(() => {
      if (transcript.trim() !== "") {
        socket.emit("voiceMessage", {
          text: transcript,
          fromLang: "en",
          toLang,
        });
      }
      resetTranscript();
      setLoading(false);
    }, 500);
  };

  const speakAgain = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = toLangString(toLang);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white flex justify-center items-center p-4 relative"
      style={{ backgroundImage: "url('/purple.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Outer Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl px-6 py-8 z-10 transition-all duration-700 ease-in-out overflow-hidden"
        style={{
          height: messages.length > 0 ? "auto" : "280px",
          minHeight: "280px",
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 z-[-1] border-2 border-purple-600 blur-md opacity-40 rounded-3xl pointer-events-none" />

        <h2 className="text-purple-400 text-3xl font-bold mb-6 text-center">
          🧞 Real-Time Translator
        </h2>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>French</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>German</option>
            <option>Japanese</option>
            <option>Chinese</option>
            <option>Arabic</option>
            <option>Russian</option>
            <option>Portuguese</option>
          </select>

          <button
            onClick={() =>
              SpeechRecognition.startListening({ continuous: true })
            }
            disabled={listening}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 transition-all"
          >
            🎙️ Start
          </button>

          <button
            onClick={handleStop}
            disabled={!listening}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50 transition-all"
          >
            🛑 Stop
          </button>
        </div>

        {/* Indicators */}
        {listening && (
          <div className="mb-4 text-sm text-green-400 animate-pulse text-center">
            🎧 Listening...
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-yellow-400 animate-pulse text-center">
            🔄 Translating...
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-5 max-h-[450px] overflow-y-auto px-1">
          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              <div className="flex justify-end">
                <div className="bg-purple-600/30 backdrop-blur-sm text-white p-4 rounded-2xl rounded-br-none max-w-[75%] shadow-md animate-fadeInUp">
                  <div className="text-sm font-semibold mb-1">You said:</div>
                  <div className="text-sm">{msg.original}</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="relative bg-zinc-800/40 backdrop-blur-sm text-white p-4 rounded-2xl rounded-bl-none max-w-[80%] shadow-md animate-fadeInUp">
                  <div className="text-sm font-semibold mb-1">Bot replied:</div>
                  <div className="text-sm">{msg.translated}</div>
                  <button
                    onClick={() => speakAgain(msg.translated)}
                    className="absolute bottom-2 right-2 text-purple-300 hover:text-purple-500 transition"
                  >
                    <HiSpeakerWave size={20} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function toLangString(lang) {
  switch (lang) {
    case "French":
      return "fr-FR";
    case "Hindi":
      return "hi-IN";
    case "Spanish":
      return "es-ES";
    case "German":
      return "de-DE";
    case "Japanese":
      return "ja-JP";
    case "Chinese":
      return "zh-CN";
    case "Arabic":
      return "ar-SA";
    case "Russian":
      return "ru-RU";
    case "Portuguese":
      return "pt-PT";
    default:
      return "en-US";
  }
}
