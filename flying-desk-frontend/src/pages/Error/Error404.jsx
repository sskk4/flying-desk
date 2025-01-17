import React from "react";

import "../../components/Status/Error.css";
import Footer from "../../components/Footer/Footer"
import Header from '../../components/Header/Header';
import Table from "../../assets/png/table3.png";

const Error403 = () => {
  return (
    <div> 
        <Header />
    <div className="error-container">

      <div className="error-image">
        <img
          src={Table}
          alt="Office Illustration"
          className="error-img"
        />
      </div>

      <div className="error-info">

      <h2 className="error-title" > 404 </h2>
      <h3 className="error-subtitle"> The requested URL was not found on this server </h3>

      </div>
   
    </div>

    <Footer />
    </div>
  );
};

export default Error403;