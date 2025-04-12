import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaEthereum } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <FaEthereum size={24} className="me-2" />
              <h5 className="mb-0">GPU Rental Platform</h5>
            </div>
            <p className="text-muted mb-0 mt-2">
              Secure and decentralized GPU rentals on Ethereum
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="mb-3">Navigation</h5>
            <div className="d-flex gap-3">
              <Link to="/" className="text-light text-decoration-none">
                Home
              </Link>
              <Link to="/gpus" className="text-light text-decoration-none">
                GPUs
              </Link>
              <Link
                to="/my-rentals"
                className="text-light text-decoration-none"
              >
                My Rentals
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <a
              href="https://github.com/NNPhaniCharan/RentGPU"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light"
            >
              <FaGithub className="me-2" />
              View on GitHub
            </a>
          </div>
        </div>
        <hr className="my-3 border-secondary" />
        <div className="text-center text-muted">
          <small>
            © {new Date().getFullYear()} GPU Rental Platform | Built on Ethereum
            Sepolia Network
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
