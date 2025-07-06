import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Translator from "./components/Translator"; 
import PdfTranslator from "./components/PdfTranslator";
import ConversationTranslator from "./components/ChatTranslator"; 
import HeroSection from "./components/HeroSection";
import SignIn from "./components/SignIn"; // Assuming you have a SignIn component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/translate-text" element={<Translator />} />
        <Route path="/translate-pdf" element={<PdfTranslator />} />
        <Route path="/conversation" element={<ConversationTranslator />} />
        <Route path="/signin" element={<SignIn />} />
        {/* Add others later */}
      </Routes>
    </Router>
  );
}
export default App;