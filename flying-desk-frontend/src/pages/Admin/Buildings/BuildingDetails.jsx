import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const BuildingsDetails = () => {
    const { id } = useParams();
    const { accessToken } = useAuth();
    const [building, setBuilding] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Pobranie szczegółów budynku
    useEffect(() => {
        const fetchBuildingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setBuilding(response.data);
            } catch (err) {
                console.error("Error fetching building details:", err);
                setError("Failed to load building details.");
            }
        };
        fetchBuildingDetails();
    }, [id, accessToken]);

    // Funkcja do przełączania statusu zatwierdzenia budynku
    const toggleApprove = async () => {
        try {
            const newStatus = !building.isApproved;
            await axios.patch(
                `http://localhost:8081/api/v1/building/${id}/approve`,
                null,
                {
                    params: { isApproved: newStatus },
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            setSuccessMessage(`Building ${newStatus ? "approved" : "disapproved"} successfully!`);
            // Aktualizacja stanu budynku
            setBuilding({ ...building, isApproved: newStatus });
        } catch (err) {
            console.error("Error toggling building approval:", err);
            setError("Failed to change the building status.");
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!building) return <p>Loading...</p>;

    return (
        <div className="ap-details-container">

            {successMessage && <p className="success-message">{successMessage}</p>}

            <p><strong>ID:</strong> {building.id}</p>
            <hr />
            <p><strong>Name:</strong> {building.building}</p>
            <p><strong>Description:</strong> {building.description}</p>
            <hr />
            <p><strong>Street:</strong> {building.address.address}</p>
            <p><strong>City:</strong> {building.address.city.city}</p>
            <p><strong>Country:</strong> {building.address.country.country}</p>
            <hr />
            <p><strong>Status:</strong> {building.status}</p>
            <p><strong>Approved:</strong> {building.isApproved ? "Yes" : "No"}</p>
            <button onClick={toggleApprove} className="create-button action-button">
                {building.isApproved ? "Disapprove Building" : "Approve Building"}
            </button>
            <hr />
            <p><strong>Created At:</strong> {new Date(building.creationDate).toLocaleString()}</p>
            <p><strong>Last Edited:</strong> {new Date(building.editDate).toLocaleString()}</p>
            <hr />
            <p><strong>Added by user:</strong> {building.userId}</p>

            <h2>Photos:</h2>
            <div className="photos-container">
                {building.photos && building.photos.length > 0 ? (
                    building.photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                            <img
                                src={photo.url}
                                alt={`Building ${index + 1}`}
                                style={{ maxWidth: "200px", marginBottom: "10px" }}
                            />
                        </div>
                    ))
                ) : (
                    <p>No photos available.</p>
                )}
            </div>


        </div>
    );
};

export default BuildingsDetails;
