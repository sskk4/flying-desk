import axios from "axios";
import Swal from "sweetalert2";

// Funkcja do sprawdzania dostępności emaila
export const checkEmailExistence = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/auth/check-email/${email}`);
    if (response.status === 200) {
      return { exists: false };  // Email jest dostępny
    } else if (response.status === 400) {
      return { exists: true, error: "This email is already registered." };  // Email już istnieje
    } else if (response.status === 403) {
      return { exists: false, error: "Server error, please try again later." };  // Problem z serwerem
    }
  } catch (error) {
    console.error("Error during email existence check:", error);
    Swal.fire({
      icon: "error",
      title: "An Error Occurred",
      text: "Please check your internet connection or try again later.",
      confirmButtonText: "OK",
    });
    return { exists: false, error: "Unable to check email. Please try again." };  // Problem z połączeniem
  }
};

// Funkcja do rejestracji użytkownika
export const registerUser = async (formData) => {
  try {
    const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (response.status === 200) {
      return { success: true, message: "Registration Successful!" };
    } else {
      return { success: false, message: "Registration Failed. Please try again later." };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, message: "An error occurred during registration." };
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8080/api/v1/auth/authenticate", {
      email,
      password,
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return { success: false, error: "Invalid email or password." };
  }
};