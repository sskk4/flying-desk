import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const DesksAdd = () => {
  const { accessToken, user } = useAuth();
  const { buildingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    desk: "",
    equipment: "",
    description: "",
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
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append(
      "desk",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      await axios.post(`http://localhost:8081/api/v1/building/${buildingId}/desk`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-User-Id": user.userId,
        },
      });
      navigate(`/admin-fd/buildings/${buildingId}/desks`);
    } catch (err) {
      setError("Error creating desk. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-form-container">
      <form onSubmit={handleSubmit} className="ap-form">
        <h2 className="ap-h2">Desk Information</h2>
        <input
          name="desk"
          type="text"
          placeholder="Desk Name"
          value={formData.desk}
          onChange={handleInputChange}
          required
        />
        <input
          name="equipment"
          type="text"
          placeholder="Equipment (e.g., Monitor, Chair)"
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
          name="price"
          type="number"
          placeholder="Price (e.g., 100.0)"
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
        <h2 className="ap-h2">Desk Photos</h2>
        <input type="file" multiple onChange={handleFileChange} />
        {error && <p className="error-message">{error}</p>}
        <hr className="ap-hr" />
        <button type="submit" disabled={loading} className="login-button">Create</button>
      </form>
    </div>
  );
};

export default DesksAdd;
