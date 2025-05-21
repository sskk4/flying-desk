import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Rents = () => {
  const { accessToken } = useAuth();
  const [rents, setRents] = useState([]);
  const [filteredRents, setFilteredRents] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const navigate = useNavigate();

  // Fetch all rents
  useEffect(() => {
    const fetchRents = async () => {
      try {
        setError("");
        
        // Use the admin endpoint to get all rents
        const response = await axios.get(`http://localhost:8083/api/v1/rent/admin/all`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Store the complete list of rents
        if (Array.isArray(response.data)) {
          setRents(response.data);
        } else {
          setRents(response.data.content || []);
        }
      } catch (err) {
        console.error("Error fetching rents:", err);
        setError("Failed to load rents.");
      }
    };
    fetchRents();
  }, [accessToken]);

  // Apply filtering, sorting, and pagination
  useEffect(() => {
    // Filter rents based on search, status, and resource type
    let results = [...rents];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(rent => 
        rent.id.toString().includes(searchLower) || 
        rent.userId.toString().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      results = results.filter(rent => rent.status === statusFilter);
    }
    
    // Apply resource type filter
    if (resourceTypeFilter) {
      results = results.filter(rent => rent.resourceType === resourceTypeFilter);
    }
    
    // Apply sorting
    const [sortField, sortDirection] = sort.split(',');
    results.sort((a, b) => {
      let comparison = 0;
      
      // Handle different sort fields
      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortField === 'startDate') {
        comparison = new Date(a.startDate || 0) - new Date(b.startDate || 0);
      } else if (sortField === 'price') {
        comparison = (a.price || 0) - (b.price || 0);
      }
      
      // Apply sort direction
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    // Calculate total pages based on filtered results
    const calculatedTotalPages = Math.ceil(results.length / size);
    setTotalPages(calculatedTotalPages || 1);
    
    // Apply pagination
    const paginatedResults = results.slice(page * size, (page + 1) * size);
    setFilteredRents(paginatedResults);
    
  }, [rents, page, size, sort, search, statusFilter, resourceTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, resourceTypeFilter, sort]);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    return new Date(dateTime).toLocaleString();
  };

  const getResourceTypeName = (type) => {
    switch (type) {
      case "ROOM":
        return "Room";
      case "DESK":
        return "Desk";
      default:
        return type;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "PAID":
        return "status-available";
      case "CANCELLED":
        return "status-out_of_service";
      default:
        return "";
    }
  };

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="rents-container">
      {/* Filters and search */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by ID or user ID"
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
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={resourceTypeFilter}
          onChange={(e) => setResourceTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Resources</option>
          <option value="ROOM">Room</option>
          <option value="DESK">Desk</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt,desc">Newest First</option>
          <option value="createdAt,asc">Oldest First</option>
          <option value="startDate,asc">Start Date (Earliest First)</option>
          <option value="startDate,desc">Start Date (Latest First)</option>
          <option value="price,asc">Price (Low to High)</option>
          <option value="price,desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Rents table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Resource Type</th>
            <th>Resource ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRents.length > 0 ? (
            filteredRents.map((rent) => (
              <tr key={rent.id}>
                <td>{rent.id}</td>
                <td>{rent.userId}</td>
                <td>{getResourceTypeName(rent.resourceType)}</td>
                <td>{rent.resourceId}</td>
                <td>{formatDateTime(rent.startDate)}</td>
                <td>{formatDateTime(rent.endDate)}</td>
                <td>${rent.price ? rent.price.toFixed(2) : "0.00"}</td>
                <td className={getStatusClass(rent.status)}>{rent.status}</td>
                <td>{formatDateTime(rent.createdAt)}</td>
                <td>
                  <button
                    className="create-button"
                    onClick={() => navigate(`/admin-fd/rents/${rent.id}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No rents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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

export default Rents;