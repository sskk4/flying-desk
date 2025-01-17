import axios from "./axiosConfig";

export const useApi = () => {
  const checkEmail = async (email) => {
    console.log("Checking email:", email);
    try {
      const response = await axios.get(`/auth/check-email/${email}`);
      console.log("Email check response:", response);
      return response.status === 200 ? { exists: false } : { exists: true };
    } catch (error) {
      console.error("Error during email check:", error);
      throw error;
    }
  };

  const register = async (formData) => {
    console.log("Registering user with data:", formData);
    try {
      const response = await axios.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Registration response:", response);
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.status === 400 || error.response?.status === 403) {
        throw new Error(error.response.data?.message || "Registration failed.");
      }
      throw error;
    }
  };


  const authenticate = async (email, password) => {
    try {
      const response = await axios.post(`/auth/authenticate`, { email, password });
      return response.data; // Zwraca accessToken, refreshToken
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };


  const activate = async (token) => {
    console.log("Activating email with token:", token);
    try {
      const response = await axios.get(`/auth/activate/${token}`);
      console.log("Email activation response:", response);
      return response.data;
    } catch (error) {
      console.error("Error during email activation:", error);
      throw error;
    }
  };

  return { checkEmail, register, authenticate, activate };
};
