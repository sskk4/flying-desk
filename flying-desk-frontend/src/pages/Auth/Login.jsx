import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider"; 
import "../../styles/Auth.css";
import Logo from "../../assets/images/login-logo.png";
import userIcon from "../../assets/images/user.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password); 
      navigate("/profile"); 
    } catch (err) {
      setError("Nieprawidłowy e-mail lub hasło");
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

        <div className="panel-forgot menu-bar-button slide-in-out margin">
          Forgot password?
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="login-button wide margin-top" onClick={handleLogin}>
        Sign In
      </button>
      <Link to="/register">
        <div className="create-button">Create account</div>
      </Link>
    </div>
  );
};

export default Login;
