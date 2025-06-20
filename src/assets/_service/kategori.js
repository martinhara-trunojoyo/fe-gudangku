import { API } from "../_api";

export const getKategori = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    console.log("Get Kategori error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching Kategori data.";
  }
};

export const createKategori = async (kategoriData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.post("/categories", {
          nama_kategori: kategoriData.nama_kategori,
          deskripsi: kategoriData.deskripsi,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
      console.log("Full error response:", error.response);
        throw error.response ? error.response.data : "An error occurred while creating Kategori.";
    }
};

export const showKategori = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
    } catch (error) {
        console.log("Show Kategori error:", error);
        throw error.response ? error.response.data : "An error occurred while fetching Katageri details.";
    }
};

export const updateKategori = async (id, kategoriData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.put(`/categories/${id}`, {
            nama_kategori: kategoriData.nama_kategori,
            deskripsi: kategoriData.deskripsi,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.log("Update Kategori error:", error);
        throw error.response ? error.response.data : "An error occurred while updating Kategori.";
    }
};

export const deleteKategori = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await API.delete(`/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    } catch (error) {
        console.log("Delete Kategori error:", error);
        throw error.response ? error.response.data : "An error occurred while deleting kategori.";
    }
};