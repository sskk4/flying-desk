import React, { useState } from "react";
import FormField from "../../../components/Form/FormField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/SideBar/SideBar";
import { useAuth } from "../../../services/AuthProvider";

import { ReactComponent as DestinationIcon } from "../../../assets/icons/destination.svg";
import { ReactComponent as LockIcon } from "../../../assets/icons/summary.svg";
import { ReactComponent as PhotosIcon } from "../../../assets/icons/photos.svg";

const SubmissionsForm = () => {
  const { accessToken, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    buildingName: "",
    buildingDescription: "",
  });

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files exceed the maximum size of 5MB and were excluded.");
    }

    setFiles(validFiles);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      country: "",
      address: "",
      buildingName: "",
      buildingDescription: "",
    });
    setFiles([]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!accessToken) {
      setError("Authorization error: No access token available.");
      setLoading(false);
      return;
    }

    if (!user || !user.userId) {
      setError("Authorization error: No user information available.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      "submission",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      const response = await axios.post("http://localhost:8081/api/v1/submissions", formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-User-Id": user.userId,
        },
      });
      navigate("/waiting-status"); 
      
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to create submission.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { icon: <LockIcon />, name: "information", path: "" },
    { icon: <DestinationIcon />, name: "destination", path: "" },
    { icon: <PhotosIcon />, name: "photos", path: "" },
  ];

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar header="Add Submission" items={sidebarItems} />
        <main className="content-container">
          <div className="form-container with-sidebar">
            <div className="form">
              <h3>Complete the form to become one of the owners</h3>
              <hr></hr>
              <h2> Owner/authorized person </h2>
              <FormField
                id="firstName"
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
              <FormField
                id="lastName"
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
              <FormField
                id="phone"
                label="Phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
              />

              <hr></hr>
              <h2> Building destination </h2>
              <FormField
                id="country"
                label="Country"
                type="text"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Enter your country"
              />
              <FormField
                id="address"
                label="Address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter your address"
              />


                <hr></hr>
                <h2>Information about building </h2>
              <FormField
                id="buildingName"
                label="Building Name"
                type="text"
                value={formData.buildingName}
                onChange={(e) => handleChange("buildingName", e.target.value)}
                placeholder="Enter building name"
              />
              <FormField
                id="buildingDescription"
                label="Building Description"
                type="textarea"
                value={formData.buildingDescription}
                onChange={(e) =>
                  handleChange("buildingDescription", e.target.value)
                }
                placeholder="Describe the building"
              />

<hr></hr>
<h2>Office photos and authorization document</h2>
              <div>
                <label>Upload Photos:</label>
                <input type="file" multiple onChange={handleFileChange} />
              </div>
              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}
              <div className="buttons">
                <button type="button" onClick={handleReset} disabled={loading}>
                  Reset
                </button>
                <button type="submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Create Submission"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmissionsForm;
