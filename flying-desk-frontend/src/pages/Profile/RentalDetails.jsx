import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import "../../styles/Rent.css";

const RentalDetails = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [rental, setRental] = useState(null);
  const [reservationCode, setReservationCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  
  useEffect(() => {
    const fetchRentalAndCode = async () => {
      try {
        setLoading(true);
        
        // Step 1: Fetch rental details
        const rentalResponse = await axios.get(`http://localhost:8083/api/v1/rent/${rentalId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const rentalData = rentalResponse.data;
        
        if (rentalData.userId !== (user?.userId || 38)) {
          setUnauthorized(true);
          setError("You don't have permission to view this rental.");
          return;
        }
        
        setRental(rentalData);
        
        // Step 2: Fetch reservation code if rental is paid
        if (rentalData.status === "PAID") {
          try {
            const codeResponse = await axios.get(`http://localhost:8083/api/v1/reservation-codes/rent/${rentalId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
            if (codeResponse.data) {
              setReservationCode(codeResponse.data.code);
            }
          } catch (codeErr) {
            console.error("Error fetching reservation code:", codeErr);

          }
        }
      } catch (err) {
        console.error("Error fetching rental data:", err);
        setError("Failed to load rental information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && rentalId) {
      fetchRentalAndCode();
    }
  }, [accessToken, rentalId, user]);

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

  if (!rental) {
    return (
      <div className="rental-error-container">
        <div className="rental-error">Rental not found.</div>
        <button onClick={goBack} className="create-button">Back to Rentals</button>
      </div>
    );
  }

  return (
    <div className="rental-details-container">
      <h2>Rental Details</h2>
      
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
        <div className="rental-detail-item">
          <span className="detail-label">Status:</span>
          <span 
            className="detail-value status-badge"
            style={{ 
              backgroundColor: rental.status === "PAID" ? "#4CAF50" : 
                              rental.status === "CANCELLED" ? "#9E9E9E" : "#9D8CFF",
              padding: "4px 8px",
              borderRadius: "4vh",
              color: "#fff",
              display: "inline-block"
            }}
          >
            {rental.status}
          </span>
        </div>
        <div className="rental-detail-item">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">{new Date(rental.createdAt).toLocaleString()}</span>
        </div>
      </div>
      
      {reservationCode && (
        <div className="reservation-code-container">
          <h3>Your Reservation Code</h3>
          <div className="reservation-code">{reservationCode}</div>
          <p className="code-instructions">
            Please save this code. You'll need to present it when collecting your rental.
          </p>
        </div>
      )}
      
      <div className="action-buttons">
        <button className="create-button" onClick={goBack}>Back to Rentals</button>
      </div>
    </div>
  );
};

export default RentalDetails;