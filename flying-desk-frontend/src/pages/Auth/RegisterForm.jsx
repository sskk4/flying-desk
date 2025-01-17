import React, { useState } from "react";
import FormField from "./AuthFormField";
import { useApi } from "../../services/api"; 
import { checkPasswordStrength } from "../../utils/formValidation";

const validateStep = (step, data, errors) => {
  if (step === 1) {
    if (!data.email.includes("@")) {
      errors.email = "Invalid email address.";
    } else if (errors.email === "Email already exists.") {
      errors.email = "Email already exists.";
    }
  } else if (step === 2) {
    if (!data.firstname.trim()) {
      errors.firstname = "First name is required.";
    }
    if (!data.lastname.trim()) {
      errors.lastname = "Last name is required.";
    }
  } else if (step === 3) {
    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }
  return errors;
};

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const { register, checkEmail } = useApi(); 

  const handleChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "email") {
      if (!value.includes("@")) {
        setErrors((prev) => ({ ...prev, email: "Invalid email address." }));
        return;
      }
      setIsCheckingEmail(true);
      try {
        const result = await checkEmail(value);
        if (result.exists) {
          setErrors((prev) => ({ ...prev, email: "Email already exists." }));
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setErrors((prev) => ({ ...prev, email: "Error checking email." }));
      } finally {
        setIsCheckingEmail(false);
      }
    }

    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleNext = () => {
    const validationErrors = validateStep(step, formData, {});
    console.log("Validation Errors:", validationErrors); // Debugowanie
    if (Object.keys(validationErrors).length === 0) {
      setStep((prev) => prev + 1);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked, preparing to send data:", formData);
    const validationErrors = validateStep(step, formData, {});
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors found:", validationErrors);
      setErrors(validationErrors);
      return;
    }
  
    const { confirmPassword, ...payload } = formData;
  
    try {
      setIsSubmitting(true);
      console.log("Sending payload to register function:", payload);
      await register(payload);
      console.log("Registration successful");
      setFormData({
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: "",
      });
      setStep(1);
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ email: "Email already exists or another error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const renderStep = () => {
    if (step === 1) {
      return (
        <FormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(id, value) => handleChange(id, value)}
          errorMessage={errors.email}
        />
      );
    } else if (step === 2) {
      return (
        <>
          <FormField
            id="firstname"
            label="First name"
            value={formData.firstname}
            onChange={(id, value) => handleChange(id, value)}
            errorMessage={errors.firstname}
          />
          <FormField
            id="lastname"
            label="Last name"
            value={formData.lastname}
            onChange={(id, value) => handleChange(id, value)}
            errorMessage={errors.lastname}
          />
        </>
      );
    } else if (step === 3) {
      return (
        <>
          <FormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(id, value) => handleChange(id, value)}
            errorMessage={errors.password}
          />
          <div className={`password-strength ${passwordStrength}`}>
            {passwordStrength === "strong"
              ? "Strong password"
              : passwordStrength === "medium"
              ? "Medium password"
              : "Weak password"}
          </div>
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(id, value) => handleChange(id, value)}
            errorMessage={errors.confirmPassword}
          />
        </>
      );
    }
  };

  return (
    <div className="form-container">
      <div className={`form step-${step}`}>
        {renderStep()}
        <div className="buttons2">
  {step > 1 && (
    <button
      className="create-button"
      onClick={() => {
        console.log("Back button clicked");
        setStep((prev) => prev - 1);
      }}
    >
      Back
    </button>
  )}
  {step < 3 && (
    <button
      className="create-button"
      onClick={() => {
        console.log("Next button clicked");
        handleNext();
      }}
    >
      Confirm
    </button>
  )}
  {step === 3 && (
    <button
      className="create-button"
      onClick={() => {
        console.log("Submit button clicked");
        handleSubmit();
      }}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : "Sign Up"}
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default RegisterForm;
