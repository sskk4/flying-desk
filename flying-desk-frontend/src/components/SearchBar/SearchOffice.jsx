import React, { useState, useEffect } from "react"; // React oraz hooki
import axios from "axios"; // Do obsługi żądań HTTP
import './SearchBar.css'; 


const SearchWithFilters = ({ onSearchChange, onFilterChange, onSortChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8081/api/v1/country")
      .then(res => setCountries(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.get(`http://localhost:8081/api/v1/city/by-country/${selectedCountry}`)
        .then(res => setCities(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCountry]);

  const toggleFilters = () => setIsFiltersOpen(prev => !prev);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterKey, value) => {
    if (filterKey === "countryId") setSelectedCountry(value);
    if (filterKey === "cityId") setSelectedCity(value);
    onFilterChange(filterKey, value);
  };

  return (
    <div className="search-with-filters">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        <button onClick={toggleFilters}>Filters</button>
      </div>

      {/* Filters Bar */}
      {isFiltersOpen && (
        <div className="filters-bar">
          <div>
            <label>Country:</label>
            <select onChange={e => handleFilterChange("countryId", e.target.value)} value={selectedCountry}>
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.country}</option>
              ))}
            </select>
          </div>
          <div>
            <label>City:</label>
            <select onChange={e => handleFilterChange("cityId", e.target.value)} value={selectedCity} disabled={!selectedCountry}>
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.city}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select onChange={e => onFilterChange("status", e.target.value)}>
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <button onClick={toggleFilters}>Close</button>
        </div>
      )}
    </div>
  );
};
