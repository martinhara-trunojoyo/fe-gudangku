import { API } from "../_api";

export const createUmkm = async ({ nama_umkm, pemilik, alamat, kontak }, token) => {
  try {
    const { data } = await API.post(
      "/umkm", // Pastikan endpoint ini sesuai dengan route backend Laravel-mu
      { nama_umkm, pemilik, alamat, kontak },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Create UMKM error:", error);
    throw error.response ? error.response.data : "An error occurred while creating UMKM.";
  }
};

export const updateUmkm = async (updateData, token) => {
  try {
    const { data } = await API.put(
      "/umkm", // Pastikan route ini sesuai dengan route Laravel-mu
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Update UMKM error:", error);
    throw error.response ? error.response.data : "An error occurred while updating UMKM.";
  }
};

export const getMyUmkm = async (token) => {
  try {
    const { data } = await API.get("/umkm", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Get my UMKM error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching UMKM data.";
  }
};

