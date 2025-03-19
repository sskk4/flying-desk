import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./AuthFormField";
import { useApi } from "../../services/api"; 
import { checkPasswordStrength } from "../../utils/formValidation";

import emailSent from "../../assets/images/email-sent.gif";


const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const validateStep = (step, data, errors) => {
  if (step === 1) {
    if (!data.email.includes("@")) {
      errors.email = "Invalid email address.";
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
  const navigate = useNavigate();
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
  const [emailAvailable, setEmailAvailable] = useState(false);
  
  const debouncedEmail = useDebounce(formData.email, 500);
  
  const { register, checkEmail } = useApi(); 
  
  const lastCheckedEmailRef = useRef('');

  useEffect(() => {

    if (
      debouncedEmail && 
      debouncedEmail.includes('@') && 
      debouncedEmail.length > 3 && 
      debouncedEmail !== lastCheckedEmailRef.current &&
      !isCheckingEmail
    ) {
      const verifyEmail = async () => {
        setIsCheckingEmail(true);
        setEmailAvailable(false);
        
        try {
          await checkEmail(debouncedEmail);
          setErrors(prev => ({ ...prev, email: '' }));
          setEmailAvailable(true);
        } catch (error) {
          console.error("Error checking email:", error);

          if (error.response && error.response.status === 400) {
            setErrors(prev => ({ ...prev, email: "Email already exists." }));
          } else {
            setErrors(prev => ({ ...prev, email: "Error checking email." }));
          }
          setEmailAvailable(false);
        } finally {
          setIsCheckingEmail(false);
          lastCheckedEmailRef.current = debouncedEmail;
        }
      };
      
      verifyEmail();
    }
  }, [debouncedEmail, checkEmail, isCheckingEmail]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    

    if (field === "email") {
      if (!value || !value.includes("@")) {
        setErrors(prev => ({ ...prev, email: !value ? "" : "Invalid email address." }));
        setEmailAvailable(false);
      }
    }


    if (field !== "email") {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleNext = () => {
    if (step === 1 && isCheckingEmail) {
      return;
    }
    
    if (step === 1) {
      if (errors.email || !emailAvailable) {
        return;
      }
    }
    
    const validationErrors = validateStep(step, formData, {});
    if (Object.keys(validationErrors).length === 0) {
      setStep((prev) => prev + 1);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep(step, formData, {});
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const { confirmPassword, ...payload } = formData;
  
    try {
      setIsSubmitting(true);
      await register(payload);
      setStep(4); 
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
        <>
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(id, value) => handleChange(id, value)}
            errorMessage={errors.email}
          />
          {formData.email && !errors.email && isCheckingEmail && (
            <div className="email-checking">Checking email...</div>
          )}
          {formData.email && !errors.email && emailAvailable && !isCheckingEmail && (
            <div className="email-available">Email is available ✓</div>
          )}
        </>
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
    } else if (step === 4) {
      return (
        <div>
          <img
            src={emailSent}
            alt="Approve"
            className="email-illustration"
          />
          <h2 className="email-title">Check your email to activate your account!</h2>
          <button
            className="create-button"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      );
    }
  };

  return (
    <div className="form-container">
      <div className={`form step-${step}`}>
        {renderStep()}
        {step < 4 && (
          <div className="buttons2">
            {step > 1 && (
              <button
                className="create-button"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                className="create-button"
                onClick={handleNext}
                disabled={step === 1 && (isCheckingEmail || errors.email || (!emailAvailable && formData.email))}
              >
                Confirm
              </button>
            )}
            {step === 3 && (
              <button
                className="create-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;