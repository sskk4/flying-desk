// OfficeList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import debounce from "lodash.debounce";
import "../../components/Card/Card.css";

const OfficeList = () => {
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    countryId: "",
    cityId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    sort: "asc",
    search: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
    setPage(0); // Resetuj stronę po zmianie sortowania
  };

  const handleSearchChange = debounce((search) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(0); // Reset to first page
  }, 300);


  
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8081/api/v1/building", {
          params: {
            ...filters,
            search: filters.search || null,
            isApproved: true,
            page,
            size: 10,
          },
        });

        setBuildings(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        setError("Failed to fetch buildings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
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
  onSortChange={handleSortChange}
/>
<div className="result-count">
<label>4 results</label>
<hr></hr>
</div>

      {buildings.length > 0 ? (
        <div className="card-container">
          {buildings.map((building) => (
            <div className="card" key={building.id}>
               <div className="card-image">
              <img
              className="card-img"
                src={building.photos?.[0]?.url || "https://via.placeholder.com/400"}
                alt={building.building}
              />
              <h2 className="card-title">{building.building}</h2>
              <Link to={`/office/${building.id}`}>
                <button className="purple-button card-button">Check</button>
              </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No buildings found.</div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button  onClick={() => setPage(page - 1)} disabled={page === 0}>
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default OfficeList;
