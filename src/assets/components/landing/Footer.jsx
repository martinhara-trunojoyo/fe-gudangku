import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* Left Side - Logo and Tagline */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <img src="img/landing/logo.png" alt="GudangKu Logo" className="w-10 h-10" />
              <h2 className="text-xl font-bold text-gray-800">Gudangku</h2>
            </div>
            <p className="text-gray-600 max-w-xs italic">
              "Kontrol Stok Tanpa Batas, Kapan Saja dan dimana saja."
            </p>
          </div>

          {/* Right Side - Navigation Links */}
          <nav>
            <ul className="flex flex-wrap gap-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300 mb-6"></div>

        {/* Copyright */}
        <div className="text-right">
          <p className="text-gray-600 text-sm">
            © 2025 Gudangku. All Rights Reserved Owned by kelompok 6
          </p>
        </div>
      </div>
    </footer>
  );
}
