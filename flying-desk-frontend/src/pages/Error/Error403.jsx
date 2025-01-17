import React from "react";

import "../../components/Status/Error.css";
import Footer from "../../components/Footer/Footer"
import Header from '../../components/Header/Header';
import Table from "../../assets/png/table1.png";

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

      <h2 className="error-title" > 403 </h2>
      <h3 className="error-subtitle"> access to the requested resource is forbidden</h3>

      </div>
   
    </div>

    <Footer />
    </div>
  );
};

export default Error403;