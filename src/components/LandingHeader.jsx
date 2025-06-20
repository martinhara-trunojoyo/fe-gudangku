import React from "react";
import { Link } from "react-router-dom";
import "./LandingHeader.css";

const LandingHeader = () => {
  return (
    <>
      <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-name">
          <img
            src="/logo.png"
            alt="Logo Gudangku"
          />
          <strong>GudangKu</strong>
        </div>
        <ul className="nav-links">
  <li><a href="#home" className="nav-link">Home</a></li>
  <li><a href="#about" className="nav-link">About</a></li>
  <li><a href="#services" className="nav-link">Services</a></li>
  <li><a href="#contact" className="nav-link">Contact Us</a></li>
</ul>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
          Hello, Welcome to Gudangku!
          </h2>
          <h1 className="h1">
            Kelola Stok Barangmu Lebih Mudah & Cepat!
          </h1>
          <p>
            Pantau barang masuk, keluar, dan ketersediaan secara real-time,
            solusi inventaris cerdas untuk UMKM.
          </p>

          <div className="hero-buttons">
            <Link to="/register">
              <button className="btn-secondary">Registrasi</button>
            </Link>
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
          </div>
        </div>
        <div className="content-image">
          <img
            src="/landingpage.png"
            alt="Dashboard Illustration"
          />
        </div>
      </section>
      </div>
    </>
  );
};

export default LandingHeader;
