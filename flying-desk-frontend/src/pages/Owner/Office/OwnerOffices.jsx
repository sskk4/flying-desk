import React, { useState, useEffect } from "react";
import { useAuth } from "../../../services/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const ManageAds = () => {
  const { user, accessToken } = useAuth();
  const [ads, setAds] = useState([]);
  const [error, setError] = useState("");
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
        <h2>Here you can manage your office ads</h2>
        <hr />
        <div className="manage-ads-buttons">
          <button className="tab-button active">Offices</button>
          <button className="tab-button">Rooms</button>
          <button className="tab-button">Desks</button>
        </div>
        <div className="ads-container">
          {ads.map((ad) => (
            <div key={ad.id} className="ad-card">
              <div className="ad-details">
                <h3 className="ads-justify-title">{ad.building}</h3>
                <hr />
                <p>
                  {ad.address.address}, {ad.address.city.city},{" "}
                  {ad.address.city.country.country}
                </p>
                <p>Status: {ad.status}</p>
                <p>Approved: {ad.isApproved ? "Yes" : "No"}</p>
                <hr />
                <button
                  className="create-button details-button"
                  onClick={() => navigate(`/office/${ad.id}`)}
                >
                  Details
                </button>
                <button
                  className="create-button details-button"
                  onClick={() => navigate(`/owner/office/${ad.id}/desk/add`)}
                >
                  Add Desk 
                </button>
                <button
                  className="create-button details-button"
                  onClick={() => navigate(`/owner/office/${ad.id}/desks`)}
                >
                  Desks in office
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="add-button"
          onClick={() => navigate("/owner/office/add")}
        >
          Place an ad
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAds;
