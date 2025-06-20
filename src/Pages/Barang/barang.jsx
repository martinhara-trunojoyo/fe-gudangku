import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./barang.css";

export default function Barang() {
  const navigate = useNavigate();

  const [showBarangDropdown, setShowBarangDropdown] = useState(false);
  const [showLaporanDropdown, setShowLaporanDropdown] = useState(false);
  const [dataBarang, setDataBarang] = useState([]);

  // Load data dari localStorage
  const loadData = () => {
    const storedData = localStorage.getItem("dataBarang");
    if (storedData) {
      setDataBarang(JSON.parse(storedData));
    } else {
      setDataBarang([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLinkClick = () => {
    setShowBarangDropdown(false);
    setShowLaporanDropdown(false);
  };

  const handleAddData = () => {
    navigate("/tambahbarang");
  };

  const handleEdit = (id) => {
    navigate(`/barang/edit/${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus barang ini?");
    if (confirmDelete) {
      const updated = dataBarang.filter((barang) => barang.id !== id);
      setDataBarang(updated);
      localStorage.setItem("dataBarang", JSON.stringify(updated));
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-name">
          <img src="/logo.jfif" alt="Logo Gudangku" />
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

      {/* Halaman Barang */}
      <div className="barang-page">
        <div className="header">
          <span>Hello, Admin! 👋</span>
          <h2 className="headerTitle">DATA BARANG</h2>
        </div>

        <div className="toolbar">
          <button className="btnAdd" onClick={handleAddData}>+ Add Data</button>
          <input
            type="text"
            className="searchInput"
            placeholder="Search barang"
          />
        </div>

        <table className="dataTable">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataBarang.length === 0 ? (
              <tr>
                <td colSpan="5" align="center">Tidak ada data</td>
              </tr>
            ) : (
              dataBarang.map((barang, index) => (
                <tr key={barang.id}>
                  <td>{index + 1}</td>
                  <td>{barang.nama}</td>
                  <td>{barang.kategori}</td>
                  <td>{barang.stok}</td>
                  <td>
                    <button
                      className="editButton"
                      onClick={() => handleEdit(barang.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => handleDelete(barang.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="footer">
          <span>
            Showing 1 to {dataBarang.length} of {dataBarang.length} entries
          </span>
          <div className="pagination">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>...</span>
            <span>5</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
