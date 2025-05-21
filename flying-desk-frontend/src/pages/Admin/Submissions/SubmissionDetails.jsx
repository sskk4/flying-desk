import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const SubmissionDetails = () => {
  const { id } = useParams(); 
  const { accessToken, user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

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
      if (newStatus === "REJECTED") {
        if (!rejectionReason.trim()) {
          setError("Reason for rejection is required.");
          setLoading(false);
          return;
        }
        
        await axios.patch(
          `http://localhost:8081/api/v1/submissions/${id}/status?status=${newStatus}&rejectionReason=${encodeURIComponent(rejectionReason)}`,
          null, 
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        await updateUserRole("USER");
      } else {
        await axios.patch(
          `http://localhost:8081/api/v1/submissions/${id}/status?status=${newStatus}`,
          null, 
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (newStatus === "APPROVED") {
          await updateUserRole("OWNER");
        } else if (newStatus === "PENDING") {
          await updateUserRole("USER");
        }
      }
      
      setMessage(`Status updated to ${newStatus}`);

      setShowRejectionForm(false);
      setRejectionReason("");

      fetchSubmissionDetails(); 
    } catch (err) {
      console.error("Error updating submission status:", err);
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole) => {
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
      setMessage((prevMessage) => `${prevMessage}. User role updated to ${newRole}`);
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };
  
  const handleRejection = () => {
    setShowRejectionForm(true);
  };
  
  const submitRejection = () => {
    updateSubmissionStatus("REJECTED");
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
      {submission.rejectionReason && (
        <p>
          <strong>Rejection Reason:</strong> {submission.rejectionReason}
        </p>
      )}
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
      <h2>Actions for submission</h2>
      <div className="actions-container">
        {!showRejectionForm ? (
          <>
            <button
              onClick={() => updateSubmissionStatus("APPROVED")}
              disabled={loading}
              className="create-button action-button"
            >
              Approve and Set as Owner
            </button>
            <button
              onClick={handleRejection}
              disabled={loading}
              className="create-button action-button"
            >
              Reject and Set as User
            </button>
            <button
              onClick={() => updateSubmissionStatus("PENDING")}
              disabled={loading}
              className="create-button action-button"
            >
              Mark as Pending and Set as User
            </button>
          </>
        ) : (
          <div className="rejection-form">
            <h3>Enter reason for rejection:</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              cols={50}
              placeholder="Provide a reason for rejection..."
              required
            />
            <div className="rejection-buttons">
              <button 
                onClick={submitRejection}
                disabled={loading || !rejectionReason.trim()}
                className="create-button action-button"
              >
                Submit Rejection
              </button>
              <button
                onClick={() => setShowRejectionForm(false)}
                disabled={loading}
                className="create-button action-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;