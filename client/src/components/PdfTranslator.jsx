import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const PdfTranslator = () => {
  const [file, setFile] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(translatedText, 180);
    doc.text(lines, 15, 20);
    const fileName = `translated_to_${targetLanguage}_${Date.now()}.pdf`;
    doc.save(fileName);
    alert(`PDF downloaded as ${fileName}`);
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("targetLanguage", targetLanguage);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/translate-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      console.error("Upload/Translation error:", err);
      alert("Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative text-white"
      style={{
        backgroundImage: "url('/purple.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dim overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Floating glass container */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl px-6 py-8">
        {/* Purple ring aura */}
        <div className="absolute inset-0 z-[-1] rounded-3xl border-2 border-purple-600 blur-xl opacity-30 pointer-events-none" />

        <h2 className="text-3xl font-extrabold text-purple-300 mb-6 text-center">
          🗃️ PDF Upload + Translate
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-2 mb-4 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />

        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full px-4 py-2 mb-6 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        >
          <option value="Hindi">Hindi</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Spanish">Spanish</option>
          <option value="Bengali">Bengali</option>
        </select>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition-all duration-200 ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110"
          }`}
        >
          {loading ? "Translating..." : "📤 Upload & Translate"}
        </button>

        {translatedText && (
          <div className="mt-8 bg-white/10 border border-white/20 p-5 rounded-2xl shadow-inner max-h-[280px] overflow-y-auto">
            <div className="text-purple-200 font-semibold mb-3 text-lg">
              📄 Translated Output:
            </div>
            <pre className="text-sm leading-relaxed text-purple-100 whitespace-pre-wrap">
              {translatedText}
            </pre>

            <button
              onClick={handleDownloadPDF}
              className="mt-5 w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 shadow-md"
            >
              📥 Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfTranslator;
