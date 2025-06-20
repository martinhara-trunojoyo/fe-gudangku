import { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../_service/auth";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (token && userData && userData.role) {
          // User is already authenticated, redirect to their dashboard
          if (userData.role === 'admin') {
            navigate('/admin');
          } else if (userData.role === 'petugas') {
            navigate('/petugas');
          } else {
            navigate('/dashboard');
          }
          return;
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      console.log("Login successful:", response);
      
      // Store token and user data
      localStorage.setItem('token', response.authorization.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate based on user role
      const userRole = response.user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'petugas') {
        navigate('/petugas');
      } else {
        // Default fallback or handle other roles
        navigate('/dashboard');
      }
    } catch (error) {
      setError( "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eaebf6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6556e8] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaebf6] px-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden">
        {/* Ilustrasi */}
        <div className="w-full md:w-1/2 flex justify-center p-6">
          <img
            src="img/auth/login.png"
            alt="Login Illustration"
            className="w-80 md:w-full"
          />
        </div>

        {/* Form Login */}
        <div className="w-full md:w-1/2 flex justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#6556e8] text-center mb-8">
              Log in
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-[#f2f2f2]">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-[#f2f2f2]">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 ml-2 focus:outline-none"
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[#6556e8] focus:ring-[#6556e8] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-[#6556e8] hover:text-[#5849d6] font-medium transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Tombol */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6556e8] text-white py-3 rounded-md font-semibold hover:bg-[#5849d6] transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
