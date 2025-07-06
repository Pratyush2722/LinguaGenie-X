import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "📝 Text Translator",
    desc: "Translate any text into multiple languages with tone control.",
    route: "/translate-text",
  },
  {
    title: "📄 PDF Translator",
    desc: "Upload a PDF and get a beautifully formatted translated document.",
    route: "/translate-pdf",
  },
  {
    title: "🧞‍♂️ Conversation Translator",
    desc: "Real-time multilingual voice chat — perfect for meetings or learning.",
    route: "/conversation",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full px-6 py-14 text-white flex flex-col items-center relative overflow-hidden"
      style={{
  backgroundImage: "url('/purple.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}}

    >
      {/* Overlay to darken the background just a lil */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Main content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🌐 LinguaGenie X
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-3xl mb-10">
          Your AI-powered gateway to mastering languages effortlessly. Whether it’s text, voice,
          PDFs, or live conversations — we help you speak the world’s languages with confidence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">{feat.title}</h2>
              <p className="text-gray-200 flex-grow mb-4">{feat.desc}</p>
              <button
                onClick={() => navigate(feat.route)}
                disabled={feat.disabled}
                className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  feat.disabled
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 text-white shadow-md"
                }`}
              >
                {feat.disabled ? "Coming Soon" : "✨ Let's Try"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
