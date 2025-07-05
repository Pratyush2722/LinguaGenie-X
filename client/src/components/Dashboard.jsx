import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Optional: if you want custom styling

const features = [
  {
    title: "📝 Text Translator",
    desc: "Translate any text into multiple languages with tone control.",
    route: "/translate-text",
  },
  {
    title: "📄 PDF Translator",
    desc: "Upload a PDF and get a neatly formatted translated version.",
    route: "/translate-pdf",
  },
  {
    title: "🎙️ Voice Input",
    desc: "Speak and convert your voice to translated text (coming soon).",
    route: "/voice", // Optional: for future use
    disabled: true,
  },
  {
    title: "📺 YouTube Subtitle Translator",
    desc: "Paste a YouTube link and get translated subtitles. (WIP)",
    route: "/yt",
    disabled: true,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚀 Welcome to LinguaGenie X</h1>
      <p className="dashboard-subtext">Choose a feature and get started!</p>

      <div className="dashboard-cards">
        {features.map((feat, index) => (
          <div className="card" key={index}>
            <h2>{feat.title}</h2>
            <p>{feat.desc}</p>
            <button
              onClick={() => navigate(feat.route)}
              disabled={feat.disabled}
              className={feat.disabled ? "btn-disabled" : "btn-try"}
            >
              {feat.disabled ? "Coming Soon" : "✨ Let's Try"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
