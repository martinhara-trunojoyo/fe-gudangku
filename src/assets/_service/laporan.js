import { API } from "../_api";

export const getStockInReport = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/reports/stock-in", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return data;
  } catch (error) {
    console.log("Get Stock In Report error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock in report.";
  }
};

export const getStockOutReport = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/reports/stock-out", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return data;
  } catch (error) {
    console.log("Get Stock Out Report error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock out report.";
  }
};

export const getStockSummary = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/reports/stock-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return data;
  } catch (error) {
    console.log("Get Stock Summary error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock summary.";
  }
};

export const exportStockIn = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    // Get all data without pagination for export
    const exportParams = {
      ...params,
      per_page: 100, // Get more data for export
      page: 1
    };
    
    const { data } = await API.get("/reports/stock-in", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: exportParams
    });
    
    return {
      status: 'success',
      data: data.data.data || data.data, // Handle nested data structure
      summary: data.summary,
      filename: `laporan_barang_masuk_${new Date().toISOString().slice(0, 10)}.xlsx`
    };
  } catch (error) {
    console.log("Export Stock In error:", error);
    throw error.response ? error.response.data : "An error occurred while exporting stock in report.";
  }
};

export const exportStockOut = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    // Get all data without pagination for export
    const exportParams = {
      ...params,
      per_page: 100, // Get more data for export
      page: 1
    };
    
    const { data } = await API.get("/reports/stock-out", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: exportParams
    });
    
    return {
      status: 'success',
      data: data.data.data || data.data, // Handle nested data structure
      summary: data.summary,
      filename: `laporan_barang_keluar_${new Date().toISOString().slice(0, 10)}.xlsx`
    };
  } catch (error) {
    console.log("Export Stock Out error:", error);
    throw error.response ? error.response.data : "An error occurred while exporting stock out report.";
  }
};
