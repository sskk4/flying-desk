import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import debounce from "lodash.debounce";
import "../../components/Card/Card.css";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    isApproved: true,
    search: "",
    sort: "asc",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page
  };

  const handleSearchChange = debounce((search) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(0); // Reset to first page
  }, 300);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8081/api/v1/building/rooms", {
          params: {
            ...filters,
            search: filters.search || null,
            page,
            size: 10,
          },
        });

        setRooms(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters, page]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <SearchBar
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={(sort) => handleFilterChange("sort", sort)}
      />
      <div className="result-count">
        <label>{rooms.length} results</label>
        <hr />
      </div>

      {rooms.length > 0 ? (
        <div className="card-container">
          {rooms.map((room) => (
            <div className="card" key={room.id}>
              <div className="card-image">
                <img
                  className="card-img"
                  src={room.photos?.[0]?.url || "https://via.placeholder.com/400"}
                  alt={room.room}
                />
                <h2 className="card-title">{room.room}</h2>
                <h4 className="card-title">
                  
                 {room.building.address.city.city}, {room.building.address.address}, {room.building.address.country.country}
            
          
                </h4>
                <p className="card-price"> {room.price} €</p>
              
                <Link to={`/room/${room.id}`}>
                  <button className="purple-button card-button">Check</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No rooms found.</div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RoomsList;
