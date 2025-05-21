import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ApplicationStatusCard.css';
import { useAuth } from '../../services/AuthProvider';
import Cross from "../../assets/svg/wrong-user-svgrepo-com.svg";

const ApplicationStatusCard = () => {
  const { submissionDetails } = useAuth();
  const navigate = useNavigate();

  const rejectionReason = submissionDetails?.rejectionReason || "No specific reason provided";

  return (
    <div className="application-card">
      <div className="checkmark">
        <img
          src={Cross}
          alt="Cross"
          className="checkmark-illustration"
        />
      </div>
      <h2 >Application Rejected</h2>
      <hr />
      <p>Your application has been rejected by the administration.</p>
      
      <div className="rejection-reason">
        <h4>Reason:</h4>
        <p>{rejectionReason}</p>
      <hr></hr>
      </div>
      
      <p className="error-description">
        In case of any problems, <Link className="a-link" to="/contact">contact us</Link>
      </p>
      <button 
        className="create-button" 
        onClick={() => navigate('/profile')}
      >
        Your profile
      </button>
    </div>
  );
};

export default ApplicationStatusCard;