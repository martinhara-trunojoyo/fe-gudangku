export default function AboutUs() {
  return (
    <section id="about-us" className="py-16 px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
          About Us - GudangKu
        </h2>

        {/* First Content Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          {/* Left Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src="img/landing/about-us-1.png"
                alt="GudangKu Management Illustration"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              GudangKu adalah sebuah sistem informasi berbasis web yang
              dirancang khusus untuk membantu pelaku Usaha Kecil dan Menengah
              (UMKM) dalam mengelola inventaris barang secara efisien, akurat,
              dan terstruktur. Kami memahami bahwa pengelolaan stok merupakan
              salah satu aspek krusial dalam menjalankan bisnis, terutama bagi
              UMKM yang sedang berkembang.
            </p>
          </div>
        </div>

        {/* Second Content Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20">
          {/* Right Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src="img/landing/about-us-2.png"
                alt="GudangKu Warehouse Management Illustration"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>

          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              Dengan GudangKu, pengguna dapat mencatat, memantau, dan mengatur
              keluar- masuk barang serta melihat ketersediaan stok secara
              real-time. Sistem ini bertujuan untuk meminimalkan kesalahan
              pencatatan manual, meningkatkan efisiensi operasional, serta
              membantu pelaku usaha dalam mengambil keputusan yang lebih cepat
              dan tepat berdasarkan data yang tersedia.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 lg:p-12">
          <blockquote className="text-center">
            <p className="text-xl lg:text-2xl text-gray-800 font-medium leading-relaxed mb-6 italic">
              "Kami berkomitmen untuk terus menghadirkan solusi digital yang
              praktis, terjangkau, dan mudah digunakan, agar UKM dapat lebih
              fokus dalam mengembangkan usaha tanpa terbebani masalah manajemen
              gudang".
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
