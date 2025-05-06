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
        
        // Prioritize desk photos, then building photos
        const allPhotos = [
          ...(response.data.photos || []),
          ...(response.data.building?.photos || [])
        ];
        
        setSelectedPhoto(allPhotos[0]?.url || "https://via.placeholder.com/400");

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

  // Combine and deduplicate photos from desk and building
  const allPhotos = [
    ...(desk.photos || []),
    ...(building.photos || [])
  ].filter((photo, index, self) => 
    index === self.findIndex((p) => p.url === photo.url)
  );

  return (
    <div>
      <Header />

      <div className="ad-container">
        {/* Photo Section */}
        <div className="image-section">
          {allPhotos.length > 0 ? (
            <>
              <img
                src={selectedPhoto}
                alt={`Main photo of ${building.building}`}
                className="main-image"
              />
              <div className="thumbnail-section">
                {allPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${selectedPhoto === photo.url ? "active" : ""}`}
                    onClick={() => setSelectedPhoto(photo.url)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>No photos available.</p>
          )}
        </div>

        {/* Rest of the component remains the same */}
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
            <div>
              <Link className="buttons" to={`/desk/${id}/rent`}>
                <button className="login-button wide">Rent</button> 
              </Link>
              <Link to={`/office/${building.id}`}>
                <button className="create-button">View Building Details</button> 
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* The rest of the component remains unchanged */}
      {/* ... (Building section, Rooms section, etc.) ... */}

      <Footer />
    </div>
  );
};

export default DeskDetails;