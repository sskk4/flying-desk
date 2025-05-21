
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";
import Logo from "../../assets/images/login-logo.png";
import userIcon from "../../assets/images/user.png";
import { useApi } from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const api = useApi();

  const handleInputChange = (e) => {
    setEmail(e.target.value);

    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      await api.forgotPassword(email);
      
      setMessage("Password recovery link has been sent to your email");
      setError(null);
    } catch (err) {
      console.error("Password recovery error:", err);
      setError(err.response?.data?.message || "Failed to send recovery email. Please try again.");
      setMessage(null);
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

        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <div className="panel-login">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
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
            {isLoading ? "Sending..." : "Send Recovery Link"}
          </button>
        </form>
      </div>

      <Link to="/login">
        <div className="menu-bar-button slide-in-out margin">Back to Login</div>
      </Link>
    </div>
  );
};

export default ForgotPassword;