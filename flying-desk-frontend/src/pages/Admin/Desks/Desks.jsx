import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Desks = () => {
  const { accessToken } = useAuth();
  const [desks, setDesks] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); 
  const [filter, setFilter] = useState(""); 
  const [isApproved, setIsApproved] = useState("");
  const [sort, setSort] = useState("creationDate,desc"); 
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setError(""); 
        const params = {
          page,
          size,
          sort,
          search,
          filter,
          isApproved: isApproved === "" ? null : isApproved,
        };

        console.log("Fetching desks with params:", params); // Debug parametrów

        const response = await axios.get(`http://localhost:8081/api/v1/building/desks`, {
          params,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setDesks(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching desks:", err);
        setError("Failed to load desks.");
      }
    };
    fetchDesks();
  }, [accessToken, page, size, sort, search, filter, isApproved]);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="desks-container">
      {/* Filtry i wyszukiwanie */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Aktualizacja stanu wyszukiwania
          className="ap-search-bar"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Aktualizacja stanu filtrowania
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="out_of_service">Out of Service</option>
        </select>

        <select
          value={isApproved}
          onChange={(e) => setIsApproved(e.target.value)} // Aktualizacja stanu zatwierdzenia
          className="filter-select"
        >
          <option value="">All Approvals</option>
          <option value="1">Approved</option>
          <option value="0">Not Approved</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)} // Aktualizacja stanu sortowania
          className="sort-select"
        >
          <option value="creationDate,desc">Newest First</option>
          <option value="creationDate,asc">Oldest First</option>
          <option value="desk,asc">Desk Name (A-Z)</option>
          <option value="desk,desc">Desk Name (Z-A)</option>
        </select>
      </div>

      {/* Tabela biurek */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Equipment</th>
            <th>Building</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {desks.length > 0 ? (
            desks.map((desk) => (
              <tr key={desk.id}>
                <td>{desk.id}</td>
                <td>{desk.desk}</td>
                <td>{desk.equipment}</td>
                <td>{desk.building?.building || "N/A"}</td>
                <td>{desk.description}</td>
                <td>{desk.price}</td>
                <td className={`status-${desk.status.toLowerCase()}`}>{desk.status}</td>
                <td>{desk.isApproved ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="create-button"
                    onClick={() => navigate(`/admin-fd/desks/${desk.id}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No desks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginacja */}
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

export default Desks;
