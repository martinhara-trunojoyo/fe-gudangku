import { useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../_service/auth";

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get token and email from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if token and email are present
    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    
    // Simple validation
    if (passwords.password.length < 8) {
      setError("Password harus minimal 8 karakter");
      return;
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await resetPassword({
        token,
        email,
        password: passwords.password,
        password_confirmation: passwords.confirmPassword
      });
      
      console.log("Password reset successful:", response);
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Failed to reset password. Please try again or request a new reset link.");
      console.error("Reset password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaebf6] px-4">
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-lg p-8">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#6556e8] mb-2">Reset Password</h2>
              <p className="text-gray-600">
                Silakan masukkan password baru Anda untuk menyelesaikan proses reset password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-[#f2f2f2]">
                  <FaLock className="text-gray-500 mr-2" />
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    value={passwords.password}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Masukkan password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="text-gray-500 ml-2 focus:outline-none"
                  >
                    {showPassword.password ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password minimal 8 karakter</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-[#f2f2f2]">
                  <FaLockOpen className="text-gray-500 mr-2" />
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Konfirmasi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="text-gray-500 ml-2 focus:outline-none"
                  >
                    {showPassword.confirmPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !token || !email}
                className="w-full bg-[#6556e8] text-white py-3 rounded-md font-semibold hover:bg-[#5849d6] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Proses...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-[#6556e8] hover:text-[#5849d6] font-medium">
                  Kembali ke Halaman Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Password Berhasil Diubah!</h3>
            <p className="text-gray-600 mb-6">
              Password Anda telah berhasil diperbarui. Anda akan dialihkan ke halaman login.
            </p>
            <Link
              to="/login"
              className="inline-block bg-[#6556e8] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#5849d6] transition"
            >
              Login Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
