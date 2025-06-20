import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { getPetugas, deletePetugas } from "../../../_service/petugas";
import Swal from 'sweetalert2';

export default function PetugasIndex() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [petugasList, setPetugasList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminName, setAdminName] = useState("Admin");
    const navigate = useNavigate();

    // Load admin name and petugas data
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                // Check authentication
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token || !userData || userData.role !== 'admin') {
                    navigate('/login');
                    return;
                }

                // Set admin name
                if (userData.name) {
                    setAdminName(userData.name);
                }

                // Load petugas data
                await loadPetugasData();
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const loadPetugasData = async () => {
        try {
            setIsLoading(true);
            setError("");
            
            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const data = await getPetugas();
            setPetugasList(data || []);
        } catch (error) {
            console.error("Error loading petugas data:", error);
            
            // Handle authentication errors
            if (error.message === "Unauthenticated." || error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            setError("Failed to load petugas data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/petugas/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus petugas ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await deletePetugas(id);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Petugas berhasil dihapus.',
                    confirmButtonColor: '#7C3AED'
                });

                await loadPetugasData();
            } catch (error) {
                console.error("Error deleting petugas:", error);
                
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
                    text: 'Gagal menghapus petugas. Silakan coba lagi.',
                    confirmButtonColor: '#7C3AED'
                });
            }
        }
    };

    // Filter petugas based on search term
    const filteredPetugas = petugasList.filter(petugas =>
        petugas.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        petugas.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredPetugas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPetugas = filteredPetugas.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading petugas data...</p>
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
                        Hello, {adminName}! 👋
                    </h1>
                </div>

                {/* Petugas Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-8">PETUGAS</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}
                    
                    {/* Actions Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        {/* Add Button */}
                        <Link
                            to="/admin/petugas/tambah"
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            <FaPlus className="text-sm" />
                            <span>Tambah Petugas</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search Petugas"
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
                                    <th className="py-3 px-4 text-left">Nama Petugas</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Username</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPetugas.length > 0 ? (
                                    currentPetugas.map((petugas, index) => (
                                        <tr key={petugas.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4">{petugas.name || '-'}</td>
                                            <td className="py-3 px-4">{petugas.email || '-'}</td>
                                            <td className="py-3 px-4">{petugas.username || '-'}</td>
                                            
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(petugas.id)}
                                                        className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                                    >
                                                        <FaEdit className="text-sm" />
                                                        <span className="text-sm">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(petugas.id)}
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
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            {filteredPetugas.length === 0 && searchTerm ? 
                                                "Tidak ada petugas yang ditemukan" : 
                                                "Belum ada data petugas"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredPetugas.length > 0 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredPetugas.length)} of {filteredPetugas.length} entries
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
