import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const DesksDetails = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [desk, setDesk] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDeskDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/building/desk/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setDesk(response.data);
      } catch (err) {
        console.error("Error fetching desk details:", err);
        setError("Failed to load desk details.");
      }
    };

    fetchDeskDetails();
  }, [id, accessToken]);

  const toggleApprove = async () => {
    try {
      const newStatus = !desk.isApproved;
      await axios.patch(
        `http://localhost:8081/api/v1/building/desk/${id}/approve`,
        null,
        {
          params: { isApproved: newStatus },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSuccessMessage(`Desk ${newStatus ? "approved" : "disapproved"} successfully!`);
      setDesk({ ...desk, isApproved: newStatus });
    } catch (err) {
      console.error("Error toggling desk approval:", err);
      setError("Failed to change the desk status.");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!desk) return <p>Loading...</p>;

  return (
    <div className="ap-details-container">
      {successMessage && <p className="success-message">{successMessage}</p>}

      <p><strong>ID:</strong> {desk.id}</p>
      <p><strong>Name:</strong> {desk.desk}</p>
      <p><strong>Equipment:</strong> {desk.equipment}</p>
      <p><strong>Description:</strong> {desk.description}</p>
      <p><strong>Price:</strong> ${desk.price}</p>
      <p><strong>Status:</strong> {desk.status}</p>
      <p><strong>Approved:</strong> {desk.isApproved ? "Yes" : "No"}</p>

      <button onClick={toggleApprove} className="create-button action-button">
        {desk.isApproved ? "Disapprove Desk" : "Approve Desk"}
      </button>

      <h2>Photos:</h2>
      <ul>
        {desk.photos.map((photo, index) => (
          <li key={index}>
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              style={{ maxWidth: "200px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesksDetails;