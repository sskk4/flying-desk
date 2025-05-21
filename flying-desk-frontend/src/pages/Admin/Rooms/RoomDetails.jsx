
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const RoomsDetails = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/room/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setRoom(response.data);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to load room details.");
      }
    };

    fetchRoomDetails();
  }, [id, accessToken]);

  const toggleApprove = async () => {
    try {
      const newStatus = !room.isApproved;
      await axios.patch(
        `http://localhost:8081/api/v1/building/room/${id}/approve`,
        null,
        {
          params: { isApproved: newStatus },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSuccessMessage(`Room ${newStatus ? "approved" : "disapproved"} successfully!`);
      setRoom({ ...room, isApproved: newStatus });
    } catch (err) {
      console.error("Error toggling room approval:", err);
      setError("Failed to change the room status.");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!room) return <p>Loading...</p>;

  return (
    <div className="ap-details-container">
      {successMessage && <p className="success-message">{successMessage}</p>}

      <p><strong>ID:</strong> {room.id}</p>
      <p><strong>Name:</strong> {room.room}</p>
      <p><strong>Equipment:</strong> {room.equipment}</p>
      <hr />
      <p><strong>Building:</strong> {room.building.building}</p>
      <p><strong>Description:</strong> {room.description}</p>
      <p><strong>Max Occupants:</strong> {room.maxOccupants}</p>
      <p><strong>Status:</strong> {room.status}</p>
      <p><strong>Approved:</strong> {room.isApproved ? "Yes" : "No"}</p>

      <button onClick={toggleApprove} className="create-button action-button">
        {room.isApproved ? "Disapprove Room" : "Approve Room"}
      </button>

      <hr />
      <p><strong>Creation date:</strong> {room.creationDate}</p>
      <p><strong>Edit date:</strong> {room.editDate}</p>

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