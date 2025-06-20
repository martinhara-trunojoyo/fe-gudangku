export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-white to-blue-50 py-12 px-8 md:px-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
        Services - GudangKu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center hover:shadow-md transition">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <img
              src="img/landing/icon/icon-1.png"
              alt="Inventory"
              className="w-6 h-6"
            />
          </div>
          <h3 className="font-semibold mb-2">Manajemen Inventaris</h3>
          <p className="text-sm text-gray-600">
            Pantau dan kelola stok barang masuk, keluar, serta ketersediaan
            barang secara real-time.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center hover:shadow-md transition">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <img
              src="img/landing/icon/icon-2.png"
              alt="Supplier"
              className="w-6 h-6"
            />
          </div>
          <h3 className="font-semibold mb-2">Supplier & Pengadaan Barang</h3>
          <p className="text-sm text-gray-600">
            Kelola data supplier dan pencatatan barang masuk secara terstruktur.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center hover:shadow-md transition">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <img
              src="img/landing/icon/icon-3.png"
              alt="Notification"
              className="w-6 h-6"
            />
          </div>
          <h3 className="font-semibold mb-2">
            Pemantauan Aktivitas & Notifikasi
          </h3>
          <p className="text-sm text-gray-600">
            Terima notifikasi otomatis terkait status stok.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 text-center hover:shadow-md transition">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <img
              src="img/landing/icon/icon-4.png"
              alt="Report"
              className="w-6 h-6"
            />
          </div>
          <h3 className="font-semibold mb-2">Laporan Pengguna</h3>
          <p className="text-sm text-gray-600">
            Akses laporan ringkasan stok dan transaksi, serta peran pengguna
            dalam sistem.
          </p>
        </div>
      </div>
    </section>
  );
}
