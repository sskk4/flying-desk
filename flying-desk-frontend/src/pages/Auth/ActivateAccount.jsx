import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ActivateAccountCardSuccess from "../../components/Status/ActivateAccountCardSuccess";
import ActivateAccountCardError from "../../components/Status/ActivateAccountCardError";
import { useApi } from "../../services/api"; // Importuj funkcję activate by email

import "../../styles/Owner/Start.css";

const ActivateAccountPage = () => {
  const { activationId } = useParams(); // Pobiera `activationId` z URL
  const [activationStatus, setActivationStatus] = useState(null);
  const { activate } = useApi(); // Destrukturyzacja funkcji activate z useApi

  useEffect(() => {
    let isMounted = true;
    const activateAccount = async () => {
      console.log("Starting account activation...");
      console.log("Activation ID:", activationId);
      try {
        const response = await activate(activationId); // Użyj funkcji activate
        console.log("Activation response:", response);
        if (isMounted) {
          if (response.status === 200) {
            console.log("Activation successful");
            setActivationStatus("success");
          } else {
            console.log("Activation failed with status:", response.status);
            console.log("Response data:", response.data);
            setActivationStatus("error");
          }
        }
      } catch (error) {
        console.error("Activation error:", error);
        if (isMounted) {
          if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
          }
          setActivationStatus("error");
        }
      }
    };

    activateAccount();

    return () => {
      isMounted = false;
    };
  }, [activationId, activate]);

  return (
    <div>
      <Header />
      <div className="owner-container">
        {activationStatus === "success" && <ActivateAccountCardSuccess />}
        {activationStatus === "error" && <ActivateAccountCardError />}
        {!activationStatus && <p>Loading...</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ActivateAccountPage;