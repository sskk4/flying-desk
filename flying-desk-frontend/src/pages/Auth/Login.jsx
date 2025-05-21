// src/components/Login/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider"; 
import "../../styles/Auth.css";
import Logo from "../../assets/images/login-logo.png";
import userIcon from "../../assets/images/user.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, clearError } = useAuth(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setError(null);
    clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password); 
      navigate("/profile"); 
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.data?.message?.includes("not activated")) {
        setError("Your account is not activated. Please check your email for the activation link.");
      } else {
        setError("Login failed. Please try again.");
      }
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
      <div>
      <div className="panel center">
        <div className="panel-image">
          <img className="panel-img" src={userIcon} alt="User" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="panel-login">
            <input
              name="email"
              type="text"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="panel-password">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

                {error && <div className="error-message">{error}</div>}

          <Link to="/forgot-password">
            <div className="panel-forgot menu-bar-button slide-in-out margin">
              Forgot password?
            </div>
          </Link>

                    <button 
            type="submit" 
            className="login-button wide margin-top"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

             </form>
      </div>


          
 
      </div>
    

<hr></hr>
      <Link to="/register">
        <div className="create-button">Create account</div>
      </Link>
    </div>
  );
};

export default Login;