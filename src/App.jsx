import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all necessary components
import HomePage from "./pages/HomePage";
import BeachDetailsPage from "./pages/BeachDetailsPage";
import EducationalContentPage from "./pages/EducationalContentPage";
import CommunityPage from "./pages/CommunityPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/beach/:beachName" element={<BeachDetailsPage />} />
        <Route path="/education" element={<EducationalContentPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
