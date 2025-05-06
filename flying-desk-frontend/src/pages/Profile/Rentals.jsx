import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "../../styles/Rent.css"; 

const UserRentals = () => {
  const { accessToken, user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColors = {
    PENDING: "#9D8CFF", 
    PAID: "#4CAF50", 
    CANCELLED: "#9E9E9E", 
  };
  
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const userId = user?.userId || 38; 
        const response = await axios.get(`http://localhost:8083/api/v1/rent/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Rental data:", response.data);
        setRentals(response.data);
      } catch (err) {
        console.error("Error fetching rental data:", err);
        setError("Failed to load rental data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchRentals();
    }
  }, [accessToken, user]);

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch (err) {
      return dateTimeStr;
    }
  };

  const getResourceTypeBadge = (resourceType) => {
    switch (resourceType) {
      case "DESK":
        return <span className="badge desk">Desk</span>;
      case "ROOM":
        return <span className="badge room">Room</span>;
      default:
        return <span className="badge">{resourceType}</span>;
    }
  };

  const handleConfirm = (e, rentalId) => {
    e.preventDefault();
    window.location.href = `/profile/rentals/${rentalId}/confirm`;
  };

  const handleCancel = (e, rentalId) => {
    e.preventDefault();
    window.location.href = `/profile/rentals/${rentalId}/cancel`;
  };

  const handleViewDetails = (e, rentalId) => {
    e.preventDefault();
    window.location.href = `/profile/rentals/${rentalId}/details`;
  };

  if (loading) {
    return <div className="rentals-loading">Loading your rentals...</div>;
  }

  if (error) {
    return <div className="rentals-error">{error}</div>;
  }

  return (
    <div className="rentals-container">
      <h2 className="rentals-title">Your Rentals</h2>
      
      {rentals.length === 0 ? (
        <div className="no-rentals">
          <p>You don't have any rentals yet.</p>
          <a href="/desks" className="create-button">Explore Available Spaces</a>
        </div>
      ) : (
        <div className="rentals-table-container">
          <table className="rentals-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Resource</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => {
                const status = rental.status || "UNKNOWN";
                
                const statusColor = statusColors[status] || "#757575";
 
                
                return (
                  <tr key={rental.id}>
                    <td>{rental.id}</td>
                    <td>{getResourceTypeBadge(rental.resourceType)}</td>
                    <td>
                      <a 
                        href={`/${rental.resourceType?.toLowerCase()}/${rental.resourceId}`}
                        className="resource-link"
                      >
                        View {rental.resourceType?.toLowerCase()}
                      </a>
                    </td>
                    <td>{formatDateTime(rental.startDate)}</td>
                    <td>{formatDateTime(rental.endDate)}</td>
                    <td>${rental.price?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span 
                        style={{ 
                          backgroundColor: statusColor,
                          padding: "4px 8px",
                          borderRadius: "4vh",
                          color: "#fff",
                          display: "inline-block"
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td>{formatDateTime(rental.createdAt)}</td>
                    <td className="actions-cell">
                      {status === "PENDING" && (
                        <>
                          <button 
                            className="login-button"
                            onClick={(e) => handleConfirm(e, rental.id)}
                          >
                            Confirm
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={(e) => handleCancel(e, rental.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {status === "PAID" && (
                        <button 
                          className="login-button"
                          onClick={(e) => handleViewDetails(e, rental.id)}
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserRentals;