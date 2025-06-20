import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBox, FaTruck, FaClipboardList, FaChartBar, FaUsers, FaTags, FaExclamationTriangle } from "react-icons/fa";
import { getBarang } from "../../../_service/barang";
import { getKategori } from "../../../_service/kategori";
import { getSupplier } from "../../../_service/supplier";
import { getStockInReport, getStockOutReport } from "../../../_service/laporan";

export default function Dashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalSupplier: 0,
        totalBarang: 0,
        totalKategori: 0,
        barangMasukHariIni: 0,
        barangKeluarHariIni: 0,
        lowStockItems: [],
        recentActivities: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = currentUser.name || currentUser.nama || 'User';
    const userRole = currentUser.role || 'petugas';

    // Dynamic menu items based on user role
    const getMenuItems = () => {
        const baseLink = userRole === 'admin' ? '/admin' : '/petugas';
        
        return [
            {
                title: "Supplier",
                icon: <FaUsers className="text-4xl mb-4" />,
                description: "Kelola data supplier",
                link: `${baseLink}/supplier`,
                color: "bg-blue-500"
            },
            {
                title: "Kategori",
                icon: <FaTags className="text-4xl mb-4" />,
                description: "Kelola kategori barang",
                link: `${baseLink}/kategori`,
                color: "bg-green-500"
            },
            {
                title: "Barang",
                icon: <FaBox className="text-4xl mb-4" />,
                description: "Kelola stok barang",
                link: `${baseLink}/barang`,
                color: "bg-purple-500"
            },
            {
                title: "Laporan Masuk",
                icon: <FaTruck className="text-4xl mb-4" />,
                description: "Laporan barang masuk",
                link: `${baseLink}/laporan/masuk`,
                color: "bg-yellow-500"
            },
            {
                title: "Laporan Keluar",
                icon: <FaClipboardList className="text-4xl mb-4" />,
                description: "Laporan barang keluar",
                link: `${baseLink}/laporan/keluar`,
                color: "bg-red-500"
            },
            {
                title: "Summary",
                icon: <FaChartBar className="text-4xl mb-4" />,
                description: "Ringkasan laporan",
                link: `${baseLink}/laporan/summary`,
                color: "bg-indigo-500"
            }
        ];
    };

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

                await loadDashboardData();
            } catch (error) {
                console.error("Error checking auth:", error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            setError("");

            // Get today's date for filtering
            const today = new Date().toISOString().split('T')[0];

            // Fetch all data in parallel
            const [
                barangData,
                kategoriData,
                supplierData,
                stockInToday,
                stockOutToday
            ] = await Promise.all([
                getBarang().catch(() => []),
                getKategori().catch(() => []),
                getSupplier().catch(() => []),
                getStockInReport({ 
                    start_date: today, 
                    end_date: today,
                    per_page: 1000 
                }).catch(() => ({ data: { data: [] }, summary: {} })),
                getStockOutReport({ 
                    start_date: today, 
                    end_date: today,
                    per_page: 1000 
                }).catch(() => ({ data: { data: [] }, summary: {} }))
            ]);

            // Calculate low stock items
            const lowStockItems = barangData.filter(item => 
                item.stok <= item.batas_minimum
            );

            // Update dashboard data
            setDashboardData({
                totalSupplier: supplierData.length,
                totalBarang: barangData.length,
                totalKategori: kategoriData.length,
                barangMasukHariIni: stockInToday.summary?.total_quantity || 0,
                barangKeluarHariIni: stockOutToday.summary?.total_quantity || 0,
                lowStockItems: lowStockItems.slice(0, 5), // Show only first 5
                recentActivities: [
                    ...(stockInToday.data?.data || []).slice(0, 3).map(item => ({
                        type: 'in',
                        message: `${item.jumlah_masuk} ${item.barang?.nama_barang} masuk dari ${item.supplier?.nama_supplier}`,
                        time: new Date(item.tanggal_masuk).toLocaleTimeString('id-ID')
                    })),
                    ...(stockOutToday.data?.data || []).slice(0, 3).map(item => ({
                        type: 'out',
                        message: `${item.jumlah_keluar} ${item.barang?.nama_barang} keluar ke ${item.tujuan}`,
                        time: new Date(item.tanggal_keluar).toLocaleTimeString('id-ID')
                    }))
                ].slice(0, 5)
            });

        } catch (error) {
            console.error("Error loading dashboard data:", error);
            setError("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 pt-20 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Large Gradient Circles */}
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300/30 to-blue-300/20 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-300/20 to-pink-300/20 blur-3xl"></div>
                
                {/* Floating Geometric Shapes */}
                <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-200/30 rounded-lg rotate-12 animate-float-slow"></div>
                <div className="absolute bottom-1/3 right-10 w-16 h-16 bg-purple-200/30 rounded-full animate-float-medium"></div>
                <div className="absolute top-2/3 left-1/3 w-12 h-12 bg-indigo-200/30 rounded-lg -rotate-12 animate-float-fast"></div>
                
                {/* Abstract Wave */}
                <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#8B5CF6" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,138.7C672,149,768,203,864,202.7C960,203,1056,149,1152,133.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                
                {/* Dot Grid Pattern */}
                <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
            </div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                {/* Header with Animation */}
                <div className="mb-10 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 relative">
                        Selamat Datang, {userName}! 👋
                        <span className="absolute -bottom-1 left-0 w-20 h-1 bg-purple-500 rounded"></span>
                    </h1>
                    <p className="text-gray-600">Dashboard {userRole === 'admin' ? 'Admin' : 'Petugas'} Gudang</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Quick Stats with Real Data */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-100/50 hover:shadow-md transition-all">
                        <h4 className="text-gray-600 text-sm font-medium">Total Supplier</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{dashboardData.totalSupplier}</p>
                        <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-100/50 hover:shadow-md transition-all">
                        <h4 className="text-gray-600 text-sm font-medium">Total Kategori</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{dashboardData.totalKategori}</p>
                        <div className="h-1 w-12 bg-green-500 mt-2 rounded-full"></div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-100/50 hover:shadow-md transition-all">
                        <h4 className="text-gray-600 text-sm font-medium">Total Barang</h4>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{dashboardData.totalBarang}</p>
                        <div className="h-1 w-12 bg-purple-500 mt-2 rounded-full"></div>
                    </div>
                   
                </div>

                {/* Menu Grid with Hover Effects */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6 animate-fade-up mb-8">
                    {getMenuItems().map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100/50"
                        >
                            <div className={`${item.color} text-white p-4 rounded-lg inline-block mb-4 shadow-md`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Low Stock Alert & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up-delay">
                    {/* Low Stock Items */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100/50">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-red-500 text-xl mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Stok Menipis</h3>
                        </div>
                        {dashboardData.lowStockItems.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.lowStockItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.nama_barang}</p>
                                            <p className="text-sm text-gray-600">Kategori: {item.kategori?.nama_kategori || '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-red-600 font-bold">{item.stok} {item.satuan}</p>
                                            <p className="text-xs text-gray-500">Min: {item.batas_minimum}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link 
                                    to={`/${userRole}/barang`}
                                    className="block text-center text-purple-600 text-sm font-medium hover:text-purple-800 transition-colors"
                                >
                                    Lihat Semua Barang →
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Semua barang stoknya aman</p>
                        )}
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100/50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Hari Ini</h3>
                        {dashboardData.recentActivities.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                            activity.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link 
                                    to={`/${userRole}/laporan/masuk`}
                                    className="block text-center text-purple-600 text-sm font-medium hover:text-purple-800 transition-colors mt-4"
                                >
                                    Lihat Semua Aktivitas →
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Tidak ada aktivitas hari ini</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}       