import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import Navbar from "./components/Navbar";
import "./App.css";
import  Footer from "./components/Footer";
import ForRealtorsPage from "./pages/ForRealtorsPage";
import ListPropertyPage from "./pages/ListPropertyPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route
  path="/properties/:slug"
  element={<PropertyDetailsPage />}
/>
        <Route path="/for-realtors" element={<ForRealtorsPage />} />
        <Route path="/list-property" element={<ListPropertyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;