import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-left">
          <img src="/logo.png" alt="Gudangku" className="footer-logo" />
          <p className="footer-tagline">
            "Kontrol Stok Tanpa Batas, Kapan Saja dan dimana saja."
          </p>
        </div>

        <div className="footer-right">
          <ul className="footer-nav">
            <li><a href="#LandingHeader">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <p className="footer-bottom">
        © 2025 Gudangku. All Rights Reserved. Owned by kelompok 6
      </p>
    </footer>
  );
};

export default Footer;
