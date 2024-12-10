//pages/Office/OfficeList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer"
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';
import "../../components/Card/Card.css"

const OfficeList = () => {

    const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuildings = async () => {
      const token = localStorage.getItem("accessToken"); // Pobierz token
      try {
        const response = await axios.get("http://localhost:8081/api/v1/building", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBuildings(response.data);
      } catch (err) {
        setError("Failed to fetch buildings.");
        console.error(err);
      }
    };

    fetchBuildings();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!buildings.length) {
    return <p>Loading buildings...</p>;
  }

    return (
    <div> 
        <Header />
        <SearchBar />

        <div className="card-container">
      {buildings.map((building) => (
        <div className="card" key={building.id}>
          <div className="card-image">
            <img
              className="card-img"
              src={building.photoUrl || "https://via.placeholder.com/400"}
              alt={building.building}
            />
          </div>
          <div className="card-title">{building.building}</div>
          <div className="card-star">
            <span>☆</span>
          </div>
          <div className="card-price">
            <span className="card-small-text">Monthly</span>
            <span className="card-price-text">
              10$
            </span>
          </div>
          <Link to={`/office/${building.id}`}>
        <button className="purple-button card-button">Check</button>
        </Link>
          <div className="card-status">
          Available Online
          </div>
        </div>
      ))}
    </div>

      <Footer />
    </div>
    );
};

export default OfficeList;