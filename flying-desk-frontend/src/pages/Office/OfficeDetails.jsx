import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';
import ImageZoom from "../../components/ImageZoom/ImageZoom";
import { FaMapMarkerAlt, FaBuilding, FaDesktop, FaDoorOpen, FaRulerCombined, 
  FaUserFriends, FaDollarSign, FaInfoCircle, FaPhone, FaEnvelope } from 'react-icons/fa';

import Footer from "../../components/Footer/Footer";

const OfficeDetails = () => {
  const { id } = useParams(); 
  const [office, setOffice] = useState(null);
  const [rooms, setRooms] = useState([]); 
  const [desks, setDesks] = useState([]);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState("desks"); 

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
          `http://localhost:8081/api/v1/building/${id}/rooms` 
        );
        setRooms(response.data.content || []); 
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    const fetchDesks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/${id}/desks` 
        );
        setDesks(response.data.content || []); 
      } catch (err) {
        console.error("Failed to fetch desks:", err);
      }
    };

    fetchOffice();
    fetchRooms();
    fetchDesks();
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
            <FaMapMarkerAlt /> {office.address.city.city}, {office.address.address}, {office.address.country.country}
          </p>

          <div className="details">
            <div className="detail-item">
              <span>Type</span>
              <strong>{office.buildingType}</strong>
            </div>
            
            <div className="detail-item">
              <span>Status</span>
              <strong className={office.status === 'ACTIVE' ? 'active-status' : 'inactive-status'}>
                {office.status}
              </strong>
            </div>
            
            <div className="detail-item">
              <span>Floors</span>
              <strong>{office.totalFloors}</strong>
            </div>
            
            <div className="detail-item">
              <span>Elevator</span>
              <strong>{office.hasElevator ? "Yes" : "No"}</strong>
            </div>
            
            <div className="detail-item">
              <span>Parking</span>
              <strong>{office.hasParking ? "Yes" : "No"}</strong>
            </div>
            
            <div className="detail-item">
              <span>Created at</span>
              <strong>{new Date(office.creationDate).toLocaleDateString()}</strong>
            </div>
          </div>
          
          <hr />
          <h3>Description</h3>
          <p>{office.description}</p>
          
          <hr />
          <h3>Contact Information</h3>
          <div className="contact-info">
          <p><FaPhone /> <strong>{office.contactPhone}</strong></p>
          <p><FaEnvelope /> <strong>{office.contactEmail}</strong></p>
          </div>
          
          <div className="buttons">
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

      {/* Tabs for Rooms and Desks */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "desks" ? "active" : ""}`}
            onClick={() => setActiveTab("desks")}
          >
            <FaDesktop /> Desks
          </button>
          <button 
            className={`tab ${activeTab === "rooms" ? "active" : ""}`}
            onClick={() => setActiveTab("rooms")}
          >
            <FaDoorOpen /> Rooms
          </button>
        </div>
      </div>

      {/* Desks Section */}
      {activeTab === "desks" && (
        <div className="items-section">
          <h2>Available Desks</h2>
          <div className="ads-grid">
            {desks.length > 0 ? (
              desks.map((desk) => (
                <div className="office-card" key={desk.id}>
                  <div className="office-image">
                    <img
                      src={desk.photos?.[0]?.url || "https://via.placeholder.com/400"}
                      alt={desk.desk}
                    />
                    <div className={`status-badge ${desk.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                      {desk.status}
                    </div>
                  </div>
                  
                  <div className="office-content">
                    <h3>{desk.desk}</h3>
                    
                    <div className="office-info">
                      <p><FaInfoCircle /> {desk.description}</p>
                    </div>
                    
                    <div className="office-info">
                      <p><FaDesktop /> Equipment: {desk.equipment}</p>
                    </div>
                    
                    {desk.floorNumber && (
                      <div className="office-info">
                        <p><FaBuilding /> Floor: {desk.floorNumber}</p>
                      </div>
                    )}
                    
                    <div className="office-price">
                      <p><FaDollarSign /> {desk.price} $/per hour</p>
                    </div>
                    <hr></hr>
                    <div className="action-buttons">
                      <Link to={`/desk/${desk.id}`}>
                        <button className="primary-button">View Details</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No desks available in this building.</p>
            )}
          </div>
        </div>
      )}

      {/* Rooms Section */}
      {activeTab === "rooms" && (
        <div className="items-section">
          <h2>Available Rooms</h2>
          <div className="ads-grid">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div className="office-card" key={room.id}>
                  <div className="office-image">
                    <img
                      src={room.photos?.[0]?.url || "https://via.placeholder.com/400"}
                      alt={room.room}
                    />
                    <div className={`status-badge ${room.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                      {room.status}
                    </div>
                  </div>
                  
                  <div className="office-content">
                    <h3>{room.room}</h3>

                    <div className="office-info">
                      <p><FaInfoCircle /> {room.description}</p>
                    </div>
                    
                    <div className="office-info">
                      <p><FaBuilding /> Floor: {room.floorNumber}</p>
                    </div>
                    
                    {room.surface && (
                      <div className="office-info">
                        <p><FaRulerCombined /> Surface: {room.surface} m²</p>
                      </div>
                    )}
                    
                    {room.maxOccupants && (
                      <div className="office-info">
                        <p><FaUserFriends /> Max Occupants: {room.maxOccupants}</p>
                      </div>
                    )}
                    
                    <div className="office-info">
                      <p><FaDesktop /> Equipment: {room.equipment}</p>
                    </div>
                    
                    <div className="office-price">
                      <p><FaDollarSign /> {room.price} $/per hour</p>
                    </div>
                    <hr></hr>
                    <div className="action-buttons">
                      <Link to={`/room/${room.id}`}>
                        <button className="primary-button">View Details</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No rooms available in this building.</p>
            )}
          </div>
        </div>
      )}
    <Footer />
    </div>

    
  );
};

export default OfficeDetails;