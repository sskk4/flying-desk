import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Rooms = () => {
  const { accessToken } = useAuth();
  const { buildingId } = useParams(); // Pobranie ID budynku z URL
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("creationDate,desc");
  const navigate = useNavigate();

  // Pobieranie pokoi dla budynku
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setError("");
        const params = {
          page,
          size,
          sort,
          search,
        };

        const response = await axios.get(`http://localhost:8081/api/v1/building/${buildingId}/rooms`, {
          params,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setRooms(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms for this building.");
      }
    };
    fetchRooms();
  }, [accessToken, buildingId, page, size, sort, search]);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="rooms-container">
      {/* Filtry i wyszukiwanie */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by room name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ap-search-bar"
        />

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

      {/* Tabela pokoi */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Equipment</th>
            <th>Description</th>
            <th>Max Occupants</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.room}</td>
                <td>{room.equipment}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No rooms found for this building.
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

export default Rooms;
