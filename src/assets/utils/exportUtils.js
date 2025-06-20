// Simple CSV export functions for now (can be enhanced with libraries later)

// Format data for stock in report
export const formatStockInData = (reportData) => {
    return reportData.map((item, index) => ({
        no: index + 1,
        nama_barang: item.barang?.nama_barang || '-',
        kategori: item.barang?.kategori?.nama_kategori || '-',
        jumlah_masuk: item.jumlah_masuk,
        satuan: item.barang?.satuan || '',
        tanggal_masuk: new Date(item.tanggal_masuk).toLocaleDateString('id-ID'),
        supplier: item.supplier?.nama_supplier || '-',
        petugas: item.user?.name || '-'
    }));
};

// Format data for stock out report
export const formatStockOutData = (reportData) => {
    return reportData.map((item, index) => ({
        no: index + 1,
        nama_barang: item.barang?.nama_barang || '-',
        kategori: item.barang?.kategori?.nama_kategori || '-',
        jumlah_keluar: item.jumlah_keluar,
        satuan: item.barang?.satuan || '',
        tanggal_keluar: new Date(item.tanggal_keluar).toLocaleDateString('id-ID'),
        tujuan: item.tujuan || '-',
        petugas: item.user?.name || '-'
    }));
};

// Column definitions for reports
export const stockInColumns = [
    { key: 'no', title: 'No', width: 5 },
    { key: 'nama_barang', title: 'Nama Barang', width: 20 },
    { key: 'kategori', title: 'Kategori', width: 15 },
    { key: 'jumlah_masuk', title: 'Jumlah Masuk', width: 12 },
    { key: 'satuan', title: 'Satuan', width: 10 },
    { key: 'tanggal_masuk', title: 'Tanggal Masuk', width: 15 },
    { key: 'supplier', title: 'Supplier', width: 20 },
    { key: 'petugas', title: 'Petugas', width: 15 }
];

export const stockOutColumns = [
    { key: 'no', title: 'No', width: 5 },
    { key: 'nama_barang', title: 'Nama Barang', width: 20 },
    { key: 'kategori', title: 'Kategori', width: 15 },
    { key: 'jumlah_keluar', title: 'Jumlah Keluar', width: 12 },
    { key: 'satuan', title: 'Satuan', width: 10 },
    { key: 'tanggal_keluar', title: 'Tanggal Keluar', width: 15 },
    { key: 'tujuan', title: 'Tujuan', width: 20 },
    { key: 'petugas', title: 'Petugas', width: 15 }
];

// Simple CSV export functions (placeholder for now)
export const exportToPDF = (data, columns, title, filename = 'report.pdf') => {
    // For now, we'll just download as CSV until PDF libraries are installed
    exportToCSV(data, columns, filename.replace('.pdf', '.csv'));
    
    console.log('PDF export requested:', { data, columns, title, filename });
    alert('PDF export feature will be available soon. Downloaded as CSV instead.');
};

export const exportToExcel = (data, columns, title, filename = 'report.xlsx') => {
    // For now, we'll just download as CSV until Excel libraries are installed
    exportToCSV(data, columns, filename.replace('.xlsx', '.csv'));
    
    console.log('Excel export requested:', { data, columns, title, filename });
};

// CSV Export Functions
export const exportToCSV = (data, columns, filename = 'report.csv') => {
    // Prepare CSV content
    const headers = columns.map(col => col.title).join(',');
    const rows = data.map(item => 
        columns.map(col => {
            const value = item[col.key] || '';
            // Escape quotes and wrap in quotes if contains comma
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
        }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download file
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
