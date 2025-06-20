import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePetugas, showPetugas } from "../../../_service/petugas";
import Swal from 'sweetalert2';

export default function EditPetugas() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    const [originalData, setOriginalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Load existing petugas data when component mounts
    useEffect(() => {
        const loadPetugasData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication required. Please login again.");
                    navigate('/login');
                    return;
                }

                // Fetch current petugas data from API
                const response = await showPetugas(id);
                console.log("Loaded petugas data:", response);
                
                if (response) {
                    const petugasData = {
                        name: response.name || "",
                        username: response.username || "",
                        email: response.email || "",
                        password: "" // Don't pre-fill password
                    };
                    setFormData(petugasData);
                    setOriginalData(petugasData);
                } else {
                    setError("No petugas data found.");
                }
            } catch (error) {
                console.error("Error loading petugas data:", error);
                setError("Failed to load petugas data. Please try again.");
                
                // Handle authentication errors
                if (error.message === "Unauthenticated." || error.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            loadPetugasData();
        }
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

            // Prepare data for API - based on Laravel validation rules
            const updateData = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            };

            const response = await updatePetugas(id, updateData);
            console.log("Petugas updated successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data petugas berhasil diperbarui.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
            
            navigate("/admin/petugas");
        } catch (error) {
            console.error("Update petugas error:", error);
            
            // Handle authentication errors
            if (error.message === "Unauthenticated." || error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            // Handle validation errors
            if (error.errors) {
                const errorMessages = Object.values(error.errors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError("Failed to update petugas. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/admin/petugas");
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-gray-600">Loading petugas data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-tr from-violet-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse-slower"></div>
                
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
                                Edit Data Petugas
                            </h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Current Data Display */}
                            {originalData.name && !isLoadingData && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-3">Data Petugas Saat Ini:</h3>
                                    <div className="text-sm text-blue-700 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Nama:</span>
                                            <span className="text-right">{originalData.name}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Username:</span>
                                            <span className="text-right">{originalData.username}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Email:</span>
                                            <span className="text-right">{originalData.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan username"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan email"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                                        placeholder="Masukkan password baru (min. 6 karakter)"
                                        required
                                        minLength="6"
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
                                <img 
                                    src="/img/illustration/tambah-petugas.png" 
                                    alt="Edit Petugas Illustration"
                                    className="w-full max-w-md"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                {/* Fallback illustration */}
                                <div className="hidden">
                                    <div className="w-80 h-80 relative">
                                        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="100" y="150" width="200" height="150" rx="10" fill="#7C3AED" opacity="0.8"/>
                                            <rect x="120" y="170" width="160" height="110" rx="5" fill="white"/>
                                            <circle cx="200" cy="100" r="30" fill="#7C3AED"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom animations */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite;
                }
                
                .animate-pulse-slower {
                    animation: pulse-slower 12s infinite;
                }
            `}</style>
        </div>
    );
}