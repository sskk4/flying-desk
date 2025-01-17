import React from 'react';
import './ApplicationStatusCard.css';
import ErrorIcon from "../../assets/svg/wrong-user-svgrepo-com.svg";

const ActivateAccountCardError = () => {
  return (
    <div className="activate-card">
      <div className="status-icon">
      </div>
      <h2 className="error-title">Activation Failed</h2>
      <hr />
      <p>We couldn't activate your account due to an error.</p>
      <p className="support-info">
        Please <a href="#">contact support</a> for assistance.
      </p>
      <button className="action-button">Try Again</button>
    </div>
  );
};

export default ActivateAccountCardError;
