import React from 'react';
import {Link} from 'react-router-dom';
import './ApplicationStatusCard.css';

import Cross from "../../assets/svg/wrong-user-svgrepo-com.svg";

const ApplicationStatusCard = () => {
  return (
    <div className="application-card">
      <div className="checkmark">
      <img
          src={Cross}
          alt="Cross"
          className="checkmark-illustration"
        />
      </div>
      <h2 className="error-title">Wrong user</h2>
      <hr />
      <p>Your application has been rejected by the administration.</p>
      <p className="error-description">
        In case of any problems, <Link className="a-link" href="#">contact us</Link>
      </p>
      <button className="create-button">Your profile</button>
    </div>
  );
};

export default ApplicationStatusCard;