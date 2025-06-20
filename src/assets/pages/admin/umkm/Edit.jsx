import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUmkm, getMyUmkm } from "../../../_service/umkm";
import Swal from 'sweetalert2';

export default function EditUMKM() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        namaUmkm: "",
        namaPemilik: "",
        alamat: "",
        kontak: ""
    });
    const [originalData, setOriginalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Load existing UMKM data when component mounts
    useEffect(() => {
        const loadUmkmData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication required. Please login again.");
                    navigate('/login');
                    return;
                }

                // Fetch current UMKM data from API
                const response = await getMyUmkm(token);
                console.log("Loaded UMKM data:", response);
                
                if (response && response.data) {
                    const umkmData = {
                        namaUmkm: response.data.nama_umkm || "",
                        namaPemilik: response.data.pemilik || "",
                        alamat: response.data.alamat || "",
                        kontak: response.data.kontak || ""
                    };
                    setFormData(umkmData);
                    setOriginalData(umkmData);
                } else {
                    setError("No UMKM data found for your account.");
                }
            } catch (error) {
                console.error("Error loading UMKM data:", error);
                setError("Failed to load UMKM data. Please try again.");
            } finally {
                setIsLoadingData(false);
            }
        };

        loadUmkmData();
    }, [id, navigate]);

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

            // Prepare data for API - Laravel expects all required fields
            const updateData = {
                nama_umkm: formData.namaUmkm,
                pemilik: formData.namaPemilik,
                alamat: formData.alamat,
                kontak: formData.kontak
            };

            const response = await updateUmkm(updateData, token);
            console.log("UMKM updated successfully:", response);
            
            // Update localStorage with new data
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData && userData.umkm) {
                userData.umkm = { ...userData.umkm, ...updateData };
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data UMKM berhasil diperbarui.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
            
            navigate("/admin");
        } catch (error) {
            setError("Failed to update UMKM. Please try again.");
            console.error("Update UMKM error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/admin");
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-gray-600">Loading UMKM data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Animated Shapes */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-tr from-violet-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse-slower"></div>
                
            
                
                {/* Wave Bottom */}
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#7C3AED" fillOpacity="0.08" d="M0,96L48,117.3C96,139,192,181,288,186.7C384,192,480,160,576,160C672,160,768,192,864,197.3C960,203,1056,181,1152,160C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                
               
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-purple-100/50">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h1 className="text-3xl font-bold text-violet-600 mb-8">
                                Perbarui Informasi UMKM
                            </h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Current Data Display */}
                            {originalData.namaUmkm && !isLoadingData && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-3">Data UMKM Saat Ini:</h3>
                                    <div className="text-sm text-blue-700 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Nama UMKM:</span>
                                            <span className="text-right">{originalData.namaUmkm}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Pemilik:</span>
                                            <span className="text-right">{originalData.namaPemilik}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Alamat:</span>
                                            <span className="text-right break-words">{originalData.alamat}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Kontak:</span>
                                            <span className="text-right">{originalData.kontak}</span>
                                        </div>
                                    </div>
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
                                <div className="pt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-3/4 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="w-1/4 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-violet-100/70 to-blue-100/70 backdrop-blur-sm p-8 lg:p-12 flex items-center justify-center">
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
            
            {/* Custom animations */}
            <style jsx>{`
                .bg-stripes {
                    background-image: linear-gradient(45deg, #7C3AED 25%, transparent 25%, transparent 50%, #7C3AED 50%, #7C3AED 75%, transparent 75%, transparent);
                    background-size: 20px 20px;
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-15px) rotate(12deg); }
                }
                
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-20px) rotate(-12deg); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite;
                }
                
                .animate-pulse-slower {
                    animation: pulse-slower 12s infinite;
                }
                
                .animate-float {
                    animation: float 7s ease-in-out infinite;
                }
                
                .animate-float-reverse {
                    animation: float-reverse 9s ease-in-out infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}