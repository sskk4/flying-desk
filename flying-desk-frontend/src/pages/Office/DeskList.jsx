import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import "../../components/Card/Card.css";

const DeskList = () => {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    countryId: "",
    cityId: "",
    status: "",
    equipment: "",
    dateFrom: "",
    dateTo: "",
    priceFrom: "",
    priceTo: "",
    sort: "desk-asc",
    search: "",
  });

    const [tempFilters, setTempFilters] = useState({ ...filters }); 

    const applyFilters = debounce(() => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...tempFilters, // Mieszamy filtry zaktualizowane z tymczasowymi
      }));
      setPage(0); // Resetowanie do pierwszej strony po zmianie
    }, 500);

    const handleFilterChange = (field, value) => {
      // Bezpośrednia synchronizacja filtrów
      setFilters((prev) => ({
        ...prev,
        [field]: value, // Aktualizacja właściwości
      }));
      
      setPage(0); // Resetowanie strony
    };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
    setPage(0);
  };

  const handleSearchChange = (search) => {
    setFilters((prev) => ({
      ...prev,
      search, // Aktualizacja wyszukiwania w głównych filtrach
    }));
    setPage(0); // Resetowanie strony
  };


    useEffect(() => {
      const queryParams = new URLSearchParams();
    
      Object.entries({
        country: filters.countryId,   // Zmapowane na API
        city: filters.cityId,         // Zmapowane na API
        status: filters.status,
        startDate: filters.dateFrom,  // Zmieniona nazwa
        endDate: filters.dateTo,      // Zmieniona nazwa
        equipment: filters.equipment,
        minPrice: filters.priceFrom,
        maxPrice: filters.priceTo,
        sort: filters.sort,
        page: page.toString(),
        size: "9",
      }).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    
      window.history.replaceState(null, "", `?${queryParams.toString()}`);
    }, [filters, page]);



  
    useEffect(() => {
      const fetchDesks = async () => {
        try {
          setLoading(true);
    
          const [sortBy, sortDir] = filters.sort.split("-");
          const params = {
            country: filters.countryId || null,
            city: filters.cityId || null,
            status: filters.status || null,
            startDate: filters.dateFrom || null,
            endDate: filters.dateTo || null,
            equipment: filters.equipment || null,
            minPrice: filters.priceFrom || null,
            maxPrice: filters.priceTo || null,
            sortBy,
            sortDir,
            page,
            size: 9,
 
          };
    
          const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== null)
          );
    
          console.log("Wysyłane parametry do API:", filteredParams);
    
          const response = await axios.get("http://localhost:8081/api/v1/building/desks", {
            params: filteredParams,
          });
    
          setDesks(response.data?.content || []);
          setTotalPages(response.data?.totalPages || 0);
        } catch (err) {
          console.error("Błąd podczas pobierania danych:", err);
          setError("Failed to fetch desks. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchDesks();
    }, [filters, page]); // Filtry i strona jako wyzwalacze

  return (
    <div>
      <Header />

        <SearchBar
          filterType="desk" // Filtry dla biurek
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

<div className="result-count">
        <label>{desks.length} results</label>
        <hr />
      </div>

      {loading &&<div className="loader-container">  <div className="loader"></div> </div>}
      {error && <div className="error-container">{error} <hr></hr></div>}

      {desks.length > 0 ? (
  <div className="card-container">
    {desks.map((desk) => (
      <div className="card" key={desk.id}>
        <div className="card-image">
          <img
            src={desk.photos?.[0]?.url || "https://via.placeholder.com/400"}
            alt={desk.desk}
            className="card-img"
          />
          <h2 className="card-title">{desk.desk}</h2>
          <h4 className="card-title">
            {desk.building.address.city.city}, {desk.building.address.address},{" "}
            {desk.building.address.country.country}
          </h4>
          <h4 className="card-status">{desk.building.status}</h4>
          <Link to={`/desk/${desk.building.id}`}>
            <button className="purple-button card-button">Check</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
) : !loading && !error ? ( // Wyświetlamy tylko, gdy nie ma błędów ani ładowania
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
export default DeskList;
