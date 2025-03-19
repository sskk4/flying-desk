import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const RoomAdd = () => {
  const { accessToken, user } = useAuth();
  const { buildingId } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    room: "",
    equipment: "",
    description: "",
    maxOccupants: "",
    price: "",
    status: "AVAILABLE",
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const formDataToSend = new FormData();
    formDataToSend.append(
      "room",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      await axios.post(`http://localhost:8081/api/v1/building/${buildingId}/room`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-User-Id": user.userId,
        },
      });
      navigate(`/admin-fd/buildings/${buildingId}/rooms`);
    } catch (err) {
      setError("Error creating room. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-form-container">
      <form onSubmit={handleSubmit} className="ap-form">
        <h2 className="ap-h2">Room Information</h2>
        <input
          name="room"
          type="text"
          placeholder="Room Name"
          value={formData.room}
          onChange={handleInputChange}
          required
        />
        <input
          name="equipment"
          type="text"
          placeholder="Equipment (e.g., DESK, PROJECTOR)"
          value={formData.equipment}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          name="maxOccupants"
          type="number"
          placeholder="Max Occupants"
          value={formData.maxOccupants}
          onChange={handleInputChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price (e.g., 250.0)"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleInputChange} required>
          <option value="AVAILABLE">Available</option>
          <option value="BOOKED">Booked</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>

        <hr className="ap-hr" />
        <h2 className="ap-h2">Room Photos</h2>
        <input type="file" multiple onChange={handleFileChange} />
        {error && <p className="error-message">{error}</p>}
        <hr className="ap-hr" />
        <button type="submit" disabled={loading} className="login-button">Create</button>
      </form>
    </div>
  );
};

export default RoomAdd;
