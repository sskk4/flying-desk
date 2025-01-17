import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const SubmissionDetails = () => {
  const { id } = useParams(); // Get submission ID from the URL
  const { accessToken, user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubmissionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/submissions/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSubmission(response.data);
    } catch (err) {
      console.error("Error fetching submission details:", err);
      setError("Failed to load submission details.");
    }
  };

  const updateSubmissionStatus = async (newStatus) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
await axios.patch(
  `http://localhost:8081/api/v1/submissions/${id}/status?status=${newStatus}`,
  null, // Możesz przekazać `null`, jeśli body nie jest wymagane
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
          
      setMessage(`Status updated to ${newStatus}`);
      fetchSubmissionDetails(); // Refresh details
    } catch (err) {
      console.error("Error updating submission status:", err);
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole) => {
    setLoading(true);
    setError("");
    setMessage("");
  
    try {
      await axios.put(
        `http://localhost:8080/api/v1/auth/set-role/${submission.userId}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessage(`Role updated to ${newRole}`);
    } catch (err) {
      console.error("Error updating user role:", err);
  
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSubmissionDetails();
  }, [id, accessToken]);

  if (error) return <p className="error-message">{error}</p>;
  if (!submission) return <p>Loading...</p>;

  return (
    
    <div className="ap-details-container">
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
      <p>
        <strong>ID:</strong> {submission.id}
      </p>
      <p>
        <strong>Added by user with ID:</strong> {submission.userId}
      </p>
      <hr />
      <p>
        <strong>Name:</strong> {submission.firstName} {submission.lastName}
      </p>
      <p>
        <strong>Phone:</strong> {submission.phone}
      </p>
      <p>
        <strong>Email:</strong> {submission.email}
      </p>
      <hr />
      <p>
        <strong>Address:</strong> {submission.address}
      </p>
      <p>
        <strong>Building Name:</strong> {submission.buildingName}
      </p>
      <p>
        <strong>Description:</strong> {submission.buildingDescription}
      </p>
      <hr />
      <p>
        <strong>Status:</strong> {submission.status}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(submission.createdAt).toLocaleString()}
      </p>
      <h2>Photos:</h2>
      <ul>
        {submission.photos.map((photo, index) => (
          <li key={index}>
            <img src={photo.url} alt={`Photo ${index + 1}`} style={{ maxWidth: "200px" }} />
          </li>
        ))}
      </ul>
      <hr />
      <h2>Actions for subbmision</h2>
      <div className="actions-container">
        <button
          onClick={() => updateSubmissionStatus("APPROVED")}
          disabled={loading}
          className="create-button action-button"
        >
          Approve
        </button>
        <button
          onClick={() => updateSubmissionStatus("REJECTED")}
          disabled={loading}
          className="create-button action-button"
        >
          Reject
        </button>
        <button
          onClick={() => updateSubmissionStatus("PENDING")}
          disabled={loading}
          className="create-button action-button"
        >
          Mark as Pending
        </button>
        <hr />
        <h2>Change the role for the user who added subbmision </h2>
        <button
          onClick={() => updateUserRole("OWNER")}
          disabled={loading}
          className="create-button action-button"
        >
          Set Role to Owner
        </button>
        <button
          onClick={() => updateUserRole("USER")}
          disabled={loading}
          className="create-button action-button"
        >
          Set Role to User
        </button>
      </div>

    </div>
  );
};

export default SubmissionDetails;
