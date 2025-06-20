import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyUmkm } from "../../_service/umkm";

export default function HeroDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [hasUmkm, setHasUmkm] = useState(false);
  const [isLoadingUmkm, setIsLoadingUmkm] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.name) {
        setAdminName(userData.name);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }

    // Check if admin has UMKM
    const checkUmkmStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getMyUmkm(token);
          if (response && response.data) {
            setHasUmkm(true);
          }
        }
      } catch (error) {
        // If error occurs (like 400 - no UMKM), admin doesn't have UMKM
        setHasUmkm(false);
      } finally {
        setIsLoadingUmkm(false);
      }
    };

    checkUmkmStatus();
  }, []);

  return (
    <div
      id="hero"
      className="hero-landing bg-gradient-to-r from-blue-50 to-violet-700 text-gray-900 min-h-screen"
    >
      <section className="container mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[80vh]">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6">
              Hello, {adminName}! 👋
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              Kelola Stok Barangmu{" "}
              <span className="text-violet-700">Lebih Mudah</span> &{" "}
              <span className="text-violet-700">Cepat!</span>
            </h1>

            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Pantau barang masuk, keluar, dan ketersediaan secara real-time.
              Solusi inventaris cerdas untuk UMKM modern.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isLoadingUmkm ? (
                <div className="bg-gray-400 text-white px-6 py-2 rounded-md font-semibold cursor-not-allowed">
                  Loading...
                </div>
              ) : hasUmkm ? (
                <Link to="/admin/edit-umkm" className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
                  Update UMKM
                </Link>
              ) : (
                <Link to="/admin/registrasi-umkm" className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
                  Registrasi UMKM
                </Link>
              )}
              <Link to="/admin/petugas" className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
                Data Petugas
              </Link>
              <Link to="/admin/dashboard" className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
                Dashboard
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Real-time tracking</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Easy to use</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                <span className="text-sm font-medium">UMKM focused</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-200 to-blue-200 rounded-3xl opacity-50 blur-xl"></div>

              {/* Main image container */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6">
                <img
                  src="/img/landing/image-hero.png"
                  alt="Inventory Management Illustration"
                  className="w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
                <span className="font-bold text-sm">📊 Real-time</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-violet-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
                <span className="font-bold text-sm">⚡ Fast</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
