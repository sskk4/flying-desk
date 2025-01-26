import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import arrowDownIcon from "../../assets/icons/arrow-down.svg";
import arrowUpIcon from "../../assets/icons/arrow-up.svg";
import "./FiltresBar.css";

const FiltresBar = ({
  isFiltersOpen,
  toggleFilters,
  onFilterChange = () => {}, // Domyślna funkcja, jeśli brak propsa
  onSortChange = () => {}, // Domyślna funkcja, jeśli brak propsa
}) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Pobieranie krajów przy montowaniu komponentu
  useEffect(() => {
    console.log("Fetching countries...");
    axios
      .get("http://localhost:8081/api/v1/country")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Pobieranie miast po wybraniu kraju
  useEffect(() => {
    if (selectedCountry) {
      console.log("Fetching cities for country: ", selectedCountry);
      axios
        .get(`http://localhost:8081/api/v1/city/by-country/${selectedCountry}`)
        .then((res) => setCities(res.data))
        .catch((err) => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  // Obsługa zmiany kraju
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    console.log("Country changed:", countryId); // Logowanie zmiany kraju
    onFilterChange("countryId", countryId);
  };

  // Obsługa zmiany miasta
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    console.log("City changed:", cityId); // Logowanie zmiany miasta
    onFilterChange("cityId", cityId);
  };

  // Obsługa zmiany sortowania
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    console.log("Sort order changed:", sortValue); // Logowanie zmiany sortowania
    onSortChange(sortValue);
  };

  // Obsługa zmiany statusu
  const handleStatusChange = (e) => {
    const status = e.target.value;
    console.log("Status changed:", status); // Logowanie zmiany statusu
    onFilterChange("status", status);
  };

  // Obsługa zmiany zakresu dat
  const handleDateRangeChange = (field, value) => {
    console.log(`${field} changed to: ${value}`); // Logowanie zmiany zakresu dat
    onFilterChange(field, value);
  };

  return (
    <div className="filtres-bar">
      {!isFiltersOpen && (
        <div className="filtres-bar-close">
          <div className="filtres-bar-left">
          <Link className="light-purple-button active-button" to="/">
              Offices
            </Link>
            <Link className="light-purple-button" to="/rooms">
              Rooms
            </Link>
            <Link className="light-purple-button" to="/desks">
              Desks
            </Link>
          </div>
          <div className="filtres-bar-right">
            <div className="filtres-bar-right-panel">
        
              <label>Sort by:</label>
              <select onChange={handleSortChange}>
                <option value="asc">Alphabetically (A-Z)</option>
                <option value="desc">Alphabetically (Z-A)</option>
                <option value="creationDate">Creation Date</option>
              </select>
 
              <div className="arrow-show" onClick={toggleFilters}>
                <img className="arrow" src={arrowDownIcon} alt="Down Arrow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isFiltersOpen && (
        <div className="filtres-bar-open">
          <div className="filtres-bar-top">
            <div className="filtres-item">
              <label>Country:</label>
              <select onChange={handleCountryChange} value={selectedCountry}>
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="filtres-item">
              <label>Destination: </label>
              <select
                onChange={handleCityChange}
                value={selectedCity}
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filtres-item">
              <label>Status:</label>
              <select onChange={handleStatusChange}>
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="filtres-item">
              <label>Date Range From:</label>
              <input
                type="date"
                onChange={(e) => handleDateRangeChange("dateFrom", e.target.value)}
              />
            </div>
            <div className="filtres-item">
              <label>Date Range To:</label>
              <input
                type="date"
                onChange={(e) => handleDateRangeChange("dateTo", e.target.value)}
              />
            </div>
          </div>
          <div className="arrow-hide" onClick={toggleFilters}>
            <img className="arrow" src={arrowUpIcon} alt="Up Arrow" />
          </div>
          <div className="filtres-bar-bottom">
            <Link className="light-purple-button active-button" to="/">
              Offices
            </Link>
            <Link className="light-purple-button" to="/rooms">
              Rooms
            </Link>
            <Link className="light-purple-button" to="/desks">
              Desks
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default FiltresBar;
