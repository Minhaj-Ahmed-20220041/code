import React from 'react';
import './Footer.css'; // Importing CSS for styling
import logo from '../../images/logo.png'; // Importing logo image
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container">
          <img src={logo} alt="GadgetZone Logo" className="footer-logo" />
        </div>
        <div className="footer-links">
          <Link to="/">Shop</Link>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <p className="footer-text">&copy; 2024 GadgetZone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
