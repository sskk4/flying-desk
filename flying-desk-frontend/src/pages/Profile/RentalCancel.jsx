import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import "../../styles/Rent.css";

const RentalCancel = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  
  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8083/api/v1/rent/${rentalId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const rentalData = response.data;
        
        
        if (rentalData.status === "CANCELLED") {
          setError("This rental has already been cancelled.");
          return;
        }
        
        if (rentalData.status === "PAID") {
          setError("This rental has already been paid and cannot be cancelled.");
          return;
        }
        
        setRental(rentalData);
      } catch (err) {
        console.error("Error fetching rental data:", err);
        setError("Failed to load rental information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && rentalId) {
      fetchRental();
    }
  }, [accessToken, rentalId, user]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await axios.put(`http://localhost:8083/api/v1/rent/${rentalId}/status?status=CANCELLED`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error cancelling rental:", err);
      setError("Failed to cancel this rental. Please try again later.");
    } finally {
      setCancelling(false);
    }
  };

  const goBack = () => {
    navigate("/profile/rentals");
  };

  if (loading) {
    return <div className="rental-loading">Loading rental details...</div>;
  }

  if (unauthorized) {
    return (
      <div className="rental-error-container">
        <div className="rental-error">Unauthorized: {error}</div>
        <button onClick={goBack} className="create-button">Back to Rentals</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rental-error-container">
        <div className="rental-error">{error}</div>
        <button onClick={goBack} className="create-button">Back to Rentals</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rental-success-container">
        <div className="rental-success">
          <h2>Rental Cancelled</h2>
          <p>Your rental has been successfully cancelled.</p>
          <button onClick={goBack} className="create-button">Back to Rentals</button>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="rental-error-container">
        <div className="rental-error">Rental not found.</div>
        <button onClick={goBack} className="create-button">Back to Rentals</button>
      </div>
    );
  }

  return (
    <div className="rental-cancel-container">
      <h2>Cancel Rental</h2>
      
      <div className="rental-details">
        <div className="rental-detail-item">
          <span className="detail-label">Rental ID:</span>
          <span className="detail-value">{rental.id}</span>
        </div>
        <div className="rental-detail-item">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{rental.resourceType}</span>
        </div>
        <div className="rental-detail-item">
          <span className="detail-label">Resource ID:</span>
          <span className="detail-value">{rental.resourceId}</span>
        </div>
        <div className="rental-detail-item">
          <span className="detail-label">Start Date:</span>
          <span className="detail-value">{new Date(rental.startDate).toLocaleString()}</span>
        </div>
        <div className="rental-detail-item">
          <span className="detail-label">End Date:</span>
          <span className="detail-value">{new Date(rental.endDate).toLocaleString()}</span>
        </div>
        <div className="rental-detail-item price">
          <span className="detail-label">Total Price:</span>
          <span className="detail-value">${rental.price.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="cancellation-notice">
        <p>Are you sure you want to cancel this rental? This action cannot be undone.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="confirm-cancel-btn" 
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? "Processing..." : "Confirm Cancellation"}
        </button>
        <button className="create-button" onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
};

export default RentalCancel;