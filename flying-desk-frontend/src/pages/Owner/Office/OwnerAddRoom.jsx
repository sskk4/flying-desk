import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";
import FormField from "../../../components/Form/FormField";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "../../../styles/Owner/Manage.css";
import { Clock, Plus, X, Upload } from "react-feather"; 

const RoomForm = () => {
  const { accessToken, user } = useAuth();
  const { buildingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    room: "",
    equipment: "",
    description: "",
    price: "",
    status: "AVAILABLE",
    maxOccupants: "",
    surface: "",
    floorNumber: ""
  });

  const [availabilityData, setAvailabilityData] = useState({
    availableFrom: "",
    availableTo: "",
    availableDaysWithHours: [
      { dayOfWeek: "MONDAY", dayId: 1, timeSlots: [] },
      { dayOfWeek: "TUESDAY", dayId: 2, timeSlots: [] },
      { dayOfWeek: "WEDNESDAY", dayId: 3, timeSlots: [] },
      { dayOfWeek: "THURSDAY", dayId: 4, timeSlots: [] },
      { dayOfWeek: "FRIDAY", dayId: 5, timeSlots: [] },
      { dayOfWeek: "SATURDAY", dayId: 6, timeSlots: [] },
      { dayOfWeek: "SUNDAY", dayId: 7, timeSlots: [] },
    ],
  });

  const [activeDay, setActiveDay] = useState(null);
  const [timeSlot, setTimeSlot] = useState({ startTime: "09:00", endTime: "17:00" });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const daysOfWeek = [
    { value: "MONDAY", label: "Monday", id: 1 },
    { value: "TUESDAY", label: "Tuesday", id: 2 },
    { value: "WEDNESDAY", label: "Wednesday", id: 3 },
    { value: "THURSDAY", label: "Thursday", id: 4 },
    { value: "FRIDAY", label: "Friday", id: 5 },
    { value: "SATURDAY", label: "Saturday", id: 6 },
    { value: "SUNDAY", label: "Sunday", id: 7 },
  ];

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAvailabilityChange = (field, value) => {
    setAvailabilityData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleDaySelect = (dayOfWeek) => {
    setActiveDay(dayOfWeek);
  };

  const handleTimeChange = (field, value) => {
    setTimeSlot((prev) => ({ ...prev, [field]: value }));
  };

  const addTimeSlot = () => {
    if (!activeDay || !timeSlot.startTime || !timeSlot.endTime) {
      setError("Please select a day and specify time slot");
      return;
    }

    if (timeSlot.startTime >= timeSlot.endTime) {
      setError("End time must be after start time");
      return;
    }

    setError("");
    setAvailabilityData((prevData) => {
      const updatedDays = prevData.availableDaysWithHours.map((day) => {
        if (day.dayOfWeek === activeDay) {
          return {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                id: Date.now(), 
                startTime: timeSlot.startTime + ":00",
                endTime: timeSlot.endTime + ":00",
              },
            ],
          };
        }
        return day;
      });
      return { ...prevData, availableDaysWithHours: updatedDays };
    });

    setTimeSlot({ startTime: "09:00", endTime: "17:00" });
  };

  const removeTimeSlot = (dayOfWeek, slotId) => {
    setAvailabilityData((prevData) => {
      const updatedDays = prevData.availableDaysWithHours.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          return {
            ...day,
            timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId),
          };
        }
        return day;
      });
      return { ...prevData, availableDaysWithHours: updatedDays };
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files exceed the maximum size of 5MB.");
    }

    setFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const filteredDays = availabilityData.availableDaysWithHours.filter(
      day => day.timeSlots.length > 0
    );

    if (filteredDays.length === 0) {
      setError("Please add at least one time slot for availability");
      setLoading(false);
      return;
    }

    const roomData = {
      room: formData.room,
      equipment: formData.equipment,
      description: formData.description,
      price: parseFloat(formData.price),
      status: formData.status,
      maxOccupants: parseInt(formData.maxOccupants),
      surface: parseInt(formData.surface),
      floorNumber: parseInt(formData.floorNumber),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("room", new Blob([JSON.stringify(roomData)], { type: "application/json" }));
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      const roomResponse = await axios.post(
        `http://localhost:8081/api/v1/building/${buildingId}/room`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-User-Id": user.userId,
          },
        }
      );

      if (roomResponse.data && roomResponse.data.id) {
        const roomId = roomResponse.data.id;

        await axios.post(
          "http://localhost:8083/api/v1/availability",
          {
            resourceType: "ROOM",
            resourceId: roomId,
            availableFrom: availabilityData.availableFrom,
            availableTo: availabilityData.availableTo,
            availableDaysWithHours: filteredDays,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-User-Id": user.userId,
            },
          }
        );
      }

      setMessage("Room and availability added successfully!");
      setFormData({
        room: "",
        equipment: "",
        description: "",
        price: "",
        status: "AVAILABLE",
        maxOccupants: "",
        surface: "",
        floorNumber: ""
      });
      setAvailabilityData({
        availableFrom: "",
        availableTo: "",
        availableDaysWithHours: daysOfWeek.map(day => ({ 
          dayOfWeek: day.value, 
          dayId: day.id, 
          timeSlots: [] 
        })),
      });
      setFiles([]);
      navigate(`/owner/rooms`);
    } catch (err) {
      setError("Error creating room or availability. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <div className="form-container card-shadow">
          <form onSubmit={handleSubmit}>
            <button
              className="back-button create-button"
              type="button"
              onClick={() => navigate(`/owner`)}
            >
              Back
            </button>

            <h2 className="form-title">Create an ad for your room</h2>
            <hr className="divider" />
            
            <div className="form-section">
              <FormField
                id="room"
                label="Room Name"
                type="text"
                value={formData.room}
                onChange={(e) => handleChange("room", e.target.value)}
                required
              />
              <FormField
                id="equipment"
                label="Equipment"
                type="text"
                value={formData.equipment}
                onChange={(e) => handleChange("equipment", e.target.value)}
                required
              />
              <FormField
                id="description"
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
              <FormField
                id="maxOccupants"
                label="Max Occupants"
                type="number"
                value={formData.maxOccupants}
                onChange={(e) => handleChange("maxOccupants", e.target.value)}
                required
              />
              <FormField
                id="surface"
                label="Surface (m²)"
                type="number"
                value={formData.surface}
                onChange={(e) => handleChange("surface", e.target.value)}
                required
              />
              <FormField
                id="floorNumber"
                label="Floor Number"
                type="number"
                value={formData.floorNumber}
                onChange={(e) => handleChange("floorNumber", e.target.value)}
                required
              />
              <FormField
                id="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />

              <div className="select-form">
                <label className="custom-label" htmlFor="status">
                  Status
                </label>
                <select
                  className="custom-select"
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>
            </div>

            <hr className="divider" />
            
            <div className="form-section">
              <h3 className="section-title">Set Availability</h3>
              <div className="date-range-container">
                <FormField
                  id="availableFrom"
                  label="Available From"
                  type="date"
                  value={availabilityData.availableFrom}
                  onChange={(e) => handleAvailabilityChange("availableFrom", e.target.value)}
                  required
                />
                <FormField
                  id="availableTo"
                  label="Available To"
                  type="date"
                  value={availabilityData.availableTo}
                  onChange={(e) => handleAvailabilityChange("availableTo", e.target.value)}
                  required
                />
              </div>

              <div className="time-slots-section">
                <h4 className="subsection-title">Set Time Slots</h4>
                
                <div className="days-tabs">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      className={`day-tab ${activeDay === day.value ? "active" : ""}`}
                      onClick={() => handleDaySelect(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>

                {activeDay && (
                  <div className="time-slot-editor">
                    <div className="time-slot-inputs">
                      <div className="time-input-group">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={timeSlot.startTime}
                          onChange={(e) => handleTimeChange("startTime", e.target.value)}
                          className="time-input"
                        />
                      </div>
                      <div className="time-input-group">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={timeSlot.endTime}
                          onChange={(e) => handleTimeChange("endTime", e.target.value)}
                          className="time-input"
                        />
                      </div>
                      <button
                        type="button"
                        className="add-time-slot-btn"
                        onClick={addTimeSlot}
                      >
                        <Plus size={16} /> Add Time Slot
                      </button>
                    </div>
                  </div>
                )}

                <div className="time-slots-display">
                  {daysOfWeek.map((day) => {
                    const dayData = availabilityData.availableDaysWithHours.find(
                      (d) => d.dayOfWeek === day.value
                    );
                    
                    if (dayData && dayData.timeSlots.length > 0) {
                      return (
                        <div key={day.value} className="day-slots">
                          <h5 className="day-name">{day.label}</h5>
                          <div className="slots-list">
                            {dayData.timeSlots.map((slot) => (
                              <div key={slot.id} className="time-slot-item">
                                <Clock size={14} />
                                <span>
                                  {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                </span>
                                <button
                                  type="button"
                                  className="remove-slot-btn"
                                  onClick={() => removeTimeSlot(day.value, slot.id)}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            <hr className="divider" />
            
            <div className="form-section">
              <h3 className="section-title">Upload Photos (max 5)</h3>
              <div className="file-upload-container">
                <label className="file-upload-label">
                  <Upload size={24} />
                  <span>Choose files</span>
                  <input
                    type="file"
                    className="file-input"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <div className="selected-files">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            
            <hr className="divider" />

            <div className="form-actions">
              <button className="create-button" type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomForm;