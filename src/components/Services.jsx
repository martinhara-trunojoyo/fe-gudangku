import React from 'react';
import './services.css';

const services = [
  {
    icon: '/services/manajemen.png', 
    title: 'Manajemen Inventaris',
    description: 'Pantau dan kelola stok barang masuk, keluar, serta ketersediaan barang secara real-time.'
  },
  {
    icon: '/services/suplier.png',
    title: 'Supplier & Pengadaan Barang',
    description: 'Kelola data supplier dan pencatatan barang masuk secara terstruktur.'
  },
  {
    icon: '/services/notifications.png',
    title: 'Pemantauan Aktivitas & Notifikasi',
    description: 'Terima notifikasi otomatis terkait status stok.'
  },
  {
    icon: '/services/report.png',
    title: 'Laporan Pengguna',
    description: 'Akses laporan ringkasan stok dan transaksi, serta atur peran pengguna dalam sistem.'
  }
];

const Services = () => {
  return (
    <div className="services-container">
      <h2 className="services-title">Services – GudangKu</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="icon-box">
              <img src={service.icon} alt="icon" />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-desc">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
