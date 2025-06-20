import { API } from "../_api";

export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Get Dashboard Stats error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching dashboard statistics.";
  }
};

export const getRecentActivities = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/dashboard/activities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Get Recent Activities error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching recent activities.";
  }
};

export const getLowStockItems = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/dashboard/low-stock", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Get Low Stock Items error:", error);
    throw error.response ? error.response.data : "An error occurred while fetching low stock items.";
  }
};
