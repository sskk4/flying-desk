import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Payments = () => {
  const { accessToken } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setError("");
        
        const response = await axios.get(`http://localhost:8083/api/v1/payment/admin/all`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          setPayments(response.data.content || []);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments.");
      }
    };
    fetchPayments();
  }, [accessToken]);

  useEffect(() => {
    let results = [...payments];

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(payment => 
        payment.id.toString().includes(searchLower) || 
        payment.userId.toString().includes(searchLower) ||
        payment.rent?.id.toString().includes(searchLower) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower))
      );
    }

    if (statusFilter) {
      results = results.filter(payment => payment.status === statusFilter);
    }

    if (paymentMethodFilter) {
      results = results.filter(payment => payment.paymentMethod === paymentMethodFilter);
    }

    const [sortField, sortDirection] = sort.split(',');
    results.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortField === 'amount') {
        comparison = (a.amount || 0) - (b.amount || 0);
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    const calculatedTotalPages = Math.ceil(results.length / size);
    setTotalPages(calculatedTotalPages || 1);

    const paginatedResults = results.slice(page * size, (page + 1) * size);
    setFilteredPayments(paginatedResults);
    
  }, [payments, page, size, sort, search, statusFilter, paymentMethodFilter]);

  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, paymentMethodFilter, sort]);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    return new Date(dateTime).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "COMPLETED":
        return "status-available";
      case "FAILED":
        return "status-out_of_service";
      case "CANCELLED":
        return "status-out_of_service";
      default:
        return "";
    }
  };

  const handleViewDetails = (payment) => {
    if (payment.rent && payment.rent.id) {
      navigate(`/admin-fd/rents/${payment.rent.id}`);
    } else {
      setError("Cannot view details: No associated rent found for this payment.");
    }
  };

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="payments-container">
      
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by ID, user ID, rent ID or transaction ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ap-search-bar"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Payment Methods</option>
          <option value="CARD">Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CASH">Cash</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt,desc">Newest First</option>
          <option value="createdAt,asc">Oldest First</option>
          <option value="amount,asc">Amount (Low to High)</option>
          <option value="amount,desc">Amount (High to Low)</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Rent ID</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Transaction ID</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.userId}</td>
                <td>{payment.rent ? payment.rent.id : "N/A"}</td>
                <td>${payment.amount ? payment.amount.toFixed(2) : "0.00"}</td>
                <td>{payment.paymentMethod}</td>
                <td className={getStatusClass(payment.status)}>{payment.status}</td>
                <td>{payment.transactionId || "N/A"}</td>
                <td>{formatDateTime(payment.createdAt)}</td>
                <td>
                  <button
                    className="create-button"
                    onClick={() => handleViewDetails(payment)}
                    disabled={!payment.rent || !payment.rent.id}
                  >
                    View Rent Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="ap-pagination-controls">
        <button
          className="ap-paggination-button ap-p-b-left"
          onClick={goToPreviousPage}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="ap-paggination-text">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="ap-paggination-button ap-p-b-right"
          onClick={goToNextPage}
          disabled={page === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Payments;