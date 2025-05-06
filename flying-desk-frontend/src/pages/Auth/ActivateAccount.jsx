import React, { useState, useEffect, useRef  } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ActivateAccountCardSuccess from "../../components/Status/ActivateAccountCardSuccess";
import ActivateAccountCardError from "../../components/Status/ActivateAccountCardError";
import { useApi } from "../../services/api";

import "../../styles/Owner/Start.css";

const ActivateAccountPage = () => {
  const { activationId } = useParams();
  const [activationStatus, setActivationStatus] = useState("loading");
  const { activate } = useApi();
  const hasActivated = useRef(false);

  useEffect(() => {
    if (hasActivated.current) return; 
    hasActivated.current = true;

    const activateAccount = async () => {
      try {
        await activate(activationId);
        setActivationStatus("success");
      } catch (error) {
        setActivationStatus("error");
      }
    };

    if (activationId) {
      activateAccount();
    }
  }, [activationId, activate]);

  return (
    <div>
      <Header />
      <div className="owner-container">
        {activationStatus === "success" && <ActivateAccountCardSuccess />}
        {activationStatus === "error" && <ActivateAccountCardError />}
        {activationStatus === "loading" && <p>Loading...</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ActivateAccountPage;
