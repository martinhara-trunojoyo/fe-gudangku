import { API } from "../_api";

export const getBarang = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    console.log("Get Barang error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching Barang data.";
  }
};

export const createBarang = async (barangData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Ensure kategori_id is properly formatted and is a valid number
    const kategoriId = parseInt(barangData.kategori_id);
    
    if (isNaN(kategoriId) || kategoriId <= 0) {
      console.error("Invalid kategori_id:", barangData.kategori_id);
      throw new Error("Invalid kategori_id - must be a valid number");
    }
    
    const formattedData = {
      nama_barang: barangData.nama_barang,
      kategori_id: kategoriId, // This will be the numeric kategori_id from the selected option
      satuan: barangData.satuan,
      stok: parseInt(barangData.stok),
      batas_minimum: parseInt(barangData.batas_minimum)
    };
    
    console.log("=== SERVICE LAYER DEBUG ===");
    console.log("Original barang data:", barangData);
    console.log("Parsed kategori_id:", kategoriId);
    console.log("Final formatted data:", formattedData);
    console.log("kategori_id type:", typeof formattedData.kategori_id);
    console.log("kategori_id value:", formattedData.kategori_id);
    console.log("==========================");
    
    const response = await API.post("/products", formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.log("Create Barang error:", error);
    throw error.response ? error.response.data : error;
  }
};

export const showBarang = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Show Barang error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching Barang details.";
  }
};

export const updateBarang = async (id, barangData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.put(`/products/${id}`, barangData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Update Barang error:", error);
    throw error.response ? error.response.data : "An error occurred while updating Barang.";
  }
};

export const deleteBarang = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await API.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("Delete Barang error:", error);
    throw error.response ? error.response.data : "An error occurred while deleting Barang.";
  }
};