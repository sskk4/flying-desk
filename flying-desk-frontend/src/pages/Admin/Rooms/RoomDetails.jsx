import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const RoomsDetails = () => {
    const { id } = useParams(); 
    const { accessToken } = useAuth();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building/room/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setRoom(response.data);
            } catch (err) {
                console.error("Error fetching room details:", err);
                setError("Failed to load room details.");
            }
        };
        fetchRoomDetails();
    }, [id, accessToken]);

    if (error) return <p className="error-message">{error}</p>;
    if (!room) return <p>Loading...</p>;

    return (
        <div className="ap-details-container">
            <p><strong>ID:</strong> {room.id}</p>
            <p><strong>Name:</strong> {room.room}</p>
            <p><strong>Equipment:</strong> {room.equipment}</p>
            <hr />
            <p><strong>Building:</strong> {room.building.building}</p>
            <p><strong>Description:</strong> {room.description}</p>
            <p><strong>Max Occupants:</strong> {room.maxOccupants}</p>
            <p><strong>Status:</strong> {room.status}</p>
            <hr />
            <p><strong>Creation date:</strong> {room.creationDate} </p>
            <p><strong>Edit date:</strong> {room.editDate}</p>
            <p><strong>Approved status:</strong> {String(room.isApproved)}</p>

            <h2>Photos:</h2>
            <ul>
                {room.photos.map((photo, index) => (
                    <li key={index}>
                        <img src={photo.url} alt={`Photo ${index + 1}`} style={{ maxWidth: "200px" }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomsDetails;
