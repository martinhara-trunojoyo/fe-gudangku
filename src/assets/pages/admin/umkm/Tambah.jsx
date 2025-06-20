import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUmkm } from "../../../_service/umkm";
import Swal from 'sweetalert2';

export default function TambahUMKM() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        namaUmkm: "",
        namaPemilik: "",
        alamat: "",
        kontak: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required. Please login again.");
                navigate('/login');
                return;
            }

            // Prepare data for API
            const umkmData = {
                nama_umkm: formData.namaUmkm,
                pemilik: formData.namaPemilik,
                alamat: formData.alamat,
                kontak: formData.kontak
            };

            const response = await createUmkm(umkmData, token);
            console.log("UMKM created successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'UMKM berhasil didaftarkan.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
            
            // Redirect to admin dashboard after successful submission
            navigate("/admin");
        } catch (error) {
            setError("Failed to create UMKM. Please try again.");
            console.error("Create UMKM error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 pt-20 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Large gradient circles */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/20 rounded-full blur-3xl"></div>
                
                {/* Small decorative shapes */}
                <div className="absolute top-1/4 left-1/5 w-16 h-16 rounded-lg bg-violet-200/40 rotate-12 animate-float-slow"></div>
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-blue-200/40 animate-float-medium"></div>
                <div className="absolute top-1/2 right-1/6 w-8 h-8 rounded-lg bg-purple-200/40 -rotate-12 animate-float-fast"></div>
                
                {/* Dots pattern */}
                <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
                
                {/* Subtle wave at bottom */}
                <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#7C3AED" fillOpacity="0.3" d="M0,192L48,208C96,224,192,256,288,240C384,224,480,160,576,149.3C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h1 className="text-3xl font-bold text-violet-600 mb-8">
                                Pendaftaran UMKM
                            </h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama UMKM */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Nama UMKM
                                    </label>
                                    <input
                                        type="text"
                                        name="namaUmkm"
                                        value={formData.namaUmkm}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama UMKM"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Nama Pemilik */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Nama Pemilik
                                    </label>
                                    <input
                                        type="text"
                                        name="namaPemilik"
                                        value={formData.namaPemilik}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama pemilik"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Alamat
                                    </label>
                                    <textarea
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Kontak */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Kontak
                                    </label>
                                    <input
                                        type="tel"
                                        name="kontak"
                                        value={formData.kontak}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan nomor telepon"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-violet-700 transition duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-violet-100 to-blue-100 p-8 lg:p-12 flex items-center justify-center">
                            <div className="relative">
                                {/* You can replace this with an actual illustration image */}
                                <img 
                                    src="/img/assets/regis-umkm.png" 
                                    alt="UMKM Registration Illustration"
                                    className="w-full max-w-md"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                {/* Fallback illustration if image not found */}
                                <div className="hidden">
                                    <div className="w-80 h-80 relative">
                                        {/* Simple SVG illustration as fallback */}
                                        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="100" y="150" width="200" height="150" rx="10" fill="#7C3AED" opacity="0.8"/>
                                            <rect x="120" y="170" width="160" height="110" rx="5" fill="white"/>
                                            <circle cx="150" cy="200" r="15" fill="#7C3AED"/>
                                            <circle cx="250" cy="200" r="15" fill="#7C3AED"/>
                                            <rect x="140" y="230" width="120" height="30" rx="15" fill="#7C3AED" opacity="0.3"/>
                                            <circle cx="200" cy="100" r="30" fill="#7C3AED"/>
                                            <path d="M170 100 Q200 80 230 100" stroke="#7C3AED" strokeWidth="3" fill="none"/>
                                        </svg>
                                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                                        <div className="absolute -top-4 -left-4 w-16 h-16 bg-violet-500 rounded-full opacity-20 animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom animations and patterns */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-10px) rotate(12deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-20px) rotate(-12deg); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                .bg-dot-pattern {
                    background-image: radial-gradient(#7C3AED 1px, transparent 1px);
                    background-size: 30px 30px;
                }
            `}</style>
        </div>
    );
}