import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const ManageAds = () => {
  const { user, accessToken } = useAuth();
  const { buildingId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setError("");
        
        const response = await axios.get(`http://localhost:8081/api/v1/building/${buildingId}/rooms`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setRooms(response.data.content);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms for this building.");
      }
    };
    fetchRooms();
  }, [accessToken, buildingId]);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <h2>Here you can manage your rooms in office id: {buildingId} </h2>
        <hr />
        <div className="manage-ads-buttons">
          <button className="tab-button" onClick={() => navigate("/owner")}>Offices</button>
          <button className="tab-button active">Rooms</button>
          <button className="tab-button">Desks</button>
        </div>
        <div className="ads-container">
          {rooms.map((room) => (
            <div key={room.id} className="ad-card">
              <div className="ad-details">
                <h3 className="ads-justify-title">{room.room}</h3>
                <hr />
                <p>Description: {room.description}</p>
                <p>Price: {room.price}</p>
                <p>Status: {room.status}</p>
                <hr />
                <button
                  className="create-button details-button"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="add-button"
          onClick={() => navigate(`/owner/office/${buildingId}/room/add`)}
        >
          Add Room
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAds;