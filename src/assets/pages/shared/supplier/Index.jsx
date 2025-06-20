import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { getSupplier, deleteSupplier } from "../../../_service/supplier";
import Swal from 'sweetalert2';

export default function SupplierIndex() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [supplierList, setSupplierList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("User");
    const navigate = useNavigate();

    // Load user name and supplier data
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                // Check authentication
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token || !userData || !userData.role) {
                    navigate('/login');
                    return;
                }

                // Set user name
                if (userData.name) {
                    setUserName(userData.name);
                }

                // Load supplier data
                await loadSupplierData();
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const loadSupplierData = async () => {
        try {
            setIsLoading(true);
            setError("");
            
            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const data = await getSupplier();
            setSupplierList(data || []);
        } catch (error) {
            console.error("Error loading supplier data:", error);
            
            // Handle authentication errors
            if (error.message === "Unauthenticated." || error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            setError("Failed to load supplier data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus supplier ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await deleteSupplier(id);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Supplier berhasil dihapus.',
                    confirmButtonColor: '#7C3AED'
                });

                await loadSupplierData();
            } catch (error) {
                console.error("Error deleting supplier:", error);
                
                // Handle authentication errors
                if (error.message === "Unauthenticated." || error.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
                
                await Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal menghapus supplier. Silakan coba lagi.',
                    confirmButtonColor: '#7C3AED'
                });
            }
        }
    };

    // Filter supplier based on search term
    const filteredSupplier = supplierList.filter(supplier =>
        supplier.nama_supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.alamat_supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.kontak_supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredSupplier.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSupplier = filteredSupplier.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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

            <div className="container mx-auto px-6 py-8 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Hello, {userName}! 👋
                    </h1>
                </div>

                {/* Supplier Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-8">SUPPLIER</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}
                    
                    {/* Actions Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        {/* Add Button */}
                        <Link
                            to="tambah"
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            <FaPlus className="text-sm" />
                            <span>Add Data Supplier</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search Supplier"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#4A5568] text-white">
                                    <th className="py-3 px-4 text-left">No</th>
                                    <th className="py-3 px-4 text-left">Nama Supplier</th>
                                    <th className="py-3 px-4 text-left">Kontak</th>
                                    <th className="py-3 px-4 text-left">Alamat</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSupplier.length > 0 ? (
                                    currentSupplier.map((supplier, index) => (
                                        <tr key={supplier.supplier_id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4">{supplier.nama_supplier || '-'}</td>
                                            <td className="py-3 px-4">{supplier.kontak_supplier || '-'}</td>
                                            <td className="py-3 px-4 max-w-xs truncate" title={supplier.alamat_supplier}>
                                                {supplier.alamat_supplier || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(supplier.supplier_id)}
                                                        className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                                    >
                                                        <FaEdit className="text-sm" />
                                                        <span className="text-sm">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(supplier.supplier_id)}
                                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                        <span className="text-sm">Hapus</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            {filteredSupplier.length === 0 && searchTerm ? 
                                                "Tidak ada supplier yang ditemukan" : 
                                                "Belum ada data supplier"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredSupplier.length > 0 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredSupplier.length)} of {filteredSupplier.length} entries
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === page 
                                                ? 'bg-purple-500 text-white' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Add a style tag for the grid pattern */}
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