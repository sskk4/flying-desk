import React from 'react';
import './ApplicationStatusCard.css';
import SuccessIcon from "../../assets/svg/correct.svg";

const ActivateAccountCardSuccess = () => {
  return (
    <div className="activate-card">

      <h2 className="error-title">Account Activated</h2>
      <hr />
      <p>Your account has been successfully activated!</p>
      <p className="support-info">
        You can now log in and start using your profile.
      </p>
      <button className="action-button">Go to Login</button>
    </div>
  );
};

export default ActivateAccountCardSuccess;
