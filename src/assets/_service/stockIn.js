import { API } from "../_api";

export const getStockIn = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/stock-in", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    console.log("Get Stock In error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock in data.";
  }
};

export const createStockIn = async (stockInData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Ensure all fields are properly formatted
    const formattedData = {
      jumlah_masuk: parseInt(stockInData.jumlah_masuk),
      tanggal_masuk: stockInData.tanggal_masuk, // Already formatted as "YYYY-MM-DD HH:mm:ss"
      supplier_id: parseInt(stockInData.supplier_id),
      barang_id: parseInt(stockInData.barang_id)
    };
    
    console.log("=== STOCK IN SERVICE DEBUG ===");
    console.log("Original data:", stockInData);
    console.log("Formatted data for API:", formattedData);
    console.log("Datetime format:", formattedData.tanggal_masuk);
    console.log("=============================");
    
    const response = await API.post("/stock-in", formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.log("Create Stock In error:", error);
    throw error.response ? error.response.data : error;
  }
};

export const showStockIn = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/stock-in/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Show Stock In error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching stock in details.";
  }
};

export const updateStockIn = async (id, stockInData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.put(`/stock-in/${id}`, stockInData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Update Stock In error:", error);
    throw error.response ? error.response.data : "An error occurred while updating stock in.";
  }
};

export const deleteStockIn = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await API.delete(`/stock-in/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("Delete Stock In error:", error);
    throw error.response ? error.response.data : "An error occurred while deleting stock in.";
  }
};
