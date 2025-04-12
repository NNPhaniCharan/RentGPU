import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GPUListing from "./pages/GPUListing";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyRentalsPage from "./pages/MyRentalsPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpus" element={<GPUListing />} />
            <Route
              path="/confirmation/:rentalId"
              element={<ConfirmationPage />}
            />
            <Route path="/my-rentals" element={<MyRentalsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
