import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import { format } from "date-fns";
import "../../styles/Rent.css"; 

const UserRentals = () => {
  const { accessToken, user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColors = {
    PENDING: "#9D8CFF", 
    APPROVED: "#4CAF50", 
    REJECTED: "#F44336", 
    CANCELLED: "#9E9E9E", 
    COMPLETED: "#2196F3", 
  };
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch (err) {
      return dateTimeStr;
    }
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const userId = user?.userId || 1;
        const response = await axios.get(`http://localhost:8083/api/v1/rent/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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

  const getRentTypeBadge = (rentType) => {
    switch (rentType) {
      case "DESK":
        return <span className="badge desk">Desk</span>;
      case "OFFICE":
        return <span className="badge office">Office</span>;
      case "CONFERENCE":
        return <span className="badge conference">Conference Room</span>;
      default:
        return <span className="badge">{rentType}</span>;
    }
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.id}</td>
                  <td>{getRentTypeBadge(rental.rentType)}</td>
                  <td>{formatDateTime(rental.startDate)}</td>
                  <td>{formatDateTime(rental.endDate)}</td>
                  <td>${rental.price.toFixed(2)}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: statusColors[rental.status] || "#757575" }}
                    >
                      {rental.status}
                    </span>
                  </td>
                  <td>{formatDateTime(rental.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="view-details-btn">Details</button>
                    {rental.status === "PENDING" && (
                      <button className="cancel-btn">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserRentals;