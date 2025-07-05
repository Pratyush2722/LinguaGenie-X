import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Translator.css";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [tone, setTone] = useState("casual");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  // Below your existing imports
  const MAX_CHAR_LIMIT = 200; // Roughly 2-3 lines

  // 🔊 Text-to-Speech
  const speakText = (text) => {
    if (!text) return;

    // Limit to first N characters
    const truncated = text.slice(0, MAX_CHAR_LIMIT);

    const utterance = new SpeechSynthesisUtterance(truncated);
    const langMap = {
      French: "fr-FR",
      Spanish: "es-ES",
      Hindi: "hi-IN",
      German: "de-DE",
    };
    utterance.lang = langMap[targetLanguage] || "en-US";

    // Stop any ongoing speech before starting
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
    console.log("🎙️ Started Listening...");
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const handleStop = () => {
    console.log("🛑 Stopped Listening");
    SpeechRecognition.stopListening();
    setTimeout(() => {
      console.log("📝 Final Transcript:", transcript);
      setInputText(transcript);
    }, 500);
  };

  const handleTranslate = async () => {
    console.log("⚙️ Translating:", inputText);
    if (!inputText.trim()) {
      alert("Enter some text!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/translate", {
        inputText,
        targetLanguage,
        tone,
      });
      console.log("✅ Translated:", res.data.translatedText);
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      console.error("❌ Translation failed:", err);
      alert("Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translator-container">
      <div className="translator-box">
        <h1 className="translator-title">🌍 LinguaGenie X</h1>

        <textarea
          className="translator-textarea"
          rows="5"
          placeholder="Enter something to translate..."
          value={inputText || transcript}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <select
            className="translator-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option>French</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>German</option>
          </select>

          <select
            className="translator-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="funny">Funny</option>
          </select>
        </div>

        <div className="translator-button-group">
          <button
            className="translator-button"
            onClick={handleListen}
            disabled={listening}
          >
            🎤 Start Listening
          </button>
          <button
            className="translator-button mic"
            onClick={handleStop}
            disabled={!listening}
          >
            🛑 Stop
          </button>
          <button className="translator-button" onClick={handleTranslate}>
            {loading ? "Translating..." : "🔁 Translate"}
          </button>
        </div>
        {listening && (
          <div className="waveform">
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
            <div className="waveform-bar"></div>
          </div>
        )}

        {translatedText && (
          <div className="translator-output">
            <div className="translator-label">Translated:</div>
            <p>{translatedText}</p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                className="translator-button"
                onClick={() => speakText(translatedText)}
              >
                🔊 Speak it
              </button>
              <button className="translator-button mic" onClick={stopSpeech}>
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
