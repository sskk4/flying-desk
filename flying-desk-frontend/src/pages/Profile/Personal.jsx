import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthProvider";
import FormField from "../../components/Form/FormField";
import axios from "axios";

const Personal = () => {
  const { user, accessToken, refreshUserData } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setSuccessMessage(""); 
  };

  const handleCancel = () => {
    console.log("Cancelled changes");
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setSuccessMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      
      if (formData.firstName === user.firstName && formData.lastName === user.lastName) {
        setSuccessMessage("No changes to save");
        setLoading(false);
        return;
      }
      
      const response = await axios.put(
        `http://localhost:8080/api/v1/auth/${user.userId}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      console.log("Updated user data:", response.data);
      setSuccessMessage("Personal information updated successfully");
      
      if (refreshUserData) {
        refreshUserData();
      }
    } catch (err) {
      console.error("Error updating personal information:", err);
      setError(err.response?.data?.message || "Failed to update personal information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container with-sidebar">
      <div className="form">
        <h2>Personal information</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
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
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter your email"
          disabled={true} 
        />
        <div className="buttons">
          <button 
            className="create-button narrow" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="login-button wide" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personal;