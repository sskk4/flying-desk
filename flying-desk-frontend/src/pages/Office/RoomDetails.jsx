import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';

const RoomsDetails = () => {
  const { id } = useParams(); 
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/room/${id}` 
        );
        setRoom(response.data);
      } catch (err) {
        setError("Failed to fetch room details.");
        console.error(err);
      }
    };

    fetchRoom();
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!room) {
    return <p>Loading room details...</p>;
  }

  return (
    <div>
      <Header />

      <div className="ad-container">
        {/* Sekcja zdjęć */}
        <div className="image-section">
          {room.photos && room.photos.length > 0 ? (
            <>
              <img
                src={room.photos[0].url}
                alt={`Main photo of ${room.room}`}
                className="main-image"
              />
              <div className="thumbnail-section">
                {room.photos.slice(1).map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                  />
                ))}
              </div>
            </>
          ) : (
            <p>No photos available.</p>
          )}
        </div>

        {/* Sekcja szczegółów */}
        <div className="details-section">
          <h2>{room.room}</h2>
          <hr />
          <p className="location">
            📍 {room.building.building || "N/A"}
          </p>
          <div className="details">
            <div className="detail-item">
              <span>Equipment</span>
              <strong>{room.equipment || "No info"}</strong>
            </div>
            <div className="detail-item">
              <span>Max Occupants</span>
              <strong>{room.maxOccupants}</strong>
            </div>
            <div className="detail-item">
              <span>Status</span>
              <strong>{room.status}</strong>
            </div>
            <div className="detail-item">
              <span>Approved</span>
              <strong>{room.isApproved ? "Yes" : "No"}</strong>
            </div>
            <div className="detail-item">
              <span>Available from</span>
              <strong>{room.creationDate}</strong>
            </div>
          </div>
          <hr />
          <p>{room.description}</p>
          <hr />
          <div className="price-section">
            <p className="note">Rent online status: {room.status}</p>
            <div className="buttons">
              <button className="login-button wide" disabled>
                Rent
              </button>
              <button className="create-button">Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsDetails;
