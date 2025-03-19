import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";
import FormField from "../../../components/Form/FormField";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const DeskForm = () => {
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
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
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

    const deskData = {
      desk: formData.desk,
      equipment: formData.equipment,
      description: formData.description,
      price: formData.price,
      status: formData.status,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("desk", new Blob([JSON.stringify(deskData)], { type: "application/json" }));
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      await axios.post(`http://localhost:8081/api/v1/building/${buildingId}/desk`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-User-Id": user.userId,
        },
      });

      setMessage("Desk added successfully!");
      setFormData({
        desk: "",
        equipment: "",
        description: "",
        price: "",
        status: "AVAILABLE",
      });
      setFiles([]);
      navigate(`/admin-fd/buildings/${buildingId}/desks`);
    } catch (err) {
      setError("Error creating desk. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="manage-ads-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <button
              className="create-button back-button"
              type="button"
              onClick={() => navigate(`/owner`)}
            >
              Back
            </button>

            <h2>Create an ad for your desk</h2>
            <hr />
            <FormField
              id="desk"
              label="Desk Name"
              type="text"
              value={formData.desk}
              onChange={(e) => handleChange("desk", e.target.value)}
            />
            <FormField
              id="equipment"
              label="Equipment"
              type="text"
              value={formData.equipment}
              onChange={(e) => handleChange("equipment", e.target.value)}
            />
            <FormField
              id="description"
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <FormField
              id="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            
            <div className="select-form">
              <label className="custom-label" htmlFor="status">Status</label>
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

            <hr />
            <div>
              <h3>Upload Photos (max 5)</h3>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
            <hr />
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button className="create-button" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Create Desk"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeskForm;