import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Translator from "./components/Translator"; // text
import PdfTranslator from "./components/PdfTranslator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/translate-text" element={<Translator />} />
        <Route path="/translate-pdf" element={<PdfTranslator />} />
        {/* Add others later */}
      </Routes>
    </Router>
  );
}
export default App;