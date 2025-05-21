import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider";
import { Calendar, Clock } from "react-feather";
import "../../components/Ad/Ad.css";
import "../../components/Ad/AdCard.css";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const DeskDetails = () => {
  const { id } = useParams();
  const { accessToken, user } = useAuth();
  const [desk, setDesk] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [building, setBuilding] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  useEffect(() => {
    const fetchDesk = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/building/desk/${id}`);
        setDesk(response.data);
        
        const allPhotos = [
          ...(response.data.photos || []),
          ...(response.data.building?.photos || [])
        ];
        
        setSelectedPhoto(allPhotos[0]?.url || "https://via.placeholder.com/400");

        if (response.data.building?.id) {
          fetchBuilding(response.data.building.id);
          fetchRooms(response.data.building.id);
        }
        
        fetchAvailability(id);
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

    const fetchAvailability = async (deskId) => {
      try {
        const response = await axios.get(
          `http://localhost:8083/api/v1/availability/resource?type=DESK&resourceId=${deskId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-User-Id": user?.userId
            }
          }
        );
        setAvailabilityData(response.data || []);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    };

    fetchDesk();
  }, [id, accessToken, user?.userId]);

  const formatDayName = (dayCode) => {
    const days = {
      MONDAY: "Mon",
      TUESDAY: "Tue",
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun"
    };
    return days[dayCode] || dayCode;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); 
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!desk || !building) {
    return <p>Loading desk details...</p>;
  }

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
              <span>Created </span>
              <strong>{new Date(desk.creationDate).toLocaleDateString()}</strong>
            </div>
          </div>
          <hr />
          <p>{desk.description}</p>
          <hr />
          
          <div className="availability-section">
            <h3><Calendar size={10} className="icon" /> Availability Schedule</h3>
            {availabilityData.length > 0 ? (
              <div className="schedule-container">
                {availabilityData.map((schedule, index) => (
                  <div key={index} className="schedule-card">
                    <div className="schedule-date-range">
                      <span>
                        {formatDate(schedule.availableFrom)} - {formatDate(schedule.availableTo)}
                      </span>
                    </div>
                    
                    <div className="days-container">
                      {schedule.availableDaysWithHours && schedule.availableDaysWithHours.map((dayData) => (
                        <div key={dayData.dayId} className="day-item">
                          <div className="day-name">{formatDayName(dayData.dayOfWeek)}</div>
                          <div className="time-slots-container">
                            {dayData.timeSlots.map((slot) => (
                              <div key={slot.id} className="time-slot-pill">
                                <Clock size={12} className="time-icon" />
                                <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-availability">No availability information available at the moment.</p>
            )}
          </div>
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

      <Footer />
    </div>
  );
};

export default DeskDetails;