import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import { createBarang } from "../../../_service/barang";
import { getKategori } from "../../../_service/kategori";

export default function BarangTambah() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        nama_barang: "",
        kategori_id: "",
        satuan: "",
        stok: "",
        batas_minimum: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!token || !userData || !userData.role) {
                navigate('/login');
                return;
            }
        };

        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for kategori_id to ensure we get the numeric ID
        if (name === 'kategori_id') {
            const selectedCategory = categories.find(cat => cat.kategori_id.toString() === value);
            console.log("=== KATEGORI SELECTION ===");
            console.log("All categories:", categories);
            console.log("Selected category object:", selectedCategory);
            console.log("Selected ID (value):", value);
            console.log("Selected ID type:", typeof value);
            console.log("Category name:", selectedCategory?.nama_kategori);
            console.log("========================");
        }
        
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

            // Prepare data for API - ensure kategori_id is properly converted
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

            // Console log the data before submission
            console.log("=== DATA YANG AKAN DISUBMIT ===");
            console.log("Form Data Original:", formData);
            console.log("Selected category ID:", selectedKategoriId);
            console.log("Processed Payload:", payload);
            console.log("Token:", token ? "Available" : "Not Available");
            console.log("==========================");

            const response = await createBarang(payload);
            console.log("Barang created successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Barang berhasil ditambahkan.',
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
            console.error("Create barang error:", error);
            
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
                setError("Failed to create barang. Please try again.");
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

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getKategori();
                setCategories(categoriesData);
                console.log("=== CATEGORIES DATA ===");
                console.log("Raw categories data:", categoriesData);
                console.log("Categories count:", categoriesData.length);
                console.log("Sample category structure:", categoriesData[0]);
                console.log("All category IDs and names:");
                categoriesData.forEach(cat => {
                    console.log(`- ID: ${cat.kategori_id} (${typeof cat.kategori_id}) -> ${cat.nama_kategori}`);
                });
                console.log("=====================");
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    console.log("Current Form Data:", formData);

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
                                    alt="Barang Illustration"
                                    className="w-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                {/* Fallback illustration if image not found */}
                                <div className="hidden">
                                    <div className="text-center">
                                        <div className="w-64 h-64 mx-auto mb-8 relative">
                                            <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                                            <div className="absolute top-8 left-8 w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                                                <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
                                                    <div className="text-white text-6xl">📦</div>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Tambah Barang Baru</h3>
                                        <p className="text-white/80">Kelola inventory dengan mudah dan efisien</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
                                Tambah Barang
                            </h2>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Barang */}
                                <div>
                                    <label htmlFor="nama_barang" className="block text-gray-600 text-sm mb-2">
                                        Nama Barang
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_barang"
                                        id="nama_barang"
                                        value={formData.nama_barang}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama barang"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label htmlFor="kategori_id" className="block text-gray-600 text-sm mb-2">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="kategori_id"
                                        name="kategori_id"
                                        value={formData.kategori_id}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                                            !formData.kategori_id ? 'border-gray-300' : 'border-green-300'
                                        }`}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((category) => (
                                            <option 
                                                key={category.kategori_id} 
                                                value={category.kategori_id}
                                                title={`ID: ${category.kategori_id} - ${category.nama_kategori}`}
                                            >
                                                {category.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                    {/* {formData.kategori_id && (
                                        <div className="mt-1 p-2 bg-blue-50 rounded">
                                            <p className="text-green-600 text-xs font-semibold">
                                                ✓ Kategori ID: {formData.kategori_id}
                                            </p>
                                            <p className="text-blue-600 text-xs">
                                                Nama: {categories.find(cat => cat.kategori_id.toString() === formData.kategori_id)?.nama_kategori || 'Not found'}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Deskripsi: {categories.find(cat => cat.kategori_id.toString() === formData.kategori_id)?.deskripsi || '-'}
                                            </p>
                                        </div>
                                    )} */}
                                </div>

                                {/* Satuan */}
                                <div>
                                    <label htmlFor="satuan" className="block text-gray-600 text-sm mb-2">
                                        Satuan
                                    </label>
                                    <select
                                        id="satuan"
                                        name="satuan"
                                        value={formData.satuan}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                                    <label htmlFor="stok" className="block text-gray-600 text-sm mb-2">
                                        Stok
                                    </label>
                                    <input
                                        type="number"
                                        name="stok"
                                        id="stok"
                                        value={formData.stok}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan jumlah stok"
                                        min="0"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Batas Minimum */}
                                <div>
                                    <label htmlFor="batas_minimum" className="block text-gray-600 text-sm mb-2">
                                        Batas Minimum
                                    </label>
                                    <input
                                        type="number"
                                        name="batas_minimum"
                                        id="batas_minimum"
                                        value={formData.batas_minimum}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                                        {isLoading ? "Menyimpan..." : "Tambah Barang"}
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
