import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const RentDetails = () => {
  const { id } = useParams(); // Get rent ID from URL
  const { accessToken } = useAuth();
  const [rent, setRent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        setError("");
        setLoading(true);
        
        const response = await axios.get(`http://localhost:8083/api/v1/rent/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        setRent(response.data);
      } catch (err) {
        console.error("Error fetching rent details:", err);
        setError("Failed to load rent details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, [id, accessToken]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!rent) return;
      
      try {
        setLoading(true);
        
        const response = await axios.get(`http://localhost:8083/api/v1/payment/rent/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (Array.isArray(response.data)) {
          setPayments(response.data);
        } else if (response.data.content && Array.isArray(response.data.content)) {
          setPayments(response.data.content);
        } else {
          setPayments([response.data]);
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [rent, id, accessToken]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    return new Date(dateTime).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "PAID":
        return "status-available";
      case "CANCELLED":
        return "status-out_of_service";
      case "COMPLETED":
        return "status-available";
      case "FAILED":
        return "status-out_of_service";
      default:
        return "";
    }
  };

  const getResourceTypeName = (type) => {
    switch (type) {
      case "ROOM":
        return "Room";
      case "DESK":
        return "Desk";
      default:
        return type || "N/A";
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (loading && !rent) return <p>Loading...</p>;

  return (
    <div className="ap-details-container">
      <p><strong>ID:</strong> {rent?.id}</p>
      <p><strong>User ID:</strong> {rent?.userId}</p>
      <p><strong>Resource Type:</strong> {getResourceTypeName(rent?.resourceType)}</p>
      <p><strong>Resource ID:</strong> {rent?.resourceId}</p>
      
      <hr />
      
      <p><strong>Start Date:</strong> {formatDateTime(rent?.startDate)}</p>
      <p><strong>End Date:</strong> {formatDateTime(rent?.endDate)}</p>
      <p><strong>Price:</strong> ${rent?.price ? rent.price.toFixed(2) : "0.00"}</p>
      <p><strong>Status:</strong> <span className={getStatusClass(rent?.status)}>{rent?.status}</span></p>
      
      <hr />
      
      <p><strong>Created At:</strong> {formatDateTime(rent?.createdAt)}</p>
      <p><strong>Updated At:</strong> {formatDateTime(rent?.updatedAt)}</p>
      
      <hr />
      
      <h2>Related Payments:</h2>
      {loading && <p>Loading payments...</p>}
      {!loading && payments.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.userId}</td>
                <td>${payment.amount ? payment.amount.toFixed(2) : "0.00"}</td>
                <td>{payment.paymentMethod}</td>
                <td className={getStatusClass(payment.status)}>{payment.status}</td>
                <td>{payment.transactionId || "N/A"}</td>
                <td>{formatDateTime(payment.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found for this rent.</p>
      )}
    </div>
  );
};

export default RentDetails;