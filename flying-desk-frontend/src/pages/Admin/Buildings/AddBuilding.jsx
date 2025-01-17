import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const BuildingAdd = () => {
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        building: "",
        addressId: "",
        description: "",
    });

    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

        const formDataToSend = new FormData();
        formDataToSend.append("building", new Blob([JSON.stringify(formData)], { type: "application/json" }));
        files.forEach((file) => formDataToSend.append("files", file));

        try {
            await axios.post("http://localhost:8081/api/v1/building", formDataToSend, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "X-User-Id": user.userId,
                },
            });
            navigate("/admin-fd/buildings");
        } catch (err) {
            setError("Error creating building. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ap-form-container">
            <form onSubmit={handleSubmit} className="ap-form">

            <h2 className="ap-h2"> Building information </h2>
                <input
                    name="building"
                    type="text"
                    placeholder="Building Name"
                    value={formData.building}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="addressId"
                    type="number"
                    placeholder="Address ID"
                    value={formData.addressId}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />

                <hr className="ap-hr"></hr>
                <h2 className="ap-h2"> Photos of offices </h2>
               

                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
                <hr className="ap-hr"></hr>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading} className="login-button">Create</button>
            </form>
        </div>
    );
};

export default BuildingAdd;
