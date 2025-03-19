import React, { useState } from "react";
import { uploadPhotos, addBuilding } from "../../services/OfficeApi";
import FormField from "../../components/Form/FormField";

const BuildingForm = () => {
  const [formData, setFormData] = useState({
    buildingName: "",
    description: "",
    addressId: "",
    photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 5) {
      alert("You can upload a maximum of 5 photos.");
      return;
    }
    setFormData((prevData) => ({ ...prevData, photos: [...prevData.photos, ...files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {

      const uploadedUrls = await uploadPhotos(formData.photos, "buildings");
  
      if (uploadedUrls.length === 0) {
        setMessage("No photos uploaded. Please try again.");
        setLoading(false);
        return;
      }
  

      const buildingData = {
        building: formData.buildingName,
        description: formData.description,
        addressId: parseInt(formData.addressId, 10),
        photos: uploadedUrls,
      };
  

      const response = await addBuilding(buildingData);
      setMessage("Building added successfully!");
      setFormData({ buildingName: "", description: "", addressId: "", photos: [] });
    } catch (error) {
      console.error("Error adding building:", error);
      setMessage("Failed to add building. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Building</h2>
        <FormField
          id="buildingName"
          label="Building Name"
          type="text"
          value={formData.buildingName}
          onChange={(e) => handleChange("buildingName", e.target.value)}
        />
        <FormField
          id="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <FormField
          id="addressId"
          label="Address ID"
          type="text"
          value={formData.addressId}
          onChange={(e) => handleChange("addressId", e.target.value)}
        />
        <div>
          <label>Upload Photos (max 5):</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Building"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default BuildingForm;
