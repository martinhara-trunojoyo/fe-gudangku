import { API } from "../_api";

export const login = async (email, password) => {
  try {
    const {data}= await API.post("/login", { email, password });
    return data;
  } catch (error) {
    console.log("Login error:", error);
    throw error.response ? error.response.data : "An error occurred during login.";
  }
}

export const register = async ({ name, username, email, password, umkm_id = null }) => {
  try {
    const { data } = await API.post("/register", { name, username, email, password, umkm_id });
    return data;
  } catch (error) {
    console.log("Register error:", error);
    throw error.response ? error.response.data : "An error occurred during registration.";
  }
}

export const forgotPassword = async (email) => {
  try {
    const { data } = await API.post("/forgot-password", { email });
    return data;
  } catch (error) {
    console.log("Forgot password error:", error);
    throw error.response ? error.response.data : "An error occurred during forgot password process.";
  }
};

export const useDecodeToken = (token) => {
    const { decodedToken, isExpired } = useJwt(token);
    try {
        if (isExpired) {
            return {
                success: false,
                message: "Token has expired",
                data: null         
            };
        }
        return {
            success: true,
            message: "Token is valid",
            data: decodedToken
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return {
            success: false,
            message: "Failed to decode token",
            data: null
        };
    }
}


export const resetPassword = async ({ token, email, password, password_confirmation }) => {
  try {
    const { data } = await API.post("/reset-password", {
      token,
      email,
      password,
      password_confirmation,
    });
    return data;
  } catch (error) {
    console.log("Reset password error:", error);
    throw error.response ? error.response.data : "An error occurred during password reset.";
  }
};

export const validateToken = async (token) => {
  try {
    const { data } = await API.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Token validation error:", error);
    throw error.response ? error.response.data : "Token validation failed.";
  }
};

export const checkAuthStatus = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !userData || !userData.role) {
      return { isAuthenticated: false, user: null, token: null };
    }
    
    return { isAuthenticated: true, user: userData, token };
  } catch (error) {
    console.error("Error checking auth status:", error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { isAuthenticated: false, user: null, token: null };
  }
};



