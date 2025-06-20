import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilePdf, FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { getStockOutReport, exportStockOut } from "../../../_service/laporan";
import { 
    exportToPDF, 
    exportToExcel, 
    formatStockOutData, 
    stockOutColumns 
} from "../../../utils/exportUtils";

export default function BarangKeluar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [reportData, setReportData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [summary, setSummary] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });

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
        loadReportData();
    }, [navigate, currentPage]);

    const loadReportData = async () => {
        try {
            setIsLoading(true);
            const params = {
                page: currentPage,
                per_page: 10,
                search: searchTerm || undefined,
                start_date: dateRange.startDate || undefined,
                end_date: dateRange.endDate || undefined
            };

            const response = await getStockOutReport(params);
            console.log("Stock Out Report Response:", response);
            
            if (response.status === 'success') {
                setReportData(response.data.data || []);
                setPagination({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total
                });
                setSummary(response.summary || {});
            }
        } catch (error) {
            console.error("Error loading report data:", error);
            setError("Failed to load report data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateRangeChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const handleFilter = () => {
        setCurrentPage(1);
        loadReportData();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setCurrentPage(1);
            loadReportData();
        }
    };

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        loadReportData();
    };

    const handleExportPDF = async () => {
        try {
            const params = {
                search: searchTerm || undefined,
                start_date: dateRange.startDate || undefined,
                end_date: dateRange.endDate || undefined
            };

            const response = await exportStockOut(params);
            
            if (response.status === 'success') {
                const formattedData = formatStockOutData(response.data);
                const title = `LAPORAN BARANG KELUAR${dateRange.startDate && dateRange.endDate 
                    ? `\nPeriode: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                    : ''
                }`;
                
                exportToPDF(
                    formattedData, 
                    stockOutColumns, 
                    title,
                    `laporan_barang_keluar_${new Date().toISOString().slice(0, 10)}.pdf`
                );
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Export PDF Berhasil!',
                    text: 'Laporan berhasil diexport ke PDF.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7C3AED'
                });
            }
        } catch (error) {
            console.error("Export PDF error:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Export PDF Gagal!',
                text: 'Terjadi kesalahan saat export PDF.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
        }
    };

    const handleExportExcel = async () => {
        try {
            const params = {
                search: searchTerm || undefined,
                start_date: dateRange.startDate || undefined,
                end_date: dateRange.endDate || undefined
            };

            const response = await exportStockOut(params);
            
            if (response.status === 'success') {
                const formattedData = formatStockOutData(response.data);
                const title = `LAPORAN BARANG KELUAR${dateRange.startDate && dateRange.endDate 
                    ? ` - Periode: ${formatDate(dateRange.startDate)} s/d ${formatDate(dateRange.endDate)}`
                    : ''
                }`;
                
                exportToExcel(
                    formattedData, 
                    stockOutColumns, 
                    title,
                    response.filename || `laporan_barang_keluar_${new Date().toISOString().slice(0, 10)}.xlsx`
                );
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Export Excel Berhasil!',
                    text: 'Laporan berhasil diexport ke Excel.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#7C3AED'
                });
            }
        } catch (error) {
            console.error("Export Excel error:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Export Excel Gagal!',
                text: 'Terjadi kesalahan saat export Excel.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#7C3AED'
            });
        }
    };

    const convertToCSV = (data) => {
        const headers = ['No', 'Nama Barang', 'Jumlah Keluar', 'Tanggal Keluar', 'Tujuan'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.no,
                `"${row.nama_barang}"`,
                row.jumlah_keluar,
                row.tanggal_keluar,
                `"${row.tujuan}"`
            ].join(','))
        ].join('\n');
        
        return csvContent;
    };

    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading report data...</p>
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
                        Laporan Barang Keluar
                    </h1>
                    <p className="text-gray-600">Lihat history barang yang keluar dari inventory</p>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Transaksi</h3>
                            <p className="text-2xl font-bold text-red-600">{summary.total_transactions || 0}</p>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Barang Keluar</h3>
                            <p className="text-2xl font-bold text-orange-600">{summary.total_quantity || 0}</p>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium text-gray-500">Periode</h3>
                            <p className="text-sm text-gray-700">
                                {dateRange.startDate && dateRange.endDate
                                    ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                                    : "Semua Data"
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-8">HISTORY BARANG KELUAR</h2>
                    
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    {/* Actions Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        {/* Date Range Filter */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate}
                                    onChange={handleDateRangeChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <span className="self-center">to</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateRangeChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <button 
                                onClick={handleFilter}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Filter
                            </button>
                        </div>

                        {/* Export Buttons & Search */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            {/* <button 
                                onClick={handleExportPDF}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                <FaFilePdf />
                                <span>Export PDF</span>
                            </button> */}
                            <button 
                                onClick={handleExportExcel}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                <FaFileExcel />
                                <span>Export Excel</span>
                            </button>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#4A5568] text-white">
                                    <th className="py-3 px-4 text-left">No</th>
                                    <th className="py-3 px-4 text-left">Nama Barang</th>
                                    <th className="py-3 px-4 text-left">Jumlah Keluar</th>
                                    <th className="py-3 px-4 text-left">Tanggal</th>
                                    <th className="py-3 px-4 text-left">Tujuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.length > 0 ? (
                                    reportData.map((item, index) => (
                                        <tr key={item.id || index} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{((currentPage - 1) * (pagination.per_page || 10)) + index + 1}</td>
                                            <td className="py-3 px-4">{item.barang?.nama_barang || '-'}</td>
                                            <td className="py-3 px-4">{item.jumlah_keluar} {item.barang?.satuan || ''}</td>
                                            <td className="py-3 px-4">{formatDate(item.tanggal_keluar)}</td>
                                            <td className="py-3 px-4">{item.tujuan || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            {searchTerm || dateRange.startDate || dateRange.endDate 
                                                ? 'No data found matching your criteria.' 
                                                : 'No stock out data available.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {reportData.length} of {pagination.total || 0} entries
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &lt;
                            </button>
                            <button className="px-3 py-1 rounded bg-purple-500 text-white">
                                {currentPage}
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(pagination.last_page || 1, currentPage + 1))}
                                disabled={currentPage === (pagination.last_page || 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &gt;
                            </button>
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