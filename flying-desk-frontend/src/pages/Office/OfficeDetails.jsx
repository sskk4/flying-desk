import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';

const OfficeDetails = () => {
  const { id } = useParams(); // Pobierz ID z URL
  const [office, setOffice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchOffice();
  }, [id]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!office) {
    return <p>Loading office details...</p>;
  }

  return (
    <div>
      <Header />

      <div className="ad-container">
        {/* Sekcja zdjęć */}
        <div className="image-section">
          {office.photos && office.photos.length > 0 ? (
            <>
              <img
                src={office.photos[0].url}
                alt={`Main photo of ${office.building}`}
                className="main-image"
              />
              <div className="thumbnail-section">
                {office.photos.slice(1).map((photo, index) => (
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
          <h2>{office.building}</h2>
          <hr />
          <p className="location">
            📍 {office.address.city.city}, {office.address.address}, {office.address.country.country}
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
          <hr></hr>
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
    </div>
  );
};

export default OfficeDetails;
