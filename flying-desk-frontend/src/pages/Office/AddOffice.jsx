import React, { useState } from "react";
import FormField from "../../components/Form/FormField"; // Komponent FormField
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { uploadPhotos } from "../../services/OfficeApi";
import Header from '../../components/Header/Header';
import Sidebar from "../../components/SideBar/SideBar";

import { ReactComponent as DestinationIcon } from "../../assets/icons/destination.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/summary.svg";
import { ReactComponent as PhotosIcon } from "../../assets/icons/photos.svg";

const BuildingForm = () => {
  const [formData, setFormData] = useState({
    buildingName: "",
    description: "",
    addressId: "",
    photo: null,
  });

  

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let photoUrl = null;

    // Upload zdjęcia (jeśli istnieje)
    if (formData.photo) {
      try {
        const uploadedUrls = await uploadPhotos([formData.photo], "buildings", token);
        photoUrl = uploadedUrls[0];
      } catch (error) {
        setMessage("Failed to upload photo.");
        setLoading(false);
        return;
      }
    }

    const buildingData = {
      building: formData.buildingName,
      addressId: parseInt(formData.addressId, 10),
      description: formData.description,
      photo: photoUrl,
    };

    try {
      const response = await axios.post("http://localhost:8081/api/v1/building", buildingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setMessage("Building uploaded successfully!");
      }
    } catch (error) {
      setMessage("Failed to upload building.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      buildingName: "",
      description: "",
      addressId: "",
      photo: null,
    });
    setMessage("");
  };


  const sidebarItems = [
    { icon: <LockIcon />, name: "information", path: "rentals" },
    { icon: <DestinationIcon />, name: "destination", path: "personal-info" },
    { icon: <PhotosIcon />, name: "photos", path: "account-signin" },
  ];

  return (
    
    <div>
      <Header />

      <div className="container">
        <Sidebar header="Add Offer" items={sidebarItems} />
        <main className="content-container">
          <Routes>
            <Route
              path="personal-info"
              element={
                <div>
                  <h2>Rentals Page</h2>
                  <p>Here you can manage your rentals.</p>
                </div>
              }
            />
            <Route
              path="rentals"
              element={
                <div>
                  <h2>Rentals Page</h2>
                  <p>Here you can manage your rentals.</p>
                </div>
              }
            />
            <Route
              path="account-signin"
              element={
                <div>
                  <h2>Account Sign-In</h2>
                  <p>Manage your sign-in preferences here.</p>
                </div>
              }
            />
          </Routes>
        </main>

 

    <div className="form-container with-sidebar">
      <div className="form">
        <h2>Create Building</h2>
        <FormField
          id="buildingName"
          label="Building Name"
          type="text"
          value={formData.buildingName}
          onChange={(e) => handleChange("buildingName", e.target.value)}
          placeholder="Enter building name"
        />
        <FormField
          id="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter description"
        />
        <FormField
          id="addressId"
          label="Address ID"
          type="text"
          value={formData.addressId}
          onChange={(e) => handleChange("addressId", e.target.value)}
          placeholder="Enter address ID"
        />
   <div>
          <label>Upload Photo:</label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="buttons">
          <button className="create-button narrow" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="login-button wide"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create Building"}
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
    </div>
    </div>
  );
};

export default BuildingForm;
