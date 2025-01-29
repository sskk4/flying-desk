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
  const [office, setOffice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDesk = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/desk/${id}` 
        );
        setDesk(response.data);
      } catch (err) {
        setError("Failed to fetch desk details.");
        console.error(err);
      }
    };


    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/${id}/rooms` 
        );
        setRooms(response.data.content || []); // Pobranie pokoi
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    const fetchOffice = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/v1/building/${id}` // Pobieranie danych budynku
          );
          setOffice(response.data);
        } catch (err) {
          setError("Failed to fetch office details.");
          console.error(err);
        }
      };

    fetchDesk();
    fetchOffice();
    fetchRooms();
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!desk) {
    return <p>Loading desk details...</p>;
  }

  return (
    <div>
      <Header />

      <div className="ad-container">
        {/* Sekcja zdjęć */}
        <div className="image-section">
          {desk.photos && desk.photos.length > 0 ? (
            <>
              <img
                src={desk.photos[0].url}
                alt={`Main photo of ${desk.desk}`}
                className="main-image"
              />
              <div className="thumbnail-section">
                {desk.photos.slice(1).map((photo, index) => (
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
          <h2>{desk.desk}</h2>
          <hr />
          <p className="location">
            📍 {desk.building.address.city.city}, {desk.building.address.address}, {desk.building.address.country.country}
          </p>
          <div className="details">
            <div className="detail-item">
              <span>Surface</span>
              <strong>50m²</strong>
            </div>
            <div className="detail-item">
              <span>Rooms</span>
              <strong>4</strong>
            </div>
            <div className="detail-item">
              <span>Desks</span>
              <strong>3</strong>
            </div>
            <div className="detail-item">
              <span>Available from</span>
              <strong>{office.creationDate}</strong>
            </div>
          </div>
          <hr />
          <p>{office.description}</p>
          <hr />
          <div className="price-section">
            <p className="note">Rent online is {office.status}</p>
            <div className="buttons">
              <button className="login-button wide" disabled>
                Rent
              </button>
              <button className="create-button">Message</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sekcja wyświetlania pokoi */}
      <div className="rooms-section">
        <h2>Rooms in this building</h2>
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
