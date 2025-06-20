import { API } from "../_api";

export const getStockOut = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/stock-out", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    console.log("Get Stock Out error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock out data.";
  }
};

export const createStockOut = async (stockOutData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Ensure all fields are properly formatted
    const formattedData = {
      jumlah_keluar: parseInt(stockOutData.jumlah_keluar),
      tujuan: stockOutData.tujuan,
      barang_id: parseInt(stockOutData.barang_id),
      tanggal_keluar: stockOutData.tanggal_keluar // Add datetime field
    };
    
    console.log("=== STOCK OUT SERVICE DEBUG ===");
    console.log("Original data:", stockOutData);
    console.log("Formatted data:", formattedData);
    console.log("Datetime format:", formattedData.tanggal_keluar);
    console.log("==============================");
    
    const response = await API.post("/stock-out", formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.log("Create Stock Out error:", error);
    throw error.response ? error.response.data : error;
  }
};

export const showStockOut = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/stock-out/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Show Stock Out error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock out details.";
  }
};

export const updateStockOut = async (id, stockOutData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.put(`/stock-out/${id}`, stockOutData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Update Stock Out error:", error);
    throw error.response ? error.response.data : "An error occurred while updating stock out.";
  }
};

export const deleteStockOut = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await API.delete(`/stock-out/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("Delete Stock Out error:", error);
    throw error.response ? error.response.data : "An error occurred while deleting stock out.";
  }
};
