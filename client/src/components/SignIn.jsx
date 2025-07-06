import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: "url('/purple.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Glass Container */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl px-8 py-10">
        {/* Purple glow ring */}
        <div className="absolute inset-0 border-2 border-purple-600 blur-xl opacity-30 rounded-3xl z-[-1] pointer-events-none" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/purpletime.png"
            alt="Logo"
            className="w-28 sm:w-32 mb-3 drop-shadow-[0_0_25px_rgba(192,132,252,0.5)] animate-bounce-slow"
          />
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
            Welcome Back
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110 transition-all duration-300 shadow-lg"
          >
            🚪 Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
