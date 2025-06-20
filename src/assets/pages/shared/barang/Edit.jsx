import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import { showBarang, updateBarang } from "../../../_service/barang";
import { getKategori } from "../../../_service/kategori";

export default function BarangEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        nama_barang: "",
        kategori_id: "",
        satuan: "",
        stok: "",
        batas_minimum: ""
    });
    const [originalData, setOriginalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Check authentication and load data on component mount
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token || !userData || !userData.role) {
                    navigate('/login');
                    return;
                }

                await Promise.all([loadCategories(), loadBarangData()]);
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate('/login');
            }
        };

        if (id) {
            checkAuthAndLoadData();
        }
    }, [navigate, id]);

    const loadCategories = async () => {
        try {
            const categoriesData = await getKategori();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories");
        }
    };

    const loadBarangData = async () => {
        try {
            setIsLoadingData(true);
            const barangData = await showBarang(id);
            console.log("Loaded barang data:", barangData);
            
            if (barangData) {
                const formattedData = {
                    nama_barang: barangData.nama_barang || "",
                    kategori_id: barangData.kategori_id || "",
                    satuan: barangData.satuan || "",
                    stok: barangData.stok || "",
                    batas_minimum: barangData.batas_minimum || ""
                };
                setFormData(formattedData);
                setOriginalData({
                    ...formattedData,
                    kategori_nama: barangData.kategori?.nama_kategori || "Kategori tidak ditemukan"
                });
            } else {
                setError("No barang data found.");
            }
        } catch (error) {
            console.error("Error fetching barang data:", error);
            setError("Failed to load barang data. Please try again.");
            
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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

            // Validate required fields
            if (!formData.kategori_id || formData.kategori_id === "" || formData.kategori_id === "0") {
                setError("Please select a category.");
                setIsLoading(false);
                return;
            }

            // Prepare data for API
            const selectedKategoriId = parseInt(formData.kategori_id);
            
            if (isNaN(selectedKategoriId) || selectedKategoriId <= 0) {
                setError("Please select a valid category.");
                setIsLoading(false);
                return;
            }

            const payload = {
                nama_barang: formData.nama_barang.trim(),
                kategori_id: selectedKategoriId,
                satuan: formData.satuan,
                stok: parseInt(formData.stok) || 0,
                batas_minimum: parseInt(formData.batas_minimum) || 0
            };

            console.log("Updating barang with payload:", payload);

            const response = await updateBarang(id, payload);
            console.log("Barang updated successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Barang berhasil diperbarui.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });

            // Navigate back to barang list
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.role === 'admin') {
                navigate("/admin/barang");
            } else {
                navigate("/petugas/barang");
            }
        } catch (error) {
            console.error("Update barang error:", error);
            
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
            } else if (error.message) {
                setError(error.message);
            } else {
                setError("Failed to update barang. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.role === 'admin') {
            navigate("/admin/barang");
        } else {
            navigate("/petugas/barang");
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading barang data...</p>
                </div>
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
                        {/* Left Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h2 className="text-3xl font-bold text-purple-600 mb-8">
                                Edit Barang
                            </h2>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Current Data Display */}
                            {originalData.nama_barang && !isLoadingData && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-3">Data Barang Saat Ini:</h3>
                                    <div className="text-sm text-blue-700 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Nama Barang:</span>
                                            <span className="text-right">{originalData.nama_barang}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Kategori:</span>
                                            <span className="text-right">{originalData.kategori_nama}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Satuan:</span>
                                            <span className="text-right">{originalData.satuan}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Stok:</span>
                                            <span className="text-right">{originalData.stok}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Batas Minimum:</span>
                                            <span className="text-right">{originalData.batas_minimum}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Barang */}
                                <div>
                                    <label htmlFor="nama_barang" className="block text-gray-700 text-sm font-medium mb-2">
                                        Nama Barang
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_barang"
                                        id="nama_barang"
                                        value={formData.nama_barang}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama barang"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label htmlFor="kategori_id" className="block text-gray-700 text-sm font-medium mb-2">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="kategori_id"
                                        name="kategori_id"
                                        value={formData.kategori_id}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                                            !formData.kategori_id ? 'border-gray-200' : 'border-green-300'
                                        }`}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((category) => (
                                            <option 
                                                key={category.kategori_id} 
                                                value={category.kategori_id}
                                            >
                                                {category.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Satuan */}
                                <div>
                                    <label htmlFor="satuan" className="block text-gray-700 text-sm font-medium mb-2">
                                        Satuan
                                    </label>
                                    <select
                                        id="satuan"
                                        name="satuan"
                                        value={formData.satuan}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Pilih satuan</option>
                                        <option value="Pcs">Pcs</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Gram">Gram</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Meter">Meter</option>
                                        <option value="Box">Box</option>
                                        <option value="Pack">Pack</option>
                                        <option value="Unit">Unit</option>
                                    </select>
                                </div>

                                {/* Stok */}
                                <div>
                                    <label htmlFor="stok" className="block text-gray-700 text-sm font-medium mb-2">
                                        Stok
                                    </label>
                                    <input
                                        type="number"
                                        name="stok"
                                        id="stok"
                                        value={formData.stok}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan jumlah stok"
                                        min="0"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Batas Minimum */}
                                <div>
                                    <label htmlFor="batas_minimum" className="block text-gray-700 text-sm font-medium mb-2">
                                        Batas Minimum
                                    </label>
                                    <input
                                        type="number"
                                        name="batas_minimum"
                                        id="batas_minimum"
                                        value={formData.batas_minimum}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan batas minimum stok"
                                        min="0"
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

                        {/* Right Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                <img 
                                    src="/img/illustration/tambah-barang.png" 
                                    alt="Edit Barang Illustration"
                                    className="w-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                <div className="hidden">
                                    <div className="text-center">
                                        <div className="w-64 h-64 mx-auto mb-8 relative">
                                            <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                                            <div className="absolute top-8 left-8 w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                                                <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
                                                    <div className="text-white text-6xl">📝</div>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Edit Barang</h3>
                                        <p className="text-white/80">Perbarui informasi barang dengan mudah</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Grid Pattern Style */}
            <style>{`
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(107, 33, 168, 0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(107, 33, 168, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}
