import { checkEmailExistence } from "../services/api";  // Importowanie funkcji z api.js

export const checkPasswordStrength = (password) => {
  if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
    return "strong";
  } else if (password.length >= 6) {
    return "medium";
  } else {
    return "weak";
  }
};

export const validateStep = async (step, formData) => {
  const newErrors = {};

  if (step === 1) {
    // Walidacja emaila
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email address.";
    } else {
      const { exists, error } = await checkEmailExistence(formData.email);
      
      if (exists) {
        newErrors.email = error;  // Jeśli email już istnieje, wyświetlamy błąd
      } else if (error) {
        // Jeśli wystąpił błąd serwera, dodajemy ogólny komunikat
        newErrors.email = "Unable to check email. Please try again.";
      }
    }
  }

  if (step === 2) {
    // Walidacja imienia i nazwiska
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
  }

  if (step === 3) {
    // Walidacja hasła
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
  }

  return newErrors; // Zwracamy obiekt z błędami
};
