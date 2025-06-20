import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import "./dashboard.css";

export default function Dashboard() {
  const [showBarangDropdown, setShowBarangDropdown] = useState(false);
  const [showLaporanDropdown, setShowLaporanDropdown] = useState(false);

  const handleLinkClick = () => {
    setShowBarangDropdown(false);
    setShowLaporanDropdown(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-name">
          <img src="/logo.png" alt="Logo Gudangku" />
          <strong>GudangKu</strong>
        </div>

        <nav className="dashboard-nav">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/Supplier" onClick={handleLinkClick}>Supplier</Link>

          <div
            className="dashboard-dropdown"
            onMouseEnter={() => setShowBarangDropdown(true)}
            onMouseLeave={() => setShowBarangDropdown(false)}
          >
            <span>Barang ▼</span>
            {showBarangDropdown && (
              <div className="dropdown-menu">
                <Link to="/Barang" className="dropdown-item" onClick={handleLinkClick}>Barang</Link>
                <Link to="/barang-masuk" className="dropdown-item" onClick={handleLinkClick}>Barang Masuk</Link>
                <Link to="/barang-keluar" className="dropdown-item" onClick={handleLinkClick}>Barang Keluar</Link>
              </div>
            )}
          </div>

          <div
            className="dashboard-dropdown"
            onMouseEnter={() => setShowLaporanDropdown(true)}
            onMouseLeave={() => setShowLaporanDropdown(false)}
          >
            <span>Laporan ▼</span>
            {showLaporanDropdown && (
              <div className="dropdown-menu">
                <Link to="/laporan-masuk" className="dropdown-item" onClick={handleLinkClick}>Laporan Masuk</Link>
                <Link to="/laporan-keluar" className="dropdown-item" onClick={handleLinkClick}>Laporan Keluar</Link>
              </div>
            )}
          </div>

          <div className="dashboard-account">
            <FaUserCircle className="account-icon" title="Akun" />
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="content-text">
          <h2>Hello, Petugas! 👋</h2>
          <h1>Kelola Stok Barangmu <br /> Lebih Mudah & Cepat!</h1>
          <p className="description">
            Pantau barang masuk, keluar, dan ketersediaan secara real-time, solusi inventaris cerdas untuk UMKM.
          </p>
          <div className="hero-buttons">
            <Link to="/register">
              <button className="btn-secondary">Registrasi UMKM</button>
            </Link>
          </div>
        </div>

        <div className="content-image">
          <img src="/landingpage.png" alt="Dashboard Illustration" />
        </div>
      </main>
    </div>
  );
}