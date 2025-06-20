import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function NavbarDashboard() {
  const [dropdownLaporan, setDropdownLaporan] = useState(false);
  const [dropdownProfile, setDropdownProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petugasName, setPetugasName] = useState("Petugas User");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navRef = useRef(null);
  const navigate = useNavigate();
  
  // Check authentication and petugas role
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Check if user is logged in and has petugas role
        if (!token || !userData || userData.role !== 'petugas') {
          // Redirect to login if not authenticated or not petugas
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        
        // Set user data if authenticated as petugas
        setIsAuthenticated(true);
        if (userData.name) {
          setPetugasName(userData.name);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownLaporan(false);
        setDropdownProfile(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllDropdowns = () => {
    setDropdownLaporan(false);
    setDropdownProfile(false);
  };

  // Don't render navbar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav ref={navRef} className="sticky top-0 flex items-center justify-between px-4 md:px-6 py-3 bg-[linear-gradient(to_right,_#F4F7FA,_#6817FF)] z-50">
      <div className="flex items-center gap-2">
        <img src="/img/landing/logo.png" alt="Gudangku Logo" className="w-8 h-8" />
        <span className="font-bold text-lg text-purple-800">Gudangku</span>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden text-gray-700 hover:text-purple-700 focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 relative">
        <li><Link to="/petugas" className="hover:text-sky-50 font-medium">Home</Link></li>
        <li><Link to="/petugas/supplier" className="hover:text-sky-50 font-medium">Supplier</Link></li>
        <li><Link to="/petugas/kategori" className="hover:text-sky-50 font-medium">Kategori</Link></li>
        <li><Link to="/petugas/barang" className="hover:text-sky-50 font-medium">Barang</Link></li>

        {/* Dropdown Laporan */}
        <li className="relative">
          <button
            onClick={() => {
              setDropdownLaporan(!dropdownLaporan);
              setDropdownProfile(false);
            }}
            className="hover:text-sky-50 font-medium flex items-center gap-1"
          >
            Laporan <span className="text-xs">▾</span>
          </button>
          {dropdownLaporan && (
            <ul className="absolute top-full right-0 mt-2 bg-white border rounded shadow-lg w-44 z-10 py-1">
              <li><Link to="/petugas/laporan/masuk" className="block px-4 py-2 hover:bg-purple-50 text-gray-700">Laporan Masuk</Link></li>
              <li><Link to="/petugas/laporan/keluar" className="block px-4 py-2 hover:bg-purple-50 text-gray-700">Laporan Keluar</Link></li>
            </ul>
          )}
        </li>

        {/* Profile Icon with Dropdown */}
        <li className="relative">
          <button
            onClick={() => {
              setDropdownProfile(!dropdownProfile);
              setDropdownLaporan(false);
            }}
            className="flex items-center"
          >
            <FaUserCircle className="text-2xl text-gray-700 cursor-pointer hover:text-purple-600" />
          </button>
          {dropdownProfile && (
            <ul className="absolute top-full right-0 mt-2 bg-white border rounded shadow-lg w-44 z-10 py-1">
              <li className="border-b border-gray-100 py-2 px-4 flex items-center">
                <span className="font-medium text-sm">{petugasName}</span>
              </li>
              {/* <li>
                <Link to="/petugas/profile" className="block px-4 py-2 hover:bg-purple-50 text-gray-700 flex items-center gap-2">
                  <FaUser className="text-gray-500" /> My Profile
                </Link>
              </li> */}
              {/* <li>
                <Link to="/petugas/settings" className="block px-4 py-2 hover:bg-purple-50 text-gray-700 flex items-center gap-2">
                  <FaCog className="text-gray-500" /> Settings
                </Link>
              </li> */}
              <li className="border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-red-600 flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-red-500" /> Logout
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <img src="/img/landing/logo.png" alt="Gudangku Logo" className="w-8 h-8" />
              <span className="font-bold text-lg text-purple-800">Gudangku</span>
            </div>
            <button 
              className="text-gray-700 hover:text-purple-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <ul className="p-4 space-y-4">
            <li>
              <Link 
                to="/petugas" 
                className="block py-2 hover:text-purple-600 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/petugas/supplier" 
                className="block py-2 hover:text-purple-600 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Supplier
              </Link>
            </li>
            <li>
              <Link 
                to="/petugas/kategori" 
                className="block py-2 hover:text-purple-600 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kategori
              </Link>
            </li>
            
            {/* Barang Link (no longer a dropdown) */}
            <li>
              <Link 
                to="/petugas/barang"
                className="block py-2 hover:text-purple-600 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Barang
              </Link>
            </li>
            
            {/* Mobile Laporan Menu */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 hover:text-purple-600 font-medium border-b border-gray-100"
                onClick={() => setDropdownLaporan(!dropdownLaporan)}
              >
                Laporan
                <span className="text-xs">{dropdownLaporan ? "▴" : "▾"}</span>
              </button>
              {dropdownLaporan && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link 
                      to="/petugas/laporan/masuk" 
                      className="block py-2 hover:text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Laporan Masuk
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/petugas/laporan/keluar" 
                      className="block py-2 hover:text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Laporan Keluar
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            {/* User profile mobile links */}
            <li className="pt-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <FaUserCircle className="text-3xl text-gray-700" />
                <span className="font-medium">{petugasName}</span>
              </div>
            </li>
            {/* <li>
              <Link 
                to="/petugas/profile" 
                className="flex items-center gap-2 py-2 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser className="text-gray-500" /> My Profile
              </Link>
            </li>
            <li>
              <Link 
                to="/petugas/settings" 
                className="flex items-center gap-2 py-2 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCog className="text-gray-500" /> Settings
              </Link>
            </li> */}
            <li className="border-t border-gray-100 mt-4 pt-2">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-red-600"
              >
                <FaSignOutAlt className="text-red-500" /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
