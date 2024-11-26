import React, { useState } from "react";
import Swal from "sweetalert2";

import FormField from "../../components/Form/FormField";
import ArrowRight from "../../assets/icons/arrow-right.svg";

import { checkEmailExistence, registerUser } from "../../services/api";
import { checkPasswordStrength, validateStep } from "../../utils/formValidation";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(true);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleNext = async () => {
    const validationErrors = await validateStep(step, formData); // Zapisujemy błędy w zmiennej
    setErrors(validationErrors); // Ustawiamy błędy w stanie komponentu
  
    const isValid = Object.keys(validationErrors).length === 0; // Jeśli nie ma błędów, walidacja przeszła
    if (isValid) {
      setAnimate(false);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setAnimate(true);
      }, 300);
    }
  };

  const handleBack = () => {
    setAnimate(false);
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setAnimate(true);
    }, 300);
  };

  const handleSubmit = async () => {
    if (await validateStep(step, formData, setErrors)) {
      const { success, message } = await registerUser(formData);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          html: `Your account has been created successfully.`,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: message,
          confirmButtonText: "OK",
        });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <FormField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} errorMessage={errors.email} />;
      case 2:
        return (
          <>
            <FormField id="firstName" label="First name" value={formData.firstName} onChange={handleChange} errorMessage={errors.firstName} />
            <FormField id="lastName" label="Last name" value={formData.lastName} onChange={handleChange} errorMessage={errors.lastName} />
          </>
        );
      case 3:
        return (
          <>
            <FormField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} errorMessage={errors.password} />
            <div className={`password-strength ${passwordStrength}`}>
        {passwordStrength === "strong"
          ? "Strong password"
          : passwordStrength === "medium"
          ? "Medium password"
          : "Weak password"}
      </div>
            <FormField id="confirmPassword" label="Confirm password" type="password" value={formData.confirmPassword} onChange={handleChange} errorMessage={errors.confirmPassword} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`form-container step-${step} ${animate ? "visible" : "hidden"}`}>
      <div className="form">
        {renderStep()}
        <div className="buttons">
          {step > 1 && (
            <button className="create-button back" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 3 && (
            <button className="login-button" onClick={handleNext}>
              <img className="arrow-right" src={ArrowRight} />
            </button>
          )}
          {step === 3 && (
            <button className="login-button submit" onClick={handleSubmit}>
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
