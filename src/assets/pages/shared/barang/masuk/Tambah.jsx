import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBox, FaTruck, FaCalendarAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { createStockIn } from "../../../../_service/stockIn";
import { getBarang } from "../../../../_service/barang";
import { getSupplier } from "../../../../_service/supplier";

export default function TambahBarangMasuk() {
    const { id } = useParams(); // barang_id from URL
    const navigate = useNavigate();
    
    // Helper function to get Indonesian local time
    const getIndonesianDateTime = () => {
        const now = new Date();
        // Create a new date with Indonesian timezone (UTC+7)
        const indonesianTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        return indonesianTime.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        barang_id: id || "",
        supplier_id: "",
        jumlah_masuk: "",
        tanggal_masuk: getIndonesianDateTime() // Default to Indonesian current datetime
    });
    const [barangList, setBarangList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState(null);
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

                await Promise.all([loadBarangData(), loadSupplierData()]);
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate, id]);

    const loadBarangData = async () => {
        try {
            const data = await getBarang();
            setBarangList(data);
            
            // If there's an ID in params, find and set the selected barang
            if (id) {
                const barang = data.find(b => 
                    (b.barang_id && b.barang_id.toString() === id) || 
                    (b.id && b.id.toString() === id) ||
                    (b.product_id && b.product_id.toString() === id)
                );
                if (barang) {
                    setSelectedBarang(barang);
                    setFormData(prev => ({
                        ...prev,
                        barang_id: barang.barang_id || barang.id || barang.product_id
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching barang:", error);
            setError("Failed to load barang data");
        }
    };

    const loadSupplierData = async () => {
        try {
            const data = await getSupplier();
            setSupplierList(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            setError("Failed to load supplier data");
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

        // Update selected barang when barang_id changes
        if (name === 'barang_id') {
            const barang = barangList.find(b => 
                (b.barang_id && b.barang_id.toString() === value) || 
                (b.id && b.id.toString() === value) ||
                (b.product_id && b.product_id.toString() === value)
            );
            setSelectedBarang(barang);
        }

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
            if (!formData.barang_id || !formData.supplier_id || !formData.jumlah_masuk || !formData.tanggal_masuk) {
                setError("Please fill in all required fields.");
                setIsLoading(false);
                return;
            }

            // Convert datetime to Indonesian timezone and format for API
            const selectedDateTime = new Date(formData.tanggal_masuk);
            const indonesianDateTime = new Date(selectedDateTime.getTime() + (7 * 60 * 60 * 1000));
            const formattedDateTime = indonesianDateTime.toISOString().replace('T', ' ').slice(0, 19);

            // Prepare data for API
            const stockInData = {
                barang_id: parseInt(formData.barang_id),
                supplier_id: parseInt(formData.supplier_id),
                jumlah_masuk: parseInt(formData.jumlah_masuk),
                tanggal_masuk: formattedDateTime // Format: "2024-01-15 10:30:00"
            };

            console.log("=== STOCK IN SUBMISSION ===");
            console.log("Form data:", formData);
            console.log("Indonesian formatted datetime:", formattedDateTime);
            console.log("Processed data:", stockInData);
            console.log("Selected barang:", selectedBarang);
            console.log("==========================");

            const response = await createStockIn(stockInData);
            console.log("Stock In created successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Barang masuk berhasil dicatat.',
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
            console.error("Create stock in error:", error);
            
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
                setError("Failed to create stock in record. Please try again.");
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
                    <p className="mt-4 text-gray-600">Loading data...</p>
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
                        {/* Left Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
                            <div className="text-center">
                                                                <img 
                                    src="/img/illustration/barang-masuk.png" 
                                    alt="Barang Illustration"
                                    className="w-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <div className="mx-auto mb-8 relative">

                                    {/* Animated illustration for Barang Masuk */}

                                    <h2 className="text-2xl font-bold text-white mt-4 mb-2">Tambah Barang Masuk</h2>
                                    <p className="text-white/80">Catat semua barang yang masuk ke gudang untuk memudahkan pelacakan stok.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
                                Form Barang Masuk
                            </h2>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Selected Barang Info */}
                            {selectedBarang && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-2">Barang Yang Dipilih:</h3>
                                    <div className="text-sm text-blue-700">
                                        <p><strong>Nama:</strong> {selectedBarang.nama_barang}</p>
                                        <p><strong>Stok Saat Ini:</strong> {selectedBarang.stok} {selectedBarang.satuan}</p>
                                        <p><strong>Kategori:</strong> {selectedBarang.kategori?.nama_kategori || '-'}</p>
                                    </div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Barang (Item) */}
                                <div>
                                    <label htmlFor="barang_id" className="block text-gray-600 text-sm mb-2">
                                        Nama Barang <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="barang_id"
                                        name="barang_id"
                                        value={formData.barang_id}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        required
                                        disabled={isLoading || !!id} // Disable if ID is provided from URL
                                    >
                                        <option value="">Pilih Barang</option>
                                        {barangList.map(barang => (
                                            <option key={barang.barang_id || barang.id || barang.product_id} value={barang.barang_id || barang.id || barang.product_id}>
                                                {barang.nama_barang} - Stok: {barang.stok} {barang.satuan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label htmlFor="supplier_id" className="block text-gray-600 text-sm mb-2">
                                        Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="supplier_id"
                                        name="supplier_id"
                                        value={formData.supplier_id}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Pilih Supplier</option>
                                        {supplierList.map(supplier => (
                                            <option key={supplier.supplier_id || supplier.id} value={supplier.supplier_id || supplier.id}>
                                                {supplier.nama_supplier || supplier.nama || supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Jumlah Masuk */}
                                <div>
                                    <label htmlFor="jumlah_masuk" className="block text-gray-600 text-sm mb-2">
                                        Jumlah Masuk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="jumlah_masuk"
                                        name="jumlah_masuk"
                                        value={formData.jumlah_masuk}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan jumlah barang"
                                        min="1"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Tanggal Masuk */}
                                <div>
                                    <label htmlFor="tanggal_masuk" className="block text-gray-600 text-sm mb-2">
                                        Tanggal & Waktu Masuk (WIB) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            id="tanggal_masuk"
                                            name="tanggal_masuk"
                                            value={formData.tanggal_masuk}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                            required
                                            disabled={isLoading}
                                        />
                                        <FaCalendarAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Waktu Indonesia Barat (UTC+7)
                                    </p>
                                </div>

                                {/* Submit and Cancel Buttons */}
                                <div className="pt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-3/4 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isLoading ? "Menyimpan..." : "Simpan Barang Masuk"}
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
                
                {/* Breadcrumb Navigation */}
                
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
