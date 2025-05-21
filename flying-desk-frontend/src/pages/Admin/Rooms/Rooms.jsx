import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Rooms = () => {
  const { accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);
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
    const fetchRooms = async () => {
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

        console.log("Fetching rooms with params:", params); 

        const response = await axios.get(`http://localhost:8081/api/v1/building/rooms`, {
          params,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setRooms(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms.");
      }
    };
    fetchRooms();
  }, [accessToken, page, size, sort, search, filter, isApproved]);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="rooms-container">

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
          className="ap-search-bar"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)} 
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>

        <select
          value={isApproved}
          onChange={(e) => setIsApproved(e.target.value)}
          className="filter-select"
        >
          <option value="">All Approvals</option>
          <option value="1">Approved</option>
          <option value="0">Not Approved</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="creationDate,desc">Newest First</option>
          <option value="creationDate,asc">Oldest First</option>
          <option value="room,asc">Room Name (A-Z)</option>
          <option value="room,desc">Room Name (Z-A)</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Equipment</th>
            <th>Building</th>
            <th>Description</th>
            <th>Max Occupants</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.room}</td>
              <td>{room.equipment}</td>
              <td>{room.building?.building || "N/A"}</td>
              <td>{room.description}</td>
              <td>{room.maxOccupants}</td>
              <td className={`status-${room.status.toLowerCase()}`}>{room.status}</td>
              <td>{room.isApproved ? "Yes" : "No"}</td>
              <td>
                <button
                  className="create-button"
                  onClick={() => navigate(`/admin-fd/rooms/${room.id}`)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
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

export default Rooms;
