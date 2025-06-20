import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">About Us – GudangKu</h2>

      <div className="about-content">
        <img
          src="/about us.png"
          alt="GudangKu Illustration"
          className="about-image"
        />

        <p className="about-description">
        GudangKu adalah sebuah sistem informasi berbasis web yang dirancang khusus untuk membantu pelaku Usaha Kecil dan Menengah (UMKM) dalam mengelola inventaris barang secara efisien, akurat, dan terstruktur. Kami memahami bahwa pengelolaan stok merupakan salah satu aspek krusial dalam menjalankan bisnis, terutama bagi UMKM yang sedang berkembang.
          <br /><br />
          Dengan GudangKu, pengguna dapat mencatat, memantau, dan mengatur keluar-masuk barang serta melihat ketersediaan stok secara real-time. Sistem ini bertujuan untuk meminimalkan kesalahan pencatatan manual, meningkatkan efisiensi operasional, serta membantu pelaku usaha dalam mengambil keputusan yang lebih cepat dan tepat berdasarkan data yang tersedia.
        </p>
      </div>

      <div className="about-quote-wrapper">
  <div className="about-quote">
    “ Kami berkomitmen untuk terus menghadirkan solusi digital yang praktis, terjangkau, dan mudah digunakan, agar UKM dapat lebih fokus dalam mengembangkan usaha tanpa terbebani masalah manajemen gudang.”
  </div>

  <img
    src="/about.png"
    alt="GudangKu Illustration"
    className="about-image-side"
  />
</div>

     
    </div>
  );
};

export default About;
