import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    
   

    return (
        <nav className="bg-[linear-gradient(to_right,_#F4F7FA,_#6817FF)] py-3 px-4 md:px-6 fixed w-full top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-200 flex items-center justify-center">
              <img src="img/landing/logo.png" alt="logo" className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-gray-800">GudangKu</h1>
          </Link>
  
          {/* Desktop Navigation and Auth - Combined Container */}
          <div className="hidden md:flex items-center gap-8">
            {/* Desktop Navigation */}
            <ul className="flex gap-6 font-medium items-center">
              <li>
                <a href="#hero" className="text-gray-700 hover:text-indigo-700 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about-us" className="text-gray-700 hover:text-indigo-700 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-700 hover:text-indigo-700 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact-us" className="text-gray-700 hover:text-indigo-700 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Desktop Auth Buttons */}
            <div className="flex gap-3 items-center">
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-700 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-md"
              >
                Register
              </Link>
            </div>
          </div>
  
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 p-2 rounded-md hover:bg-white/20 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
  
        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <ul className="flex flex-col py-2">
            <li>
              <Link 
                to="/" 
                className={`block py-3 px-6 font-medium transition-colors hover:bg-indigo-50 ${location.pathname === '/' ? 'text-violet-600 bg-indigo-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`block py-3 px-6 font-medium transition-colors hover:bg-indigo-50 ${location.pathname === '/about' ? 'text-violet-600 bg-indigo-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                className={`block py-3 px-6 font-medium transition-colors hover:bg-indigo-50 ${location.pathname === '/services' ? 'text-violet-600 bg-indigo-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`block py-3 px-6 font-medium transition-colors hover:bg-indigo-50 ${location.pathname === '/contact' ? 'text-violet-600 bg-indigo-50' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
          
          {/* Mobile Auth Buttons */}
          <div className="border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
            <Link 
              to="/login" 
              className="py-2 px-4 text-center text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="py-2 px-4 text-center bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    )
}
