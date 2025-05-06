import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import OwnerTabs from "./OwnerTabs";
import "../../../styles/Owner/List.css";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaBuilding, FaDesktop, FaDoorOpen } from 'react-icons/fa';

const ManageAds = () => {
  const { user, accessToken } = useAuth();
  const [ads, setAds] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Offices");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/building/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId,
          },
        });

        console.log("Fetched ads:", response.data.content);
        setAds(response.data.content);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setError("Failed to load ads. Please try again later.");
      }
    };

    if (user?.userId) {
      fetchAds();
    }
  }, [user, accessToken]);




  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <h2>Here you can manage your offices ads</h2>
        <hr />
        <div className="manage-ads-tabs">
        <OwnerTabs />
        </div>
        
        <div className="ads-grid">
          {ads.map((ad) => (
            <div key={ad.id} className="office-card">
              <div className="office-image">
                <img src={ad.photos?.[0]?.url } alt={`Office at ${ad.address?.address}`} />
                <div className={`status-badge ${ad.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                  {ad.status}
                </div>
              </div>
              
              <div className="office-content">
                <h3>{ad.building || `Office ${ad.id}`}</h3>
                
                <div className="office-address">
                  <FaMapMarkerAlt />
                  <p>{ad.address?.address}, {ad.address?.city?.city}, {ad.address?.city?.country?.country}</p>
                </div>
                
                <div className="approval-status">
                  <span>Approval Status:</span>
                  {ad.isApproved ? 
                    <span className="approved"><FaCheck /> Approved</span> : 
                    <span className="not-approved"><FaTimes /> Not Approved</span>
                  }
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="primary-button"
                    onClick={() => navigate(`/office/${ad.id}`)}
                  >
                    View Details
                  </button>
       
                  
                  <div className="button-groups">
                    <div className="button-group">
                      <h4><FaDesktop /> Desks</h4>
                      <div className="group-buttons">
                        <button onClick={() => navigate(`/owner/office/${ad.id}/desk/add`)}>
                          Add Desk
                        </button>
                        <button onClick={() => navigate(`/owner/office/${ad.id}/desks`)}>
                          Manage Desks
                        </button>
                      </div>
                    </div>
                    
                    <div className="button-group">
                      <h4><FaDoorOpen /> Rooms</h4>
                      <div className="group-buttons">
                        <button onClick={() => navigate(`/owner/office/${ad.id}/room/add`)}>
                          Add Room
                        </button>
                        <button onClick={() => navigate(`/owner/office/${ad.id}/rooms`)}>
                          Manage Rooms
                        </button>
                      </div>
                    </div>
                    <button 
                    className="create-button"
                    onClick={() => navigate(`/owner/office/${ad.id}/manage`)}
                  >
                    Manage
                  </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          className="floating-add-button"
          onClick={() => navigate("/owner/office/add")}
        >
           Place New Office Ad
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAds;