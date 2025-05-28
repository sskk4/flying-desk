import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

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
    role: "",
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
          role: user.role,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
    });
    setSuccessMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    try {
      // Update user basic info
      const userUpdateResponse = await axios.put(
        `http://localhost:8080/api/v1/auth/${id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      // Update user role if it changed
      if (formData.role !== userData.role) {
        await axios.put(
          `http://localhost:8080/api/v1/auth/set-role/${id}`,
          {
            role: formData.role,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      
      // Update local state with new data
      const updatedUserData = {
        ...userUpdateResponse.data,
        role: formData.role,
      };
      
      setUserData(updatedUserData);
      setSuccessMessage("User information updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading user details...</div>;
  if (error && !userData.userId) return <div className="error-message">{error}</div>;

  return (
    <div className="ap-form-container">
      <form onSubmit={handleSubmit} className="ap-form">
        <h2 className="ap-h2">User Details</h2>
        
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <input
          type="text"
          placeholder="User ID"
          value={userData.userId}
          disabled={true}
          style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
        />
        
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          disabled={true}
          style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
        />
        
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Select Role</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>

        <hr className="ap-hr" />
        
        <div style={{ display: 'flex', gap: '0px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={handleCancel}
            className="create-button"
          >
            Cancel Changes
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="login-button wide"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;