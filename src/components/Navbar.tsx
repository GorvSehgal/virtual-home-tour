import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/branding/listingview360-logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            src={logo}
            alt="ListingView360"
            className="navbar-logo-image"
          />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/properties" onClick={closeMenu}>
            Properties
          </Link>

          <Link to="/properties" onClick={closeMenu}>
            360° Tours
          </Link>

          <Link to="/for-realtors" onClick={closeMenu}>
            For Realtors
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link
            to="/list-property"
            className="nav-cta"
            onClick={closeMenu}
          >
            List Your Property
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;