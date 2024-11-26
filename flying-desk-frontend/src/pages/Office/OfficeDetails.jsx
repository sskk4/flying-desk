import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';

const OfficeDetails = () => {
  const { id } = useParams(); // Pobierz ID z URL
  const [office, setOffice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffice = async () => {
      const token = localStorage.getItem("accessToken"); // Pobierz token
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/${id}`, // Zmieniona ścieżka na "office"
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

      <div class="ad-container">
      <div class="image-section">
            {office.photoUrl && <img src={office.photoUrl} alt={office.name} class="main-image  " />}
            <div class="thumbnail-section">
                <img src="https://via.placeholder.com/100" alt="Thumbnail 1" class="thumbnail"/>
                <img src="https://via.placeholder.com/100" alt="Thumbnail 2" class="thumbnail"/>
                <img src="https://via.placeholder.com/100" alt="Thumbnail 3" class="thumbnail"/>
            </div>
        </div>

      <div class="details-section">
            <h2>{office.building}</h2>
            <hr />
            <p class="location">📍 Warszawa, ul. Mickiewicza 37/58</p>
            <div class="details">
                <div class="detail-item">
                    <span>Surface</span>
                    <strong>50m</strong>
                </div>
                <div class="detail-item">
                    <span>Rooms</span>
                    <strong>4</strong>
                </div>
                <div class="detail-item">
                    <span>Floor</span>
                    <strong>3</strong>
                </div>
                <div class="detail-item">
                    <span>Available from</span>
                    <strong>27.01.2024</strong>
                </div>
            </div>
            <div class="price-section">
            <p>{office.description}</p>
                <p class="price">10,000 PLN/miesiąc</p>
                <p class="note">Rent online is unavailable</p>
                <div class="buttons">
                    <button class="login-button wide" disabled>Rent</button>
                    <button class="create-button">Message</button>
                </div>
            </div>
        </div>

        </div>
    </div>
  );
};

export default OfficeDetails;
