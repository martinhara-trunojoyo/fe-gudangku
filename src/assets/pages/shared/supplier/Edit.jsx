import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateSupplier, showSupplier } from "../../../_service/supplier";
import Swal from 'sweetalert2';

export default function SupplierEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        alamat: "",
        kontak: ""
    });
    const [originalData, setOriginalData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");

    // Load existing supplier data when component mounts
    useEffect(() => {
        const loadSupplierData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Authentication required. Please login again.");
                    navigate('/login');
                    return;
                }

                // Fetch current supplier data from API
                const response = await showSupplier(id);
                console.log("Loaded supplier data:", response);
                
                if (response) {
                    const supplierData = {
                        name: response.nama_supplier || "",
                        alamat: response.alamat_supplier || "",
                        kontak: response.kontak_supplier || ""
                    };
                    setFormData(supplierData);
                    setOriginalData(supplierData);
                } else {
                    setError("No supplier data found.");
                }
            } catch (error) {
                console.error("Error loading supplier data:", error);
                setError("Failed to load supplier data. Please try again.");
                
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
            loadSupplierData();
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

            // Prepare data for API
            const updateData = {
                name: formData.name,
                alamat: formData.alamat,
                kontak: formData.kontak
            };

            const response = await updateSupplier(id, updateData);
            console.log("Supplier updated successfully:", response);
            
            // Show success notification with SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data supplier berhasil diperbarui.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
            
            // Navigate back to supplier list
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.role === 'admin') {
                navigate("/admin/supplier");
            } else {
                navigate("/petugas/supplier");
            }
        } catch (error) {
            console.error("Update supplier error:", error);
            
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
                setError("Failed to update supplier. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.role === 'admin') {
            navigate("/admin/supplier");
        } else {
            navigate("/petugas/supplier");
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-gray-600">Loading supplier data...</p>
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

            {/* Floating Back Button */}
            

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Illustration */}
                        <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                <img 
                                    src="/img/illustration/img supplier.png" 
                                    alt="Edit Supplier Illustration"
                                    className="w-full"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                
                                {/* Fallback illustration */}
                                <div className="hidden">
                                    <svg className="w-full h-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Simple SVG illustration */}
                                        <rect x="120" y="100" width="160" height="120" rx="10" fill="white" stroke="#8B5CF6" strokeWidth="4"/>
                                        <path d="M140 150 L180 190 L260 110" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <div className="mt-8 text-center">
                                        <h3 className="text-white text-2xl font-bold mb-2">Edit Supplier</h3>
                                        <p className="text-white/80">Update informasi supplier</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-12">
                            <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
                                Edit Supplier
                            </h2>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Current Data Display */}
                            {originalData.name && !isLoadingData && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-3">Data Supplier Saat Ini:</h3>
                                    <div className="text-sm text-blue-700 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="font-medium">Nama Supplier:</span>
                                            <span className="text-right">{originalData.name}</span>
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
                                {/* Form fields */}
                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">
                                        Nama Supplier
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan nama supplier"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">
                                        Alamat
                                    </label>
                                    <textarea
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">
                                        Kontak
                                    </label>
                                    <input
                                        type="tel"
                                        name="kontak"
                                        value={formData.kontak}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="Masukkan nomor telepon"
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
            
            {/* Grid Pattern Styles */}
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
