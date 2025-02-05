import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const DesksDetails = () => {
    const { id } = useParams(); 
    const { accessToken } = useAuth();
    const [desk, setDesk] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeskDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building/desk/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setDesk(response.data);
            } catch (err) {
                console.error("Error fetching desk details:", err);
                setError("Failed to load desk details.");
            }
        };
        fetchDeskDetails();
    }, [id, accessToken]);

    if (error) return <p className="error-message">{error}</p>;
    if (!desk) return <p>Loading...</p>;

    return (
        <div className="ap-details-container">
            <p><strong>ID:</strong> {desk.id}</p>
            <p><strong>Name:</strong> {desk.desk}</p>
            <p><strong>Equipment:</strong> {desk.equipment}</p>
            <hr />
            <p><strong>Building:</strong> {desk.building.building}</p>
            <p><strong>Description:</strong> {desk.description}</p>
            <p><strong>Price:</strong> ${desk.price}</p>
            <p><strong>Status:</strong> {desk.status}</p>
            <h2>Photos:</h2>
            <ul>
                {desk.photos.map((photo, index) => (
                    <li key={index}>
                        <img src={photo.url} alt={`Photo ${index + 1}`} style={{ maxWidth: "200px" }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DesksDetails;
