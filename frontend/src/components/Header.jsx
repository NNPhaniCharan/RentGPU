import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          GPU<span>Rent</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gpus">Rent GPUs</Link>
            </li>
            <li>
              <Link to="/my-rentals">My Rentals</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
