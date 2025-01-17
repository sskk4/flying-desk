import React from 'react';
import './ApplicationStatusCard.css';

import Approve from "../../assets/svg/correct.svg";

const ApplicationStatusCard = () => {
  return (
    <div className="application-card">
      <div className="checkmark">
      <img
          src={Approve}
          alt="Approve"
          className="checkmark-illustration"
        />
      </div>
      <h2>Send to administration</h2>
      <hr />
      <p>Your application has been sent and is now waiting for approval.</p>
      <p className="error-description">
        In case of any problems, <a href="#">contact us</a>
      </p>
      <button className="create-button">Your profile</button>
    </div>
  );
};

export default ApplicationStatusCard;