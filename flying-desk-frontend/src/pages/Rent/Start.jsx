import React from "react";

import { Link } from "react-router-dom";
import "../../styles/Rent/Start.css";
import Footer from "../../components/Footer/Footer";
import Header from '../../components/Header/Header';
import CheckBox from '../../components/CheckBox/CheckBox';


import desk1 from "../../assets/png/desk.png";
import desk2 from "../../assets/png/desk2.png"

const OwnerContainer = () => {
  return (
    
    <div> 
        <Header />
    <div className="owner-container">

    <Link to="/desks">
      <div className="image-hover-container">
      <div className="image-wrapper">
        <img
          src={desk1}
          alt="Pierwsze zdjęcie"
          className="image image-front"
        />
        <img
          src={desk2}
          alt="Drugie zdjęcie"
          className="image image-back"
        />
      </div>
    </div>
    </Link>
    <Link to="/desks">
    <button className="rent-button create-button">Start rent</button>
    </Link>

    <div className="terms-agreement">
      <CheckBox />
      <p className="rent-terms">
        Agree to our platform's{' '}
        <a href="#terms" className="terms-link">
          terms
        </a>{' '}
        before proceeding.
      </p>
    </div>
    </div>

    <Footer />
    </div>

  );
};

export default OwnerContainer;