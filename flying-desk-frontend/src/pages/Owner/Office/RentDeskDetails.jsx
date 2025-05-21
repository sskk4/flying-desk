// Plik: DeskRentalDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import "../../../styles/Owner/ManageAds.css";
import "../../../styles/Owner/List.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { Calendar, Clock, User, DollarSign, ArrowLeft, Info } from "react-feather";

const DeskRentalDetails = () => {
  const { deskId } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  
  const [desk, setDesk] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [rentalStats, setRentalStats] = useState({
    totalRentals: 0,
    uniqueUsers: 0,
    totalRevenue: 0,
    avgDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeskAndRentals = async () => {
      try {
        const deskResponse = await axios.get(`http://localhost:8081/api/v1/building/desk/${deskId}`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId
          }
        });
        setDesk(deskResponse.data);

        const rentalHistoryResponse = await axios.get(`http://localhost:8083/api/v1/rent/resource`, {
          params: { 
            resourceType: "DESK", 
            resourceId: parseInt(deskId) 
          },
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId
          }
        });

        const sortedRentals = rentalHistoryResponse.data.sort((a, b) => 
          new Date(b.startDate) - new Date(a.startDate)
        );
        
        setRentalHistory(sortedRentals);
        
        if (sortedRentals.length > 0) {
          const uniqueUsersSet = new Set(sortedRentals.map(rental => rental.user?.userId));
          const totalRevenue = sortedRentals.reduce((total, rental) => total + (rental.price || 0), 0);
          
          const totalDurationMs = sortedRentals.reduce((total, rental) => {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            return total + (endDate - startDate);
          }, 0);
          
          const avgDurationHours = (totalDurationMs / sortedRentals.length) / (1000 * 60 * 60);
          
          setRentalStats({
            totalRentals: sortedRentals.length,
            uniqueUsers: uniqueUsersSet.size,
            totalRevenue: totalRevenue.toFixed(2),
            avgDuration: avgDurationHours.toFixed(1)
          });
        }
      } catch (err) {
        console.error("Error loading desk or rental data:", err);
        setError("Unable to load desk or rental data");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && user?.userId) {
      fetchDeskAndRentals();
    }
  }, [deskId, accessToken, user]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading-message">Loading rental information...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !desk) {
    return (
      <div>
        <Header />
        <div className="error-container">
          <div className="error-message">Error: {error || "Could not load desk information"}</div>
          <button className="primary-button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <div className="rental-details-header">
          <h2>
            <button className="create-button" onClick={() => navigate(-1)}>
              Back
            </button>
            <hr></hr>
            Rental History for <span className="owner-title">{desk.desk}</span>
          </h2>
        </div>

        <div className="rental-stats-container">
          <div className="stats-card">
            <div className="stats-header">
              <Info size={20} />
              <h3>Rental Statistics</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Rentals</span>
                <span className="stat-value">{rentalStats.totalRentals}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unique Users</span>
                <span className="stat-value">{rentalStats.uniqueUsers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">{rentalStats.totalRevenue} $</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg. Duration</span>
                <span className="stat-value">{rentalStats.avgDuration} hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rental-history-container">
          <h3>Rental History</h3>
          
          {rentalHistory.length > 0 ? (
            <div className="rental-list">
              {rentalHistory.map((rental) => (
                <div key={rental.id} className="rental-item-card">
                  <div className="rental-item-header">
                    <div className="rental-date">
                      <Calendar size={16} /> {formatDateTime(rental.startDate).split(' ')[0]}
                                            <h4> {new Date(rental.endDate) < new Date() ? "Passed" : "Upcoming"}</h4>
                    </div>
                    <div className="rental-status">

                                            {rental.status}
                    </div>
                    
                  </div>
                  
                  <div className="rental-item-details">
                    <div className="rental-detail">
                      <Clock size={16} /> 
                      <span>{formatDateTime(rental.startDate).split(' ')[1]} - {formatDateTime(rental.endDate).split(' ')[1]}</span>
                      <span className="rental-duration">({calculateDuration(rental.startDate, rental.endDate)})</span>
                    </div>
                    
                    {rental.user && (
                      <div className="rental-detail">
                        <User size={16} /> 
                        <span>{rental.user.firstName} {rental.user.lastName}</span>
                        <span className="rental-user-email">{rental.user.email}</span>
                      </div>
                    )}
                    
                    <div className="rental-detail">
                      <DollarSign size={16} /> 
                      <span className="rental-price">{rental.price?.toFixed(2) || "N/A"} $</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-rentals-message">
              <p>No rental history available for this desk.</p>
            </div>
          )}
        </div>
        <hr></hr>
        <div className="action-buttons-container">
          <button 
            className="login-button"
            onClick={() => navigate(`/desk/${deskId}`)}
          >
            View Desk Details
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeskRentalDetails;