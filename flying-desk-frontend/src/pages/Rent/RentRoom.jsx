import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider";
import { Calendar, Clock, User, DollarSign, Users, Square } from "react-feather"; 

import "../../styles/Rent.css";
import Footer from "../../components/Footer/Footer";
import Header from '../../components/Header/Header';
import room2 from "../../assets/png/desk.png"; 
const RentRoomContainer = () => {
    const { roomid } = useParams();
    const navigate = useNavigate();
    const { accessToken, user } = useAuth(); 
    
    const [room, setRoom] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState("");
    const [availabilityData, setAvailabilityData] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    
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
    const [availabilityResult, setAvailabilityResult] = useState(null);
    const [availabilityChecked, setAvailabilityChecked] = useState(false);
    const [availabilityCheckLoading, setAvailabilityCheckLoading] = useState(false);
    
    const getCurrentDateString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

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

    const formatTime = (timeString) => {
        if (!timeString) return "";
        return timeString.substring(0, 5);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };
    

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        const date = new Date(dateTimeString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    useEffect(() => {
        const fetchRoomAndAvailability = async () => {
            try {
                const roomResponse = await axios.get(`http://localhost:8081/api/v1/building/room/${roomid}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setRoom(roomResponse.data);
                setSelectedPhoto(roomResponse.data.photos?.[0]?.url || "https://via.placeholder.com/400");

                const availabilityResponse = await axios.get(`http://localhost:8083/api/v1/availability/resource`, {
                    params: { type: "ROOM", resourceId: parseInt(roomid) },
                    headers: { 
                        Authorization: `Bearer ${accessToken}`, 
                        "X-User-Id": user?.userId 
                    }
                });
                
                if (availabilityResponse.data?.length > 0) {
                    setAvailabilityData(availabilityResponse.data[0]);
                }
                
                const rentalHistoryResponse = await axios.get(`http://localhost:8083/api/v1/rent/resource`, {
                    params: { resourceType: "ROOM", resourceId: parseInt(roomid) },
                    headers: { 
                        Authorization: `Bearer ${accessToken}`, 
                        "X-User-Id": user?.userId 
                    }
                });
                
                if (rentalHistoryResponse.data) {
                    setRentalHistory(rentalHistoryResponse.data);
                }
            } catch (err) {
                console.error("Error loading room or availability data:", err);
                setError("Unable to load room or availability data");
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchRoomAndAvailability();
        }
    }, [roomid, accessToken, user?.userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "startDate") {
            setFormData({
                ...formData,
                startDate: value,
                endDate: value
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        
        setDateError("");
        setAvailabilityChecked(false);
        setAvailabilityResult(null);
    };

    const validateDates = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
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
        
        if (availabilityData?.availableDaysWithHours?.length > 0) {
            const startDay = new Date(formData.startDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            const endDay = new Date(formData.endDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            
            const startDayAvailability = availabilityData.availableDaysWithHours.find(day => day.dayOfWeek === startDay);
            if (!startDayAvailability) {
                setDateError(`No availability for ${startDay}`);
                return false;
            }
            
            if (startDay !== endDay) {
                const endDayAvailability = availabilityData.availableDaysWithHours.find(day => day.dayOfWeek === endDay);
                if (!endDayAvailability) {
                    setDateError(`No availability for ${endDay}`);
                    return false;
                }
            }
            
            const isWithinSlot = startDayAvailability.timeSlots.some(slot => {
                const slotStart = new Date(`${formData.startDate}T${slot.startTime}`);
                const slotEnd = new Date(`${formData.startDate}T${slot.endTime}`);
                return startDateTime >= slotStart && endDateTime <= slotEnd;
            });
            
            if (!isWithinSlot) {
                setDateError(`Room is available only during defined hours`);
                return false;
            }
        }
        
        setDateError("");
        return true;
    };

    const checkAvailability = async () => {
        if (!validateDates()) {
            return false;
        }
    
        setAvailabilityCheckLoading(true);
        
        try {
            const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.startDate}T${formData.endTime}:00`;

            if (!availabilityData) {
                const availabilityResponse = await axios.get(
                    "http://localhost:8083/api/v1/availability/resource", {
                        params: {
                            type: "ROOM",
                            resourceId: parseInt(roomid)
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "X-User-Id": user?.userId
                        }
                    }
                );
    
                if (!availabilityResponse.data || availabilityResponse.data.length === 0) {
                    setAvailabilityResult("NO_AVAILABILITY_DEFINED");
                    setAvailabilityChecked(true);
                    return false;
                }
                
                setAvailabilityData(availabilityResponse.data[0]);
            }
    
            const startDay = new Date(formData.startDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            
            const dayAvailability = availabilityData.availableDaysWithHours.find(day => day.dayOfWeek === startDay);
            if (!dayAvailability) {
                setAvailabilityResult("OUTSIDE_AVAILABILITY_SCHEDULE");
                setAvailabilityChecked(true);
                return false;
            }
            
            const startDateObj = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateObj = new Date(`${formData.startDate}T${formData.endTime}`);
            
            const isTimeSlotAvailable = dayAvailability.timeSlots.some(slot => {
                const slotStart = new Date(`${formData.startDate}T${slot.startTime}`);
                const slotEnd = new Date(`${formData.startDate}T${slot.endTime}`);
                return startDateObj >= slotStart && endDateObj <= slotEnd;
            });
            
            if (!isTimeSlotAvailable) {
                setAvailabilityResult("OUTSIDE_AVAILABILITY_SCHEDULE");
                setAvailabilityChecked(true);
                return false;
            }

            const conflictingRental = rentalHistory.find(rental => {
                const rentalStart = new Date(rental.startDate);
                const rentalEnd = new Date(rental.endDate);
                return (
                    (startDateObj >= rentalStart && startDateObj < rentalEnd) ||
                    (endDateObj > rentalStart && endDateObj <= rentalEnd) ||
                    (startDateObj <= rentalStart && endDateObj >= rentalEnd)
                );
            });

            if (conflictingRental) {
                setAvailabilityResult("CONFLICT_WITH_EXISTING_RENT");
                setAvailabilityChecked(true);
                return false;
            }
            
            setAvailabilityResult("AVAILABLE");
            setAvailabilityChecked(true);
            return true;
        } catch (err) {
            console.error("Error checking availability:", err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Could not check availability. Please try again.");
            }
            
            setAvailabilityResult("ERROR");
            setAvailabilityChecked(true);
            return false;
        } finally {
            setAvailabilityCheckLoading(false);
        }
    };

    const calculatePrice = () => {
        if (!room || !formData.startDate || !formData.endDate) {
            return;
        }

        if (!validateDates()) {
            return;
        }

        const hourlyRate = room.price || 100.00;
        
        const startHour = parseInt(formData.startTime.split(':')[0]);
        const startMinute = parseInt(formData.startTime.split(':')[1]);
        const endHour = parseInt(formData.endTime.split(':')[0]);
        const endMinute = parseInt(formData.endTime.split(':')[1]);

        const startDateObj = new Date(formData.startDate);
        const endDateObj = new Date(formData.endDate);
        const diffTime = Math.abs(endDateObj - startDateObj);
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
    }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime, room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted - starting processing");
        
        if (!formData.startDate || !formData.paymentMethod) {
            setError("Please fill in all fields");
            return;
        }
        
        if (!validateDates()) {
            return;
        }

        let isAvailable = availabilityChecked && availabilityResult === "AVAILABLE";
        
        if (!isAvailable) {
            console.log("Checking availability automatically");
            isAvailable = await checkAvailability();
            if (!isAvailable) {
                return;
            }
        }
        
        try {
            setSubmitting(true);
            setError("");
            
            const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.startDate}T${formData.endTime}:00`;
            
            const payload = {
                userId: user?.userId,
                resourceType: "ROOM",
                resourceId: parseInt(roomid),
                startDate: startDateTime,
                endDate: endDateTime,
                price: price
            };
            
            console.log("Sending data:", payload);
            
            const response = await axios.post('http://localhost:8083/api/v1/rent', payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-User-Id': user?.userId
                }
            });
            
            console.log("Server response:", response.data);
            
            if (response.data?.status === "success") {
                navigate('/profile/rentals'); 
            } else {
                console.log("Reservation likely succeeded");
                navigate('/profile/rentals');
            }
            
        } catch (err) {
            console.error("Error sending reservation:", err);
            console.error("Error details:", err.response?.data);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                setError(Object.values(err.response.data.errors).join(", "));
            } else {
                setError("Failed to send reservation. Please try again later.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderAvailabilityMessage = () => {
        if (availabilityCheckLoading) {
            return <p className="info-message">Checking availability...</p>;
        }
        
        if (!availabilityChecked) return null;
        
        switch (availabilityResult) {
            case "AVAILABLE":
                return <p className="success-message">The room is available for the selected dates and times!</p>;
            case "CONFLICT_WITH_EXISTING_RENT":
                return <p className="error-message">This room is already reserved for this time period.</p>;
            case "OUTSIDE_AVAILABILITY_SCHEDULE":
                return <p className="error-message">The room is not available during the selected days or hours.</p>;
            case "NO_AVAILABILITY_DEFINED":
                return <p className="error-message">No availability schedule is defined for this room.</p>;
            default:
                return <p className="error-message">Could not verify availability. Please try again.</p>;
        }
    };

    if (loading) {
        return <div className="loading-container">
            <Header />
            <div className="loading-message">Loading room information...</div>
            <Footer />
        </div>;
    }

    if (error && !room) {
        return <div className="error-container">
            <Header />
            <div className="error-message">Error: {error}</div>
            <Footer />
        </div>;
    }

    return (
        <div>
            <Header />
            <div className="desk-container">
                <div className="desk-header">
                    <h2>Rent <span className="owner-title">room</span></h2>
                    <img src={selectedPhoto || room2} alt="Room" className="rent-desk" />
                </div>
                
                <div className="desk-info">
                    <div className="desk-details">
                        <h2>{room.room}</h2>
                        <p><strong>Description:</strong> {room.description || "No description available."}</p>
                        <p><strong>Equipment:</strong> {room.equipment || "Not specified"}</p>
                        <p><strong>Floor Number:</strong> {room.floorNumber !== null ? room.floorNumber : "Not specified"}</p>
                        <p><strong>Max Occupants:</strong> <Users size={14} /> {room.maxOccupants || "Not specified"}</p>
                        <p><strong>Surface Area:</strong> <Square size={14} /> {room.surface ? `${room.surface} m²` : "Not specified"}</p>
                        <p><strong>Rating:</strong> {room.rating ? `${room.rating}/5` : "No rating yet"}</p>
                        <p><strong>Price:</strong> ${room.price || "100.00"} per hour</p>
                        <hr />
                        <h3>Building Info</h3>
                        <p><strong>Building:</strong> {room.building?.building}</p>
                        <p><strong>Description:</strong> {room.building?.description}</p>
                        <p><strong>Contact:</strong> {room.building?.contactEmail}, {room.building?.contactPhone}</p>
                        <p><strong>Location:</strong> {room.building?.address?.address}, {room.building?.address?.city?.city}, {room.building?.address?.country?.country}</p>
                    </div>
                </div>

                <div className="scheduling-container">
                    {/* Left side: Availability schedule */}
                    <div className="availability-section">
                        {availabilityData && (
                            <div className="availability-schedule">
                                <h3><Calendar size={18} /> Availability Schedule</h3>
                                <p>Available from {formatDate(availabilityData.availableFrom)} to {formatDate(availabilityData.availableTo)}</p>
                                
                                <div className="days-container">
                                    {availabilityData.availableDaysWithHours.map((day) => (
                                        <div key={day.dayId} className="day-item">
                                            <div className="day-name">{formatDayName(day.dayOfWeek)}</div>
                                            <div className="time-slots-container">
                                                {day.timeSlots.map((slot) => (
                                                    <div key={slot.id} className="time-slot-pill">
                                                        <Clock size={12} /> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side: Rental history */}
                   <div className="rental-history-section">
    <div className="rental-history">
        <h3><Calendar size={18} /> Rental History</h3>
        {rentalHistory && rentalHistory.length > 0 ? (
            <div className="rental-list">
                {rentalHistory
                    .filter(rental => {
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0); 
                        const rentalStartDate = new Date(rental.startDate);
                        return rental.status === "PAID" && rentalStartDate >= currentDate;
                    })
                    .sort((a, b) => {
                        return new Date(a.startDate) - new Date(b.startDate);
                    })
                    .map((rental) => (
                        <div key={rental.id} className="rental-item">
                            <div className="rental-date">
                                <Calendar size={14} /> {formatDateTime(rental.startDate).split(' ')[0]}
                            </div>
                            <div className="rental-time">
                                <Clock size={14} /> {formatDateTime(rental.startDate).split(' ')[1]} - {formatDateTime(rental.endDate).split(' ')[1]}
                            </div>
                            {rental.user && (
                                <div className="rental-user">
                                    <User size={14} /> {rental.user.firstName} {rental.user.lastName}
                                </div>
                            )}
                            <div className="rental-status">
                        {"BOOKED"}
                            </div>
                        </div>
                    ))}
            </div>
        ) : (
            <p>No paid rental history available for this desk.</p>
        )}
        {rentalHistory && rentalHistory.length > 0 && 
         !rentalHistory.some(rental => {
             const currentDate = new Date();
             currentDate.setHours(0, 0, 0, 0);
             const rentalStartDate = new Date(rental.startDate);
             return rental.status === "PAID" && rentalStartDate >= currentDate;
         }) && (
            <p>No upcoming rentals for this desk.</p>
        )}
    </div>
</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="date-section">
                        <label>Rent date</label>
                        <div className="date-inputs">
                            <input 
                                type="date" 
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                min={getCurrentDateString()}
                                className="date-box" 
                                required
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
                                required
                            />
                            <input 
                                type="time" 
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="small-box" 
                                required
                            />
                        </div>
                        
                        {dateError && <p className="error-message">{dateError}</p>}
                    </div>

                    <div className="availability-check-section">
                        <button 
                            type="button" 
                            className="create-button"
                            onClick={checkAvailability}
                            disabled={availabilityCheckLoading}
                        >
                            {availabilityCheckLoading ? "Checking..." : "Check Availability"}
                        </button>
                        {renderAvailabilityMessage()}
                    </div>

                    <div className="payment-section">
                        <label>Payment method</label> <br />
                        <select 
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            className="payment-box"
                            required
                        >
                            <option value="">Select payment method</option>
                            <option value="CARD">Credit/Debit Card</option>
                            <option value="PAYPAL">PayPal</option>
                            <option value="TRANSFER">Bank Transfer</option>
                            <option value="BLIK">BLIK</option>
                        </select>
                        <p className="amount">Amount: {price > 0 ? price.toFixed(2) : '0.00'}$</p>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="login-button width" 
                        disabled={submitting || dateError || !availabilityChecked || availabilityResult !== "AVAILABLE"}
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

export default RentRoomContainer;