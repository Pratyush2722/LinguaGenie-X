import React, { useState } from "react";
import axios from "axios";
import "./Translator.css"; // Reusing same styles
import jsPDF from "jspdf";


const PdfTranslator = () => {
  const [file, setFile] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(translatedText, 180); // wrap text
  doc.text(lines, 15, 20);
  doc.save("translated_output.pdf");
};


  const handleUpload = async () => {
    if (!file) return alert("Upload a PDF file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("targetLanguage", targetLanguage);

    try {
      const res = await axios.post("http://localhost:5000/translate-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="translator-container">
      <div className="translator-box">
        <h2 className="translator-title">🗃️ PDF Upload + Translate</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="translator-input"
        />

        <select
          className="translator-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="Hindi">Hindi</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Spanish">Spanish</option>
          <option value="Bengali">Bengali</option>
        </select>

        <button
          className="translator-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Translating..." : "📤 Upload & Translate"}
        </button>

        {translatedText && (
          <div className="translator-output">
            <div className="translator-label">📄 Translated Output:</div>
            <pre>{translatedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfTranslator;
