import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="w-full px-8 py-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-sm border-b border-white/10 z-20">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <img
            src="/purpletime.png"
            alt="Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_14px_rgba(192,132,252,0.5)]"
          />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-wide">
            LinguaGenie X
          </h1>
        </div>

        {/* Right: Sign In Button */}
        <button
          onClick={() => navigate("/signin")}
          className="px-6 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition shadow-md"
        >
          🔐 Sign In
        </button>
      </header>

      {/* ===== MAIN HERO SECTION ===== */}
      <div className="flex flex-col items-center justify-center px-8 py-28 sm:py-32 relative text-center">
        {/* Glowing background ring */}
        <div className="absolute w-[800px] h-[800px] bg-purple-700 opacity-20 blur-[200px] rounded-full z-[-1] animate-pulse-slow" />

        {/* Hero Main Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 w-full max-w-7xl">
          {/* Text Section */}
          <div className="flex-1 text-left">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
              Speak. Learn. Connect. 🌍
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-xl">
              Dive into the future of communication. Whether it's casual chats,
              global meetings, or academic learning —{" "}
              <span className="text-purple-400 font-medium">LinguaGenie X</span>{" "}
              bridges the language gap using real-time AI translation.
            </p>
          </div>

          {/* Giant Logo Image */}
          <div className="flex-1 flex justify-center relative">
            <img
              src="/purpletime.png"
              alt="LinguaGenie Hero Logo"
              className="w-[420px] sm:w-[500px] md:w-[560px] lg:w-[600px] animate-heartbeat animate-glow transition-all duration-500"
            />
          </div>
        </div>

        {/* Centered Button Below Section */}
        <button
          onClick={() => navigate("/home")}
          className="mt-16 py-4 px-10 rounded-xl text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 transition-all duration-300 shadow-2xl"
        >
          🚀 Start Translating
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
