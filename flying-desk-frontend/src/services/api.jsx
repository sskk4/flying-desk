
import axios from "./axiosConfig";

export const useApi = () => {
  const checkEmail = async (email) => {
    console.log("Checking email:", email);
    try {
      const response = await axios.get(`/auth/check-email/${email}`);
      console.log("Email check response:", response);
      return { exists: response.data?.message === "Email is already taken" };
    } catch (error) {
      console.error("Error during email check:", error);
      if (error.response?.status === 400) {
        return { exists: true };
      }
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post("/auth/pw/change", {
        currentPassword,
        newPassword,
      });
      return response.data; 
    } catch (error) {
      throw error.response?.data?.message || "Failed to change password.";
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
      return response.data; 
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const activate = async (token) => {
    console.log("Activating email with token:", token);
    try {
      const response = await axios.get(`/auth/activate/${token}`);
      if (response.status === 200) {
        console.log("Email activation successful");
        return response.data;
      }
      throw new Error(`Unexpected response: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.error(
          `Activation failed with status: ${error.response.status}`,
          error.response.data
        );
      } else {
        console.error("Error during email activation:", error);
      }
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post("/auth/pw/recovery", { email });
      return response.data;
    } catch (error) {
      console.error("Password recovery request failed:", error);
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`/auth/pw/recovery/${token}`, { password });
      return response.data;
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  };

  return { 
    checkEmail, 
    register, 
    authenticate, 
    activate, 
    changePassword,
    forgotPassword,
    resetPassword
  };
};

export default useApi;