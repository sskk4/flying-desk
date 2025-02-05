import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const DeskDetails = () => {
  const { id } = useParams(); 
  const [desk, setDesk] = useState(null);
  const [rooms, setRooms] = useState([]); 
  const [building, setBuilding] = useState(null);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  

  useEffect(() => {
    const fetchDesk = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/desk/${id}`);
        setDesk(response.data);
        setSelectedPhoto(response.data.photos?.[0]?.url || "https://via.placeholder.com/400");

        // Po pobraniu biurka, pobierz budynek i pokoje
        if (response.data.building?.id) {
          fetchBuilding(response.data.building.id);
          fetchRooms(response.data.building.id);
        }
      } catch (err) {
        setError("Failed to fetch desk details.");
        console.error(err);
      }
    };

    const fetchBuilding = async (buildingId) => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/${buildingId}`);
        setBuilding(response.data);
      } catch (err) {
        setError("Failed to fetch building details.");
        console.error(err);
      }
    };

    const fetchRooms = async (buildingId) => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/${buildingId}/rooms`);
        setRooms(response.data.content || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchDesk();
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!desk || !building) {
    return <p>Loading desk details...</p>;
  }

  return (
    <div>
      <Header />

      <div className="ad-container">
        {/* 🔹 Sekcja zdjęć */}
        <div className="image-section">
          <img
            src={selectedPhoto}
            alt={`Main photo of ${desk.desk}`}
            className="main-image"
          />
          <div className="thumbnail-section">
            {desk.photos?.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${selectedPhoto === photo.url ? "active" : ""}`}
                onClick={() => setSelectedPhoto(photo.url)} // 🔥 Obsługa kliknięcia
              />
            ))}
          </div>
        </div>

        {/* Sekcja szczegółów biurka */}
        <div className="details-section">
          <h2>{desk.desk}</h2>
          <hr />
          <p className="location">
            📍 {building.address.city.city}, {building.address.address}, {building.address.country.country}
          </p>
          <div className="details">
            <div className="detail-item">
              <span>Equipment</span>
              <strong>{desk.equipment}</strong>
            </div>
            <div className="detail-item">
              <span>Price</span>
              <strong>${desk.price} / hour</strong>
            </div>
            <div className="detail-item">
              <span>Status</span>
              <strong>{desk.status}</strong>
            </div>
            <div className="detail-item">
              <span>Available from</span>
              <strong>{new Date(desk.creationDate).toLocaleDateString()}</strong>
            </div>
          </div>
          <hr />
          <p>{desk.description}</p>
          <hr />
          <div className="price-section">
            <p className="note">Rent online is {building.status}</p>
            <div className="buttons">
              <button className="login-button wide" disabled>
                Rent
              </button>
              <button className="create-button">Message</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Sekcja informacji o budynku */}
      <div className="building-section">
        <h2 className="owner-title">Building Information</h2>
        <div className="building-details">
          <h3>{building.building}</h3>
          <p>{building.description}</p>
          <p>
            📍 {building.address.city.city}, {building.address.address}, {building.address.country.country}
          </p>
          <div className="details">
            <div className="detail-item">
              <span>Approved</span>
              <strong>{building.isApproved ? "Yes" : "No"}</strong>
            </div>
            <div className="detail-item">
              <span>Status</span>
              <strong>{building.status}</strong>
            </div>
            <div className="detail-item">
              <span>Added by</span>
              <strong>User ID: {building.userId}</strong>
            </div>
            <div className="detail-item">
              <span>Created at</span>
              <strong>{new Date(building.creationDate).toLocaleDateString()}</strong>
            </div>
            <div className="detail-item">
              <span>Last edited</span>
              <strong>{new Date(building.editDate).toLocaleDateString()}</strong>
            </div>
          </div>
          {/* Zdjęcia budynku */}
          <div className="building-photos">
            <h3>Building Photos</h3>
            {building.photos && building.photos.length > 0 ? (
              <div className="photo-grid">
                {building.photos.map((photo, index) => (
                  <img key={index} src={photo.url} alt={`Building ${index + 1}`} className="building-photo" />
                ))}
              </div>
            ) : (
              <p>No photos available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sekcja wyświetlania pokoi */}
      <div className="building-section">
        <h2 className="owner-title">Rooms in building</h2>
        <div className="card-container">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="card" key={room.id}>
                <div className="card-image">
                  <img
                    src={room.photos?.[0]?.url || "https://via.placeholder.com/400"}
                    alt={room.room}
                    className="card-img"
                  />
                  <h3 className="card-title">{room.room}</h3>
                  <p className="card-description">{room.description}</p>
                  <Link to={`/room/${room.id}`}>
                    <button className="purple-button card-button">View Details</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms available in this building.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeskDetails;
