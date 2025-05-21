import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";
import FormField from "../../../components/Form/FormField";

const UserDetails = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    userId: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(`http://localhost:8080/api/v1/auth/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        let user;
        if (Array.isArray(response.data)) {
          user = response.data.find(u => u.userId.toString() === id);
        } else if (response.data.content) {
          user = response.data.content.find(u => u.userId.toString() === id);
        }
        
        if (!user) {
          throw new Error("User not found");
        }
        
        setUserData(user);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [accessToken, id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    setSuccessMessage("");
  };


  const handleSave = async () => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await axios.put(
        `http://localhost:8080/api/v1/auth/${id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      setUserData(response.data);
      setSuccessMessage("User information updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user information");
    }
  };

  if (loading) return <div className="loading">Loading user details...</div>;
  if (error && !userData.userId) return <div className="error-message">{error}</div>;

  return (
    <div className="form-container">
      <div className="form">
        <h2>User Details</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <FormField
          id="userId"
          label="User ID"
          type="text"
          value={userData.userId}
          disabled={true}
        />
        
        <FormField
          id="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="Enter first name"
        />
        
        <FormField
          id="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder="Enter last name"
        />
        
        <FormField
          id="email"
          label="Email"
          type="email"
          value={userData.email}
          disabled={true}
        />
        
        <FormField
          id="role"
          label="Role"
          type="text"
          value={userData.role}
          disabled={true}
        />
        
        <div className="buttons">
          <button 
            className="create-button narrow" 
            onClick={() => navigate("/admin-fd/users")}
          >
            Back to Users
          </button>
          <button 
            className="create-button narrow" 
            onClick={handleCancel}
          >
            Cancel Changes
          </button>
          <button 
            className="login-button wide" 
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;