import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../services/AuthProvider";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "../../styles/Rent.css"; 
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const UserRentals = () => {
  const { accessToken, user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
 key: 'createdAt',
    direction: 'descending'
  });
  
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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) {
      return rentals;
    }

    return [...rentals].sort((a, b) => {

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (['startDate', 'endDate', 'createdAt'].includes(sortConfig.key)) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortConfig.key === 'price') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }
      
      if (sortConfig.key === 'id') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="sort-icon" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

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
                <th onClick={() => requestSort('id')} className="sortable-column">
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => requestSort('resourceType')} className="sortable-column">
                  Type {getSortIcon('resourceType')}
                </th>
                <th>Resource</th>
                <th onClick={() => requestSort('startDate')} className="sortable-column">
                  Start Date {getSortIcon('startDate')}
                </th>
                <th onClick={() => requestSort('endDate')} className="sortable-column">
                  End Date {getSortIcon('endDate')}
                </th>
                <th onClick={() => requestSort('price')} className="sortable-column">
                  Price {getSortIcon('price')}
                </th>
                <th onClick={() => requestSort('status')} className="sortable-column">
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => requestSort('createdAt')} className="sortable-column">
                  Created {getSortIcon('createdAt')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getSortedData().map((rental) => {
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

      <style jsx>{`
        .sortable-column {
          cursor: pointer;
          user-select: none;
          position: relative;
          padding-right: 20px;
        }
        
        .sort-icon {
          font-size: 12px;
          vertical-align: middle;
          margin-left: 5px;
          opacity: 0.5;
        }
        
        .sort-icon.active {
          opacity: 1;
          color: #0066cc;
        }
        
        .rentals-table th:hover .sort-icon {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default UserRentals;