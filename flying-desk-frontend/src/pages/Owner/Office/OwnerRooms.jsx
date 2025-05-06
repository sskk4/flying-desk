import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import "../../../styles/Owner/List.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import OwnerTabs from "./OwnerTabs";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaDoorOpen } from 'react-icons/fa';

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

        setRooms(response.data.content);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      }
    };

    if (user?.userId) {
      fetchRooms();
    }
  }, [user, accessToken]);

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
                    onClick={() => navigate(`/owner/room/${room.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="floating-add-button"
          onClick={() => navigate("/owner/room/add")}
        >
          Add New Room
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerRooms;
