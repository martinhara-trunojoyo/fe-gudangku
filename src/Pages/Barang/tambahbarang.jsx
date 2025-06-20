import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tambahbarang.css";

const Tambahbarang = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    stok: "",
    umkm: "",
  });

  const [showPopup, setShowPopup] = useState(false); // popup state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedData = localStorage.getItem("dataBarang");
    const dataBarang = storedData ? JSON.parse(storedData) : [];

    const newId =
      dataBarang.length > 0 ? Math.max(...dataBarang.map((b) => b.id)) + 1 : 1;

    const stokNumber = Number(formData.stok);
    if (isNaN(stokNumber) || stokNumber < 0) {
      alert("Stok harus berupa angka 0 atau lebih");
      return;
    }

    const newBarang = {
      id: newId,
      nama: formData.nama.trim(),
      kategori: formData.kategori.trim(),
      stok: stokNumber,
      umkm: formData.umkm.trim(),
    };

    const updatedData = [...dataBarang, newBarang];
    localStorage.setItem("dataBarang", JSON.stringify(updatedData));

    setShowPopup(true); // tampilkan popup
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/barang");
  };

  return (
    <div className="form-wrapper">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Barang berhasil ditambahkan!</p>
            <button className="popup-ok-button" onClick={handlePopupClose}>
              OK
            </button>
          </div>
        </div>
      )}

      <div className="form-image">
        <img src="/barang.png" alt="Ilustrasi Belanja" />
      </div>

      <div className="form-container">
        <div className="form-card">
          <div className="form-content">
            <h2>Form Tambah Barang</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nama">Nama Barang</label>
              <input
                id="nama"
                name="nama"
                type="text"
                placeholder="Masukkan nama barang"
                value={formData.nama}
                onChange={handleChange}
                required
              />

              <label htmlFor="kategori">Kategori</label>
              <input
                id="kategori"
                name="kategori"
                type="text"
                placeholder="Masukkan kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
              />

              <label htmlFor="stok">Stok</label>
              <input
                id="stok"
                name="stok"
                type="number"
                placeholder="Jumlah stok"
                value={formData.stok}
                onChange={handleChange}
                required
                min="0"
              />

              <label htmlFor="umkm">UMKM</label>
              <input
                id="umkm"
                name="umkm"
                type="text"
                placeholder="Masukkan UMKM"
                value={formData.umkm}
                onChange={handleChange}
                required
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tambahbarang;
