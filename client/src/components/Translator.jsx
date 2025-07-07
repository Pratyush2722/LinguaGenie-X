import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [tone, setTone] = useState("casual");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_CHAR_LIMIT = 200;

  const speakText = (text) => {
    if (!text) return;
    const truncated = text.slice(0, MAX_CHAR_LIMIT);
    const utterance = new SpeechSynthesisUtterance(truncated);
    const langMap = {
      French: "fr-FR",
      Spanish: "es-ES",
      Hindi: "hi-IN",
      German: "de-DE",
      Japanese: "ja-JP",
      Arabic: "ar-SA",
    };
    utterance.lang = langMap[targetLanguage] || "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    console.log("🎤 Live transcript update:", transcript);
  }, [transcript]);

  const handleListen = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Sorry, your browser doesn’t support speech recognition.");
      return;
    }
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setTimeout(() => {
      setInputText(transcript);
    }, 500);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert("Enter some text!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/translate`, {
        inputText,
        targetLanguage,
        tone,
      });
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white flex justify-center items-center p-4 relative"
      style={{ backgroundImage: "url('/purple.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Card */}
      <div className="relative w-full max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl px-6 py-8 z-10">
        {/* Glow ring */}
        <div className="absolute inset-0 z-[-1] border-2 border-purple-600 blur-md opacity-40 rounded-3xl pointer-events-none" />

        <h1 className="text-purple-400 text-3xl font-bold mb-6 text-center">
          🌍 LinguaGenie X - Voice & Text Translator
        </h1>

        <textarea
          className="w-full p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="5"
          placeholder="Enter something to translate..."
          value={inputText || transcript}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option>French</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>German</option>
            <option>Bengali</option>
            <option>Japanese</option>
            <option>Arabic</option>
          </select>

          <select
            className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="funny">Funny</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 transition-all"
            onClick={handleListen}
            disabled={listening}
          >
            🎤 Start Listening
          </button>
          <button
            className="flex-1 py-3 bg-gray-700 border border-gray-500 rounded-lg font-bold hover:bg-gray-600"
            onClick={handleStop}
            disabled={!listening}
          >
            🛑 Stop
          </button>
          <button
            className="flex-1 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 transition-all"
            onClick={handleTranslate}
          >
            {loading ? "Translating..." : "🔁 Translate"}
          </button>
        </div>

        {listening && (
          <div className="flex justify-center items-end gap-1 h-8 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-500 rounded animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {translatedText && (
          <div className="mt-4 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-inner max-h-[300px] overflow-y-auto">
            <div className="text-purple-300 font-semibold mb-3 text-lg">
              🧠 Translated Output:
            </div>
            <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-purple-100">
              {translatedText}
            </p>

            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110"
                onClick={() => speakText(translatedText)}
              >
                🔊 Speak it
              </button>
              <button
                className="flex-1 py-2 bg-gray-700 border border-gray-500 rounded-lg hover:bg-gray-600 font-semibold"
                onClick={stopSpeech}
              >
                🛑 Stop Speech
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;
