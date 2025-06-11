// components/Footer.js

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Get to Know Us</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press Releases</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="#">Sell on Platform</a></li>
            <li><a href="#">Affiliate Marketing</a></li>
            <li><a href="#">Advertise Your Products</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Let Us Help You</h4>
          <ul>
            <li><a href="#">Your Account</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </div>
      <p className="footer-copyright">&copy; 2024. All rights reserved.</p>
    </footer>
  );
};

export default Footer;