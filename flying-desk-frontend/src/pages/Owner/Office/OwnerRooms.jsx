// Plik: OwnerRooms.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import "../../../styles/Owner/List.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import OwnerTabs from "./OwnerTabs";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaDoorOpen, FaHistory } from 'react-icons/fa';

const OwnerRooms = () => {
  const { user, accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/user/${user.userId}/rooms`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId,
          },
        });

        const sortedRooms = response.data.content.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setRooms(sortedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      }
    };

    if (user?.userId) {
      fetchRooms();
    }
  }, [user, accessToken]);

  const handleViewDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleViewRentHistory = (roomId) => {
    navigate(`/owner/room/${roomId}`);
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <h2>Here you can manage your rooms ads</h2>
        <hr />
        <div className="manage-ads-tabs">
          <OwnerTabs />
        </div>
        
        <div className="ads-grid">
          {rooms.map((room) => (
            <div key={room.id} className="office-card">
              <div className="office-image">
                <img src={room.photos?.[0]?.url} alt={room.room} />
                <div className={`status-badge ${room.status === 'AVAILABLE' ? 'active' : 'inactive'}`}>
                  {room.status}
                </div>
              </div>

              <div className="office-content">
                <h3><FaDoorOpen /> {room.room}</h3>

                <div className="office-address">
                  <FaMapMarkerAlt />
                  <p>
                    {room.building?.address?.address}, {room.building?.address?.city?.city}, {room.building?.address?.city?.country?.country}
                  </p>
                </div>

                <p><strong>Price:</strong> {room.price} PLN</p>

                <div className="approval-status">
                  <span>Approval Status:</span>
                  {room.isApproved ? 
                    <span className="approved"><FaCheck /> Approved</span> : 
                    <span className="not-approved"><FaTimes /> Not Approved</span>
                  }
                </div>

                <div className="action-buttons">
                  <button 
                    className="primary-button"
                    onClick={() => handleViewDetails(room.id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="create-button"
                    onClick={() => handleViewRentHistory(room.id)}
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
          onClick={() => navigate("/owner/")}
        >
          Add New Room
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerRooms;