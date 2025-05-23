import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExpertDetailPage from "./pages/ExpertDetailPage";
import Navbar from "./components/NavbarComponent/Navbar";
import ProfessionalDetailPage from "./pages/ProfessionalDetailPage";


function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
      
      {/* The navbar is seen everywhere so not be innthe routes */}
      <Navbar />
        
        {/* Main content with route handling */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experts/:id" element={<ExpertDetailPage />} />
            <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
          </Routes>
        </main>

        {/* Copyright footer */}
        <footer className="bg-gray-800 text-white py-6 mt-8">
          <div className="container mx-auto px-4 text-center">
            © {new Date().getFullYear()} QuickExpert
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;