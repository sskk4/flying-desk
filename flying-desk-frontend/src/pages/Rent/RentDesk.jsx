import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider";

import "../../styles/Rent.css";
import Footer from "../../components/Footer/Footer";
import Header from '../../components/Header/Header';
import CheckBox from '../../components/CheckBox/CheckBox';
import desk1 from "../../assets/png/desk.png";
import desk2 from "../../assets/png/desk2.png";


const RentDeskContainer = () => {
    const { deskid } = useParams();
    const navigate = useNavigate();
    const { accessToken, user } = useAuth(); 
    const [desk, setDesk] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
        paymentMethod: "",
    });
    const [price, setPrice] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [commission, setCommission] = useState(1.1); 
    const [dateError, setDateError] = useState("");

    const getCurrentDateString = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

    useEffect(() => {
        const fetchDesk = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building/desk/${deskid}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                setDesk(response.data);
                setSelectedPhoto(response.data.photos?.[0]?.url || "https://via.placeholder.com/400");
            } catch (err) {
                console.error("Błąd pobierania danych biurka:", err);
                setError("Nie można załadować danych biurka");
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchDesk();
        }
    }, [deskid, accessToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        setDateError("");
    };

    const validateDates = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDate = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDate = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          setDateError("Please enter valid dates and times");
          return false;
      }
      
      const startDateOnly = new Date(formData.startDate);
      startDateOnly.setHours(0, 0, 0, 0);
      
      if (startDateOnly < today) {
          setDateError("Start date cannot be in the past");
          return false;
      }
      
      if (formData.endDate < formData.startDate) {
          setDateError("End date cannot be before start date");
          return false;
      }
      
      if (formData.startDate === formData.endDate && formData.endTime <= formData.startTime) {
          setDateError("End time must be after start time");
          return false;
      }
      
      setDateError("");
      return true;
  };

    const calculatePrice = () => {
        if (!desk || !formData.startDate || !formData.endDate) {
            return;
        }

        if (!validateDates()) {
            return;
        }

        const hourlyRate = desk.price || 70.00;
        
        const startDate = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDate = new Date(`${formData.endDate}T${formData.endTime}`);
        
        const startHour = parseInt(formData.startTime.split(':')[0]);
        const startMinute = parseInt(formData.startTime.split(':')[1]);
        const endHour = parseInt(formData.endTime.split(':')[0]);
        const endMinute = parseInt(formData.endTime.split(':')[1]);

        const startDateOnly = new Date(formData.startDate);
        const endDateOnly = new Date(formData.endDate);
        const diffTime = Math.abs(endDateOnly - startDateOnly);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let totalHours = 0;
        
        if (diffDays === 0) {
            const hoursDiff = endHour - startHour;
            const minutesDiff = (endMinute - startMinute) / 60;
            totalHours = hoursDiff + minutesDiff;
        } else {
            const hoursPerDay = (endHour + endMinute/60) - (startHour + startMinute/60);
            totalHours = hoursPerDay * (diffDays + 1); 
        }
        
        if (totalHours <= 0) {
            totalHours = 1; 
        }
        
        const totalPrice = totalHours * hourlyRate * commission;
        setPrice(parseFloat(totalPrice.toFixed(2)));
    };

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            calculatePrice();
        }
    }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime, desk]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.startDate || !formData.endDate || !formData.paymentMethod) {
            setError("Proszę wypełnić wszystkie pola");
            return;
        }
        
        if (!validateDates()) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            
            const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
            
            const payload = {
                userId: user?.userId || 1, 
                officeId: desk.building?.id || 101,
                deskId: parseInt(deskid),
                rentType: "DESK",
                startDate: startDateTime,
                endDate: endDateTime,
                price: price,
                status: "PENDING"
            };
            
            const response = await axios.post('http://localhost:8083/api/v1/rent', payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-User-Id": user?.userId
                }
            });
            
            console.log("Rezerwacja wysłana pomyślnie:", response.data);
            
            navigate('/profile/rentals'); 
            
        } catch (err) {
            console.error("Błąd podczas składania rezerwacji:", err);
            setError("Nie udało się złożyć rezerwacji. Spróbuj ponownie później.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    if (error && !desk) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div>
            <Header />
            <div className="desk-container">
                <div className="desk-header">
                    <h1>Rent <span className="highlight">desk</span></h1>
                    <img src={desk2} alt="Desk" className="rent-desk" />
                </div>
                
                <Link to={`/desk/${deskid}`}>
                    <div className="desk-info">
                        <div className="desk-image"></div>
                        <div className="desk-details">
                            <p><strong>Desk name</strong><br></br> {desk.desk}</p><br></br>
                            <p><strong>Office name</strong><br></br> {desk.building?.building}</p><br></br>
                            <p><strong>Location</strong><br></br> {desk.building?.address?.address}, {desk.building?.address?.city?.city}, {desk.building?.address?.country?.country}</p>
                            <img
                                src={selectedPhoto}
                                alt={`${desk.desk}`}
                                className="rent-desk" 
                            />
                        </div>
                    </div>
                </Link>

                <form onSubmit={handleSubmit}>
                    <div className="date-section">
                        <label>Rent start and end date</label>
                        <div className="date-inputs">
                        <input 
                            type="date" 
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            min={getCurrentDateString()}
                            className="date-box" 
                        />

                        <input 
                            type="date" 
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            min={formData.startDate || getCurrentDateString()}
                            className="date-box" 
                        />
                            
                        </div>
                        
                        <label>Rent start and end time</label>
                        <div className="date-inputs">
                            <input 
                                type="time" 
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="small-box" 
                            />
                            <input 
                                type="time" 
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="small-box" 
                            />
                        </div>
                        
                        {dateError && <p className="error-message">{dateError}</p>}
                    </div>

                    <div className="payment-section">
                        <label>Payment method</label> <br></br>
                        <select 
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            className="payment-box"
                        >
                            <option value="">Select payment method</option>
                            <option value="CARD">Credit/Debit Card</option>
                            <option value="PAYPAL">PayPal</option>
                            <option value="TRANSFER">Bank Transfer</option>
                        </select>
                        <p className="amount">Amount: {price > 0 ? price.toFixed(2) : '0.00'}$</p>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="login-button width" 
                        disabled={submitting || dateError}
                    >
                        {submitting ? "Processing..." : "Confirm"}
                    </button>
                    <button 
                        type="button" 
                        className="create-button"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default RentDeskContainer;