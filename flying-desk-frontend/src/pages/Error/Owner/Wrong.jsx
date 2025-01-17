import React from "react";

import "../../../styles/Owner/Start.css";
import Footer from "../../../components/Footer/Footer"
import Header from '../../../components/Header/Header';
import WrongApplicationStatusCard from '../../../components/Status/WrongApplicationStatusCard'

const OwnerContainer = () => {
  return (
    
    <div> 
        <Header />
    <div className="owner-container">

        <WrongApplicationStatusCard />

    </div>

    <Footer />
    </div>

  );
};

export default OwnerContainer;