// Plik: OwnerDesks.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import "../../../styles/Owner/List.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import OwnerTabs from "./OwnerTabs";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaDesktop, FaHistory } from 'react-icons/fa';

const OwnerDesks = () => {
  const { user, accessToken } = useAuth();
  const [desks, setDesks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/user/${user.userId}/desks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId,
          },
        });

        const sortedDesks = response.data.content.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setDesks(sortedDesks);
      } catch (err) {
        console.error("Error fetching desks:", err);
        setError("Failed to load desks. Please try again later.");
      }
    };

    if (user?.userId) {
      fetchDesks();
    }
  }, [user, accessToken]);

  const handleViewDetails = (deskId) => {
    navigate(`/desk/${deskId}`);
  };

  const handleViewRentHistory = (deskId) => {
    navigate(`/owner/desk/${deskId}`);
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <h2>Here you can manage your desks ads</h2>
        <hr />
        <div className="manage-ads-tabs">
          <OwnerTabs />
        </div>
        
        <div className="ads-grid">
          {desks.map((desk) => (
            <div key={desk.id} className="office-card">
              <div className="office-image">
                <img src={desk.photos?.[0]?.url} alt={desk.desk} />
                <div className={`status-badge ${desk.status === 'AVAILABLE' ? 'active' : 'inactive'}`}>
                  {desk.status}
                </div>
              </div>

              <div className="office-content">
                <h3><FaDesktop /> {desk.desk}</h3>

                <div className="office-address">
                  <FaMapMarkerAlt />
                  <p>
                    {desk.building?.address?.address}, {desk.building?.address?.city?.city}, {desk.building?.address?.city?.country?.country}
                  </p>
                </div>

                <p><strong>Price:</strong> {desk.price} PLN</p>

                <div className="approval-status">
                  <span>Approval Status:</span>
                  {desk.isApproved ? 
                    <span className="approved"><FaCheck /> Approved</span> : 
                    <span className="not-approved"><FaTimes /> Not Approved</span>
                  }
                </div>

                <div className="action-buttons">
                  <button 
                    className="primary-button"
                    onClick={() => handleViewDetails(desk.id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="create-button"
                    onClick={() => handleViewRentHistory(desk.id)}
                  >
                     Rental History 
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="floating-add-button"
          onClick={() => navigate("/owner/desk/add")}
        >
          Add New Desk
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDesks;