import React from "react";
import { Link } from "react-router-dom";

import "../../../styles/Owner/Start.css";
import Footer from "../../../components/Footer/Footer"
import Header from '../../../components/Header/Header';
import Building from "../../../assets/png/building3.png"

const StartContainer = () => {
  return (
    
    <div> 
        <Header />
    <div className="owner-container">
      <h2 className="owner-title">If You Want To Be an Owner</h2>
      <div className="owner-image">
        <img
          src={Building}
          alt="Office Illustration"
          className="owner-illustration"
        />
      </div>
      <Link to="terms">
      <button className="owner-button login-button">Start your office rental</button>
      </Link>
      <p className="owner-terms">
      <Link to="terms" className="terms-link">
          Terms
        </Link>{" "}
        for registering your office space on our platform
      </p>
    </div>

    <Footer />
    </div>

  );
};

export default StartContainer;