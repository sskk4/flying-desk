import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../services/AuthProvider";

const Users = () => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id,asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        const response = await axios.get(`http://localhost:8080/api/v1/auth/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setTotalPages(Math.ceil(response.data.length / size));
        } else if (response.data.content) {
          setUsers(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      }
    };
    fetchUsers();
  }, [accessToken, page, size, sort]);

  const filteredUsers = users.filter(user => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    );
  });

  const paginatedUsers = filteredUsers.slice(page * size, (page + 1) * size);
  const calculatedTotalPages = Math.ceil(filteredUsers.length / size);

  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, calculatedTotalPages - 1));
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  if (error) return <p className="ap-error error-message">{error}</p>;

  return (
    <div className="rooms-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name, email or role"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); 
          }}
          className="ap-search-bar"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="id,asc">ID (Ascending)</option>
          <option value="id,desc">ID (Descending)</option>
          <option value="lastName,asc">Last Name (A-Z)</option>
          <option value="lastName,desc">Last Name (Z-A)</option>
          <option value="role,asc">Role (A-Z)</option>
          <option value="role,desc">Role (Z-A)</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="create-button"
                  onClick={() => navigate(`/admin-fd/users/${user.userId}`)}
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
          Page {page + 1} of {calculatedTotalPages || 1}
        </span>
        <button
          className="ap-paggination-button ap-p-b-right"
          onClick={goToNextPage}
          disabled={page >= calculatedTotalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;