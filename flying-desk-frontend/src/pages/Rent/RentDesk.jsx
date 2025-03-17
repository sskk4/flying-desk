import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import "../../styles/Rent.css";
import Footer from "../../components/Footer/Footer";
import Header from '../../components/Header/Header';
import CheckBox from '../../components/CheckBox/CheckBox';

import desk1 from "../../assets/png/desk.png";
import desk2 from "../../assets/png/desk2.png";

const RentDeskContainer = () => {
    const { deskid } = useParams(); // Pobranie ID biurka z URL
    const [desk, setDesk] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState("");

    useEffect(() => {
        const fetchDesk = async () => {
          try {
            const response = await axios.get(`http://localhost:8081/api/v1/building/desk/${deskid}`);
            setDesk(response.data);
            setSelectedPhoto(response.data.photos?.[0]?.url || "https://via.placeholder.com/400");
          } catch (err) {
            console.error("Błąd pobierania danych biurka:", err);
          }
        };
    
        fetchDesk();
      }, [deskid]);
    
      if (!desk) {
        return <p>Ładowanie danych...</p>;
      }


  return (
    <div> 
        <Header />
    
        <div className="desk-container">
            <div className="desk-header">

        
            <h1>Rent <span className="highlight">desk</span></h1> 
            <img src={desk2} alt="Desk" className="rent-desk"/>

            </div>
            <Link to={`/desk/${deskid}`}>
            <div className="desk-info">
                <div className="desk-image">
                    
                </div>
                <div className="desk-details">
                <p><strong>Desk name</strong><br></br> {desk.desk}</p><br></br> 
            <p><strong>Office name</strong><br></br> {desk.building?.building}</p><br></br> 
            <p><strong>Location</strong><br></br> {desk.building?.address?.address}, {desk.building?.address?.city?.city}, {desk.building?.address?.country?.country}</p>
            <img
            src={selectedPhoto}
            alt={`${desk.desk}`}
            className="rent-desk" />
                </div>
            </div>
            </Link>

            <div className="date-section">
                <label>Rent start date</label>
                <div className="date-inputs">
                    <input type="text" className="date-box" />
                    <input type="text" className="small-box" />
                    <input type="text" className="small-box" />
                </div>
                
                <label>Rent end date</label>
                <div className="date-inputs">
                    <input type="text" className="date-box" />
                    <input type="text" className="small-box" />
                    <input type="text" className="small-box" />
                </div>
            </div>

            <div className="payment-section">
                <label>Payment method</label>
                <input type="text" className="payment-box" />
                <p className="amount">Amount: 70.00$</p>
            </div>

            <button className="login-button width">Confirm</button>
            <button className="create-button">Back</button>
        </div>

        <Footer />
    </div>
  );
};

export default RentDeskContainer;
