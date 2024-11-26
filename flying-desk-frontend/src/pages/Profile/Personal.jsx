import React, { useState } from "react";
import FormField from "../../components/Form/FormField"; 

const Personal = () => {
  const [formData, setFormData] = useState({
    firstName: "Sebastian",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCancel = () => {
    console.log("Cancelled changes");
  };

  const handleSave = () => {
    console.log("Saved data:", formData);
  };

  return (
    <div className="form-container with-sidebar">
      <div className="form">
      <h2>Personal information</h2>
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
      />
      <FormField
        id="phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        placeholder="Enter your phone number"
      />
      <div className="buttons">
        <button className="create-button narrow" onClick={handleCancel}>
          Cancel
        </button>
        <button className="login-button wide" onClick={handleSave}>
          Save
        </button>
      </div>
      </div>
    </div>
  );
};

export default Personal;
