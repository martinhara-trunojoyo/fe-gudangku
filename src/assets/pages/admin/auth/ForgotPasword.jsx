import { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../_service/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await forgotPassword(email);
      console.log("Password reset requested successfully:", response);
      setIsSubmitted(true);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaebf6] px-4">
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-lg p-8">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#6556e8] mb-2">Forgot Password</h2>
              <p className="text-gray-600">
                Masukkan email yang terhubung dengan akun Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-[#f2f2f2]">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Tombol */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6556e8] text-white py-3 rounded-md font-semibold hover:bg-[#5849d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="flex items-center justify-center gap-2 text-[#6556e8] hover:text-[#5849d6] text-sm font-medium">
                  <FaArrowLeft size={12} />
                  Back to Login
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Sent!</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-block bg-[#6556e8] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#5849d6] transition"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
