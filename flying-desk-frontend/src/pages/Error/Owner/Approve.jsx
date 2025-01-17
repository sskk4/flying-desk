import React from "react";

import "../../../styles/Owner/Start.css";
import Footer from "../../../components/Footer/Footer"
import Header from '../../../components/Header/Header';
import ApplicationStatusCard from '../../../components/Status/ApplicationStatusCard'

const OwnerContainer = () => {
  return (
    
    <div> 
        <Header />
    <div className="owner-container">

        <ApplicationStatusCard />

    </div>

    <Footer />
    </div>

  );
};

export default OwnerContainer;