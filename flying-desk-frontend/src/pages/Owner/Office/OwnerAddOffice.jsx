import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";
import FormField from "../../../components/Form/FormField";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const BuildingForm = () => {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buildingName: "",
    description: "",
    address: {
      street: "",
      buildingNumber: "",
      zipCode: "",
      cityId: "",
      countryId: "",
    },
    photos: [],
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch countries when the component mounts
  useEffect(() => {
    if (accessToken) {
      axios
        .get("http://localhost:8081/api/v1/country", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => setCountries(res.data))
        .catch((err) => console.error("Error fetching countries:", err));
    }
  }, [accessToken]);

  // Fetch cities when a country is selected
  useEffect(() => {
    if (formData.address.countryId) {
      axios
        .get(`http://localhost:8081/api/v1/city/by-country/${formData.address.countryId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => setCities(res.data))
        .catch((err) => setError("Error fetching cities."));
    }
  }, [formData.address.countryId, accessToken]);
  

  const handleChange = (field, value, section = null) => {
    if (section === "address") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [field]: value }));
    }
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

    const buildingData = {
      building: formData.buildingName,
      description: formData.description,
      address: {
        street: formData.address.street,
        buildingNumber: formData.address.buildingNumber,
        zipCode: formData.address.zipCode,
        cityId: parseInt(formData.address.cityId, 10),
        countryId: parseInt(formData.address.countryId, 10),
      },
    };

    const formDataToSend = new FormData();
    formDataToSend.append("building", new Blob([JSON.stringify(buildingData)], { type: "application/json" }));
    files.forEach((file) => formDataToSend.append("files", file));

    try {
      await axios.post("http://localhost:8081/api/v1/building", formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-User-Id": user.userId,
        },
      });

      setMessage("Building added successfully!");
      setFormData({ buildingName: "", description: "", address: {}, photos: [] });
      setFiles([]);
      navigate("/owner");
    } catch (err) {
      setError("Error creating building. Try again.");
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
              onClick={() => navigate("/owner")}
            >
              Back
            </button>

            <h2>Create an ad for your office space</h2>
            <hr />
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
            <hr />

            <div className="select-form"> 
            <label className="custom-label" htmlFor="countryId">Country</label>
            <select className="custom-select"
              id="countryId"
              value={formData.address.countryId}
              onChange={(e) => handleChange("countryId", e.target.value, "address")}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.country}
                </option>
              ))}
            </select>
            <br></br>
            <label htmlFor="cityId">City</label>
<br></br>
            <select
              id="cityId"
              value={formData.address.cityId}
              onChange={(e) => handleChange("cityId", e.target.value, "address")}
              disabled={!formData.address.countryId}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.city}
                </option>
              ))}
            </select>
            </div>

              <hr></hr>
            <FormField
              id="street"
              label="Street"
              type="text"
              value={formData.address.street}
              onChange={(e) => handleChange("street", e.target.value, "address")}
            />
            <FormField
              id="buildingNumber"
              label="Building Number"
              type="text"
              value={formData.address.buildingNumber}
              onChange={(e) => handleChange("buildingNumber", e.target.value, "address")}
            />
            <FormField
              id="zipCode"
              label="Zip Code"
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value, "address")}
            />
      
   

            <hr />
            <div>
              <h3>Upload Photos (max 5)</h3>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
            <hr />
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button className="create-button" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Create Building"}
            </button>


          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuildingForm;
