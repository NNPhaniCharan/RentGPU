import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h4>GPURent</h4>
          <p>
            Decentralized GPU rental platform with performance verification and
            automatic penalty system.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gpus">Rent GPUs</Link>
            </li>
            <li>
              <Link to="#">How It Works</Link>
            </li>
            <li>
              <Link to="#">FAQ</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li>
              <Link to="#">Documentation</Link>
            </li>
            <li>
              <Link to="#">API Reference</Link>
            </li>
            <li>
              <Link to="#">Smart Contracts</Link>
            </li>
            <li>
              <Link to="#">Use Cases</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-links">
            <li>
              <Link to="#">Support</Link>
            </li>
            <li>
              <Link to="#">Partnership</Link>
            </li>
            <li>
              <Link to="#">Discord</Link>
            </li>
            <li>
              <Link to="#">Twitter</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright container">
        <p>&copy; {new Date().getFullYear()} GPURent. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
