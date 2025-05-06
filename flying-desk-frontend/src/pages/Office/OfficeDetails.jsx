import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';
import ImageZoom from "../../components/ImageZoom/ImageZoom";

const OfficeDetails = () => {
  const { id } = useParams(); 
  const [office, setOffice] = useState(null);
  const [rooms, setRooms] = useState([]); 
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/${id}` 
        );
        setOffice(response.data);
        setSelectedPhoto(response.data.photos?.[0]?.url || "https://via.placeholder.com/400");
      } catch (err) {
        setError("Failed to fetch office details.");
        console.error(err);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/${id}/desks` 
        );
        setRooms(response.data.content || []); 
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchOffice();
    fetchRooms();
  }, [id]);

  const generateGoogleMapsUrl = () => {
    if (!office || !office.address) return null;
    
    const fullAddress = `${office.address.address}, ${office.address.city.city}, ${office.address.country.country}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

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
        {/* Photo Section */}
        <div className="image-section">
          {office.photos && office.photos.length > 0 ? (
            <>
     <ImageZoom 
  src={selectedPhoto} 
  alt={`Main photo of ${office.building}`} 
/>
              <div className="thumbnail-section">
                {office.photos.map((photo, index) => (
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

        {/* Details Section */}
        <div className="details-section">
          <h2>{office.building}</h2>
          <hr />
          <p className="location">
            📍 {office.address.city.city}, {office.address.address}, {office.address.country.country}
          </p>

          <div className="details">
            <div className="detail-item">
              <span>Status</span>
              <strong>{office.status}</strong>
            </div>
        
            <div className="detail-item">
              <span>Created at</span>
              <strong>{new Date(office.creationDate).toLocaleDateString()}</strong>
            </div>
          </div>
          <hr />
          <p>{office.description}</p>
          <hr />
          <div className="price-section">
            <h3>Added by: User {office.userId} </h3>
          </div>
          <div className="buttons" >
        {generateGoogleMapsUrl() && (
          <a 
            href={generateGoogleMapsUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="create-button"
          >
            Open in Google Maps
          </a>
        )}
      </div>
        </div>
        
      </div>


      {/* Rooms Section */}
      <div className="rooms-section">
        <h2>Desks in this building</h2>
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
                  <h3 className="card-title">{room.desk}</h3>
                  <h4 className="card-title">{room.description}</h4>
                  <h2 className="card-title">{room.price} $/per hour</h2>
   
                  <Link to={`/desk/${room.id}`}>
                    <button className="purple-button card-button">View Details</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No desks available in this building.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeDetails;