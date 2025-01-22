import React, { useState } from "react";
import FormField from "../../components/Form/FormField";
import { useApi } from "../../services/api";
import { useAuth } from "../../services/AuthProvider";

const ChangePassword = () => {
  const { changePassword } = useApi();
  const { clearError, error } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setMessage("Password changed successfully.");
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div className="form-container with-sidebar">
      <div className="form">
        
        <h2>Change Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <FormField
          id="currentPassword"
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => handleChange("currentPassword", e.target.value)}
          placeholder="Enter your current password"
        />
        <FormField
          id="newPassword"
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          placeholder="Enter your new password"
        />
        
        <FormField
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder="Confirm your new password"
        />
        <div class="buttons">
        <button className="login-button wide" onClick={handleSubmit}>Change Password</button>
        </div>
      </div>
      
    </div>
    
  );
};

export default ChangePassword;
