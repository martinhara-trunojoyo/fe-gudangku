import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaMinus } from "react-icons/fa";
import Swal from 'sweetalert2';
import { getBarang, deleteBarang } from "../../../_service/barang";

export default function BarangIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [barangList, setBarangList] = useState([]); 
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  const loadBarangData = async () => {
    try {
      setIsLoading(true);
      const data = await getBarang();
      console.log("=== BARANG DATA DEBUG ===");
      console.log("Raw barang data:", data);
      if (data.length > 0) {
        console.log("Sample barang structure:", data[0]);
        console.log("Barang ID field:", data[0]?.barang_id || data[0]?.id || data[0]?.product_id);
      }
      console.log("========================");
      setBarangList(data);
      setFilteredBarang(data);
      setError("");
    } catch (error) {
      console.error("Error loading barang:", error);
      setError("Failed to load barang data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !userData || !userData.role) {
          navigate("/login");
          return;
        }

        // Set user name
        if (userData.name) {
          setUserName(userData.name);
        }

        // Load barang data
        await loadBarangData();
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/login");
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  useEffect(() => {
    const filtered = barangList.filter(barang =>
      barang.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kategori?.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBarang(filtered);
  }, [searchTerm, barangList]);

  const handleEdit = (barang) => {
    const barangId = barang.barang_id || barang.id || barang.product_id;
    console.log("Edit button clicked for barang:", barang);
    console.log("Barang ID:", barangId);
    navigate(`/admin/barang/edit/${barangId}`);
  };

  const handleDelete = async (barang) => {
    const barangId = barang.barang_id || barang.id || barang.product_id;
    const barangName = barang.nama_barang || 'barang ini';
    
    try {
      const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: `Anda akan menghapus barang "${barangName}". Tindakan ini tidak dapat dibatalkan!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        // Show loading
        
        await deleteBarang(barangId);
        await loadBarangData(); // Reload data after deletion
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Barang "${barangName}" berhasil dihapus.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#7C3AED'
        });
      }
    } catch (error) {
      console.error("Error deleting barang:", error);
      
      // Show error message
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus barang. Silakan coba lagi.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#7C3AED'
      });
    }
  };

  if (isLoading) {
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
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#8B5CF6"
            fillOpacity="0.5"
            d="M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
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

        {/* Barang Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-8">BARANG</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Add Button */}
            <Link
              to="/admin/barang/tambah"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <FaPlus className="text-sm" />
              <span>Tambah Barang</span>
            </Link>

            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search Barang"
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
                  <th className="py-3 px-4 text-left">Nama Barang</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Satuan</th>
                  <th className="py-3 px-4 text-left">Stok</th>
                  <th className="py-3 px-4 text-left">Batas Minimum</th>
                  <th className="py-3 px-4 text-center">Manajemen Stok</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBarang.length > 0 ? (
                  filteredBarang.map((barang, index) => (
                    <tr key={barang.barang_id || barang.id || barang.product_id || index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{barang.nama_barang}</td>
                      <td className="py-3 px-4">{barang.kategori?.nama_kategori || '-'}</td>
                      <td className="py-3 px-4">{barang.satuan}</td>
                      <td className="py-3 px-4">{barang.stok}</td>
                      <td className="py-3 px-4">{barang.batas_minimum}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Link to={`/admin/barang/masuk/${barang.barang_id || barang.id || barang.product_id}`} className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition">
                            <FaPlus className="text-sm" />
                            <span className="text-sm">Barang Masuk</span>
                          </Link>
                          <Link to={`/admin/barang/keluar/${barang.barang_id || barang.id || barang.product_id}`} className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                            <FaMinus className="text-sm" />
                            <span className="text-sm">Barang Keluar</span>
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(barang)}
                            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                          >
                            <FaEdit className="text-sm" />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(barang)}
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
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      {searchTerm ? 'No barang found matching your search.' : 'No barang data available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredBarang.length} entries
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded bg-purple-500 text-white"
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add a style tag for the grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(107, 33, 168, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(107, 33, 168, 0.1) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
