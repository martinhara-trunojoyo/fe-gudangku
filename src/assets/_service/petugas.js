import { API } from "../_api";

export const getPetugas = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/petugas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } catch (error) {
    console.log("Get petugas error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching petugas data.";
  }
};

export const createPetugas = async (data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.post("/petugas", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.log("Create petugas error:", error);
        throw error.response ? error.response.data : "An error occurred while creating petugas.";
    }
};

export const showPetugas = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/petugas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
    } catch (error) {
        console.log("Show petugas error:", error);
        throw error.response ? error.response.data : "An error occurred while fetching petugas details.";
    }
};

export const updatePetugas = async (id, data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.put(`/petugas/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.log("Update petugas error:", error);
        throw error.response ? error.response.data : "An error occurred while updating petugas.";
    }
};

export const deletePetugas = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await API.delete(`/petugas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    } catch (error) {
        console.log("Delete petugas error:", error);
        throw error.response ? error.response.data : "An error occurred while deleting petugas.";
    }
};