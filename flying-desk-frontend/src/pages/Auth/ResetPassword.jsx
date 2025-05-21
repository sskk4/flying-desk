// src/pages/Auth/ResetPassword.jsx
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import Logo from "../../assets/images/login-logo.png";
import userIcon from "../../assets/images/user.png";
import { useApi } from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const api = useApi();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(null);
    setError(null);
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await api.resetPassword(token, formData.password);
      
      setMessage("Password has been reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="top-logo">
        <Link to="/">
          <img className="top-logo-img" src={Logo} alt="Logo" />
        </Link>
      </div>
      <div className="panel center">
        <div className="panel-image">
          <img className="panel-img" src={userIcon} alt="User" />
        </div>

        <h2>Reset Password</h2>
        <p>Enter your new password below</p>

        <form onSubmit={handleSubmit}>
          <div className="panel-password">
            <input
              name="password"
              type="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="panel-password">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button wide margin-top" 
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>

      <Link to="/login">
        <div className="menu-bar-button slide-in-out margin">Back to Login</div>
      </Link>
    </div>
  );
};

export default ResetPassword;