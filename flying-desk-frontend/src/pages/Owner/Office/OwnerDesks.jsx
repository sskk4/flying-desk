import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const ManageAds = () => {
  const { user, accessToken } = useAuth();
  const { buildingId } = useParams();
  const [desks, setDesks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setError("");
        
        const response = await axios.get(`http://localhost:8081/api/v1/building/${buildingId}/desks`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setDesks(response.data.content);
      } catch (err) {
        console.error("Error fetching desks:", err);
        setError("Failed to load desks for this building.");
      }
    };
    fetchDesks();
  }, [accessToken, buildingId]);

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <h2>Here you can manage your desks in office id: {buildingId} </h2>
        <hr />
        <div className="manage-ads-buttons">
          <button className="tab-button"  onClick={() => navigate("/owner")}>Offices</button>
          <button className="tab-button">Rooms</button>
          <button className="tab-button active">Desks</button>
        </div>
        <div className="ads-container">
          {desks.map((desk) => (
            <div key={desk.id} className="ad-card">
              <div className="ad-details">
                <h3 className="ads-justify-title">{desk.desk}</h3>
                <hr />
                <p>Description: {desk.description}</p>
                <p>Price: {desk.price}</p>
                <p>Status: {desk.status}</p>
                <hr />
                <button
                  className="create-button details-button"
                  onClick={() => navigate(`/desk/${desk.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="add-button"
          onClick={() => navigate(`/owner/office/${buildingId}/desk/add`)}
        >
          Add Desk
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAds;
