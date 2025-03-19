import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import "../../components/Card/Card.css";
import debounce from "lodash.debounce";

const handleSearchChange = debounce((search) => {
  OfficeList((prev) => ({ ...prev, search }));
}, 300);

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
  };

 
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

        setBuildings(response.data.content); 
        setTotalPages(response.data.totalPages); 
      } catch (err) {
        setError("Failed to fetch buildings. Please try again later.");
        console.error("Error fetching buildings:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [filters, page]); 


  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };


  const handleSearchChange = (search) => {
    setFilters((prev) => ({ ...prev, search }));
  };


  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <Header />


      <SearchBar onSearchChange={handleSearchChange}>

      </SearchBar>


      <div className="card-container">
        {buildings.map((building) => (
          <div className="card" key={building.id}>
            <div className="card-image">
              <img
                className="card-img"
                src={
                  building.photos && building.photos.length > 0
                    ? building.photos[0].url 
                    : "https://via.placeholder.com/400"
                }
                alt={building.building}
                onError={(e) => {
                  console.error(`Error loading image for building ${building.id}:`, e);
                  e.target.src = "https://via.placeholder.com/400";
                }}
              />
            </div>
            <div className="card-title">{building.building}</div>
            <div className="card-price">
              <span className="card-small-text">Daily</span>
            </div>
            <Link to={`/office/${building.id}`}>
              <button className="purple-button card-button">Check</button>
            </Link>
            <div className="card-status">
              {building.status}
            </div>
          </div>
        ))}
      </div>

      {/* Paginacja */}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default OfficeList;
