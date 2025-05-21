
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';
import Logo from '../../assets/images/login-logo.png';
import Form from './RegisterForm.jsx';

const Login = () => {

  return (

    <div className="login-container"> 
        <div className="top-logo"> 
        <Link to="/">
        <img className="top-logo-img" src={Logo} alt="Logo"/>    
        </Link>
        </div>
    <div className="panel">

    
    <Form />

 

    </div>
    <div className="menu-bar-button slide-in-out margin">
        <a href="#"> Forgot password?</a>
        </div>   
        <Link to="/Login"> 
        <div className="menu-bar-button slide-in-out margin"> Login</div>
        </Link>
    </div>

  );
};

export default Login;





