import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GPUListing from "./pages/GPUListing";
import ConfirmationPage from "./pages/ConfirmationPage";
import RentalListPage from "./pages/RentalListPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpus" element={<GPUListing />} />
            <Route path="/rentals" element={<RentalListPage />} />
            <Route path="/confirmation/:id" element={<ConfirmationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
