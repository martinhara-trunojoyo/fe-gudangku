import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registrasi.css";
import Dashboard from "../components/dashboard-petugas";

export default function Registrasi() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaUMKM: "",
    namaPemilik: "",
    alamat: "",
    kontak: "",
  });
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // state untuk popup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { namaUMKM, namaPemilik, alamat, kontak } = formData;
    if (!namaUMKM || !namaPemilik || !alamat || !kontak) {
      setError("Semua field harus diisi!");
      return;
    }

    setError("");
    setShowPopup(true); // tampilkan popup sukses
  };

  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/dashboard"); // pindah ke halaman berikutnya setelah klik Oke
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2 className="title">Pendaftaran UMKM</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>Nama UMKM:</label>
          <input
            type="text"
            name="namaUMKM"
            placeholder="Masukkan nama UMKM"
            value={formData.namaUMKM}
            onChange={handleChange}
          />

          <label>Nama Pemilik:</label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="Masukkan nama pemilik"
            value={formData.namaPemilik}
            onChange={handleChange}
          />

          <label>Alamat:</label>
          <input
            type="text"
            name="alamat"
            placeholder="Masukkan alamat"
            value={formData.alamat}
            onChange={handleChange}
          />

          <label>Kontak:</label>
          <input
            type="text"
            name="kontak"
            placeholder="Masukkan kontak"
            value={formData.kontak}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Registrasi</button>
        </form>
      </div>

      <div className="image-section">
        <img src="/registrasi.png" alt="UMKM Illustration" />
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Registrasi Berhasil!</h3>
            <button onClick={handleOkClick}>Oke</button>
          </div>
        </div>
      )}
    </div>
  );
}
