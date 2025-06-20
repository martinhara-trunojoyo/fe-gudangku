import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateKategori, showKategori } from "../../../_service/kategori"; // pastikan path sesuai
import Swal from "sweetalert2";

export default function KategoriEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nama_kategori: "",
        deskripsi: "",
    });
    const [originalData, setOriginalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Load existing kategori data when component mounts
    useEffect(() => {
        const loadKategoriData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication required. Please login again.");
                    navigate("/login");
                    return;
                }

                // Fetch current kategori data from API
                const response = await showKategori(id);
                console.log("Loaded kategori data:", response);
                
                if (response) {
                    const kategoriData = {
                        nama_kategori: response.nama_kategori || "",
                        deskripsi: response.deskripsi || "",
                    };
                    setFormData(kategoriData);
                    setOriginalData(kategoriData);
                } else {
                    setError("No kategori data found.");
                }
            } catch (error) {
                console.error("Error loading kategori data:", error);
                setError("Failed to load kategori data. Please try again.");
                
                // Handle authentication errors
                if (error.message === "Unauthenticated." || error.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            loadKategoriData();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Get token from localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication required. Please login again.");
                navigate("/login");
                return;
            }

            // Prepare data for API
            const updateData = {
                nama_kategori: formData.nama_kategori,
                deskripsi: formData.deskripsi,
            };

            const response = await updateKategori(id, updateData);
            console.log("Kategori updated successfully:", response);

            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data kategori berhasil diperbarui.",
                confirmButtonText: 'OK',
                confirmButtonColor: "#7C3AED",
            });

            // Navigate back to kategori list
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            if (userData.role === "admin") {
                navigate("/admin/kategori");
            } else {
                navigate("/petugas/kategori");
            }
        } catch (error) {
            console.error("Update kategori error:", error);
            
            // Handle authentication errors
            if (error.message === "Unauthenticated." || error.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            
            // Handle validation errors
            if (error.errors) {
                const errorMessages = Object.values(error.errors).flat().join(", ");
                setError(errorMessages);
            } else {
                setError("Failed to update kategori. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.role === "admin") {
            navigate("/admin/kategori");
        } else {
            navigate("/petugas/kategori");
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading data kategori...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 pt-20 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Large Circle */}
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-200/30 to-purple-300/20 backdrop-blur-3xl"></div>
                
                {/* Small Circles */}
                <div className="absolute top-[20%] left-[5%] w-16 h-16 rounded-full bg-blue-200/20"></div>
                <div className="absolute bottom-[10%] right-[20%] w-24 h-24 rounded-full bg-purple-200/20"></div>
                
                {/* Wave Pattern */}
                <svg className="absolute bottom-0 left-0 w-full opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#8B5CF6" fillOpacity="0.5" d="M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                {/* Illustration image */}
                                <img 
                                    src="/img/illustration/tambah-barang.png" 
                                    alt="Kategori Illustration"
                                    className="w-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                {/* Fallback illustration if image not found */}
                                <div className="hidden">
                                    <svg className="w-full h-auto" viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="100" y="100" width="200" height="150" rx="10" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="2"/>
                                        <rect x="120" y="130" width="60" height="10" rx="2" fill="white"/>
                                        <rect x="120" y="150" width="160" height="10" rx="2" fill="white"/>
                                        <rect x="120" y="170" width="120" height="10" rx="2" fill="white"/>
                                        <rect x="120" y="190" width="80" height="10" rx="2" fill="white"/>
                                        <rect x="80" y="60" width="70" height="25" rx="12.5" fill="#FCD34D"/>
                                        <rect x="160" y="60" width="70" height="25" rx="12.5" fill="#34D399"/>
                                        <rect x="240" y="60" width="70" height="25" rx="12.5" fill="#60A5FA"/>
                                        <circle cx="320" cy="220" r="30" fill="rgba(255,255,255,0.2)"/>
                                        <circle cx="80" cy="250" r="20" fill="rgba(255,255,255,0.2)"/>
                                    </svg>
                                    
                                    <div className="mt-8 text-center text-white">
                                        <h3 className="text-2xl font-bold mb-2">Edit Kategori</h3>
                                        <p className="text-white/80">Kelola kategori barang dengan mudah</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
                                Edit Kategori
                            </h2>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Current Data Display */}
                            {originalData.nama_kategori && !isLoadingData && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-3">Data Kategori Saat Ini:</h3>
                                    <div className="text-sm text-blue-700 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Nama Kategori:</span>
                                            <span className="text-right">{originalData.nama_kategori}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Deskripsi:</span>
                                            <span className="text-right break-words">{originalData.deskripsi}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Kategori */}
                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">
                                        Nama Kategori
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_kategori"  
                                        value={formData.nama_kategori}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama kategori"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        name="deskripsi"
                                        value={formData.deskripsi}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                                        placeholder="Masukkan deskripsi kategori"
                                        rows="3"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Submit and Cancel Buttons */}
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
                    </div>
                </div>
            </div>

            {/* Grid Pattern Style */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(107, 33, 168, 0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(107, 33, 168, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}
