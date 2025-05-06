import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
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
    sort: "creationDate-desc", 
    search: "",
  });

  const [tempFilters, setTempFilters] = useState({ ...filters }); 

  const applyFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...tempFilters,
    }));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value, 
    }));
    
    setPage(0); 
  };

  const handleSortChange = (sortValue) => {
    if (!sortValue) {
      console.error("Sort value is missing:", sortValue);
      return;
    }
    
    const [key, direction] = sortValue.split("-");
    if (!key || !direction) {
      console.error("Sort key or direction is missing:", { key, direction });
      return;
    }
    
    const sortString = `${key}-${direction}`;
    setTempFilters((prev) => ({ ...prev, sort: sortString }));
    applyFilters();
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
  
    if (filters.search) {
      queryParams.set("search", filters.search);
    } else {
      queryParams.delete("search");
    }
  
    window.history.replaceState(null, "", `?${queryParams.toString()}`);
  }, [filters.search]);
  
  useEffect(() => {
    const queryParams = new URLSearchParams();
  
    Object.entries({
      country: filters.countryId,
      city: filters.cityId,
      status: filters.status,
      startDate: filters.dateFrom,
      search: filters.search,
      endDate: filters.dateTo,
      sort: filters.sort || "creationDate-asc",
      page: page.toString(),
      size: "9",
    }).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  
    window.history.replaceState(null, "", `?${queryParams.toString()}`);
  }, [filters.countryId, filters.cityId, filters.status, filters.dateFrom, filters.dateTo,filters.search, filters.sort, page]);
  
  const handleSearchChange = (searchValue) => {
    setTempFilters((prev) => ({
      ...prev,
      search: searchValue,
    }));
    setPage(0); 
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    })); 
  };
  
        

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
    
        const [sortBy, sortDir] = (typeof filters.sort === "string" ? filters.sort : "").split("-");
        const params = {
          country: filters.countryId || null,
          city: filters.cityId || null,
          status: filters.status || null,
          startDate: filters.dateFrom || null,
          endDate: filters.dateTo || null,
          search: filters.search || null,
          sortBy,
          sortDir,
          page,
          size: 10,
          isApproved: true,
        };
    
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== null)
        );
    
        console.log("Wysyłane parametry do API:", filteredParams);
    
        const response = await axios.get("http://localhost:8081/api/v1/building", {
          params: filteredParams,
        });
    
        const buildingsData = response.data?.content || [];
    
        const buildingsWithDesks = await Promise.all(
          buildingsData.map(async (building) => {
            try {
              const desksResponse = await axios.get(
                `http://localhost:8081/api/v1/building/${building.id}/desks`
              );
    
              if (desksResponse.data.content.length > 0) {
                return building;
              }
            } catch (error) {
              console.error(`Błąd przy pobieraniu biurek dla budynku ${building.id}:`, error);
            }
            return null;
          })
        );
    
        setBuildings(buildingsWithDesks.filter((building) => building !== null));
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
        setError("Failed to fetch buildings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBuildings();
  }, [filters, page]); 
  
  


  
  return (
    <div>
      <Header />
      <SearchBar
  filterType="office" 
  onSearchChange={handleSearchChange}
  onFilterChange={handleFilterChange}
  onSortChange={handleSortChange}
/>

      <div className="result-count">
        <label>{buildings.length} results</label>
        <hr />

        <h2>Check desk for rent in office spaces </h2>
      </div>


      {loading &&<div className="loader-container">  <div className="loader"></div> </div>}
      {error && <div className="error-container">{error} <hr></hr></div>}

      {buildings.length > 0 ? (
  <div className="card-container">
    {buildings.map((building) => (
      <div className="card" key={building.id}>
        <div className="card-image">
          <img
            src={building.photos?.[0]?.url || "https://via.placeholder.com/400"}
            alt={building.building}
            className="card-img"
          />
          <h2 className="card-title">{building.building}</h2>
          <h4 className="card-title">
            {building.address.city.city}, {building.address.address},{" "}
            {building.address.country.country}
          </h4>
          <h4 className="card-status">{building.status}</h4>
          <Link to={`/office/${building.id}`}>
            <button className="purple-button card-button">Check</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
) : !loading && !error ? ( 
  <div className="no-results">
    {filters.search
      ? `No offices found for "${filters.search}". Try adjusting your search.`
      : "No offices available. Try modifying your filters or search criteria."}
  </div>
) : null}


      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-left-button" onClick={() => setPage(page - 1)} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button className="pagination-right-button" onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OfficeList;
