import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import "../../styles/Rent.css";

const RentalConfirm = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
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
          setError("This rental has been cancelled and cannot be confirmed.");
          return;
        }
        
        if (rentalData.status === "PAID") {
          setError("This rental has already been paid.");
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

  const [reservationCode, setReservationCode] = useState(null);
  
  const handleConfirm = async () => {
    try {
      setConfirming(true);
      
      // Step 1: Create a payment
      const paymentResponse = await axios.post(
        `http://localhost:8083/api/v1/payment`, 
        {
          userId: rental.userId, 
          amount: rental.price,
          paymentMethod: "CARD", 
          status: "PENDING",
          transactionId: `txn${Date.now()}`,
          rent: {
            id: rental.id
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      const paymentId = paymentResponse.data.id;
      
      // Step 2: Update rental status to PAID
      await axios.put(
        `http://localhost:8083/api/v1/rent/${rental.id}/status?status=PAID`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // Step 3: Generate reservation code
      const uniqueCode = `RES${rental.id}${Date.now().toString().substring(7)}`;
      const expirationDate = new Date(rental.endDate); 
      
      const codeResponse = await axios.post(
        `http://localhost:8083/api/v1/reservation-codes`,
        {
          code: uniqueCode,
          rentId: rental.id,
          paymentId: paymentId,
          userId: rental.userId,
          expiresAt: expirationDate.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setReservationCode(codeResponse.data.code || uniqueCode);
      setSuccess(true);
    } catch (err) {
      console.error("Error confirming rental:", err);
      setError(
        err.response?.data?.message || 
        "Failed to process payment. Please try again later."
      );
    } finally {
      setConfirming(false);
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
          <h2>Payment Successful!</h2>
          <p>Your rental has been confirmed and marked as paid.</p>
          
          {reservationCode && (
            <div className="reservation-code-container">
              <h3>Your Reservation Code</h3>
              <div className="reservation-code">{reservationCode}</div>
              <p className="code-instructions">
                Please save this code. You'll need to present it when collecting your rental.
              </p>
            </div>
          )}
          
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
    <div className="rental-confirm-container">
      <h2>Confirm Rental</h2>
      
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
      
      <div className="payment-notice">
        <p>By clicking "Confirm & Pay", you agree to the terms and conditions for this rental.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="login-button wide" 
          onClick={handleConfirm}
          disabled={confirming}
        >
          {confirming ? "Processing Payment..." : "Confirm & Pay"}
        </button>
        <button className="create-button" onClick={goBack}>Cancel</button>
      </div>
    </div>
  );
};

export default RentalConfirm;