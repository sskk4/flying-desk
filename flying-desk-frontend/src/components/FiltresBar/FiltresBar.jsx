import React, { useState, useEffect } from "react";
import './FiltresBar.css';
import { Link} from "react-router-dom";
import arrowDownIcon from '../../assets/icons/arrow-down.svg';
import arrowUpIcon from '../../assets/icons/arrow-up.svg';
import axios from "axios";

const FiltresBar = ({ isFiltersOpen, toggleFilters, onFilterChange, onSortChange }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Pobieranie krajów przy montowaniu komponentu
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/v1/country")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Pobieranie miast po wybraniu kraju
  useEffect(() => {
    if (selectedCountry) {
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
    onFilterChange("countryId", countryId);
  };

  // Obsługa zmiany miasta
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    onFilterChange("cityId", cityId);
  };

  // Obsługa zmiany sortowania
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  // Obsługa zmiany statusu
  const handleStatusChange = (e) => {
    onFilterChange("status", e.target.value);
  };

  // Obsługa zmiany zakresu dat
  const handleDateRangeChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="filtres-bar">
      {/* Sekcja filtres-bar-close, która jest widoczna początkowo */}
      {!isFiltersOpen && (
        <div className="filtres-bar-close">
          <div className="filtres-bar-left">
            <Link className="light-purple-button" to="/add/office"> <div>Offices</div> </Link>
            <div className="light-purple-button">Rooms</div>
            <div className="light-purple-button">Desks</div>
          </div>

          <div className="filtres-bar-right">
            <div className="filtres-bar-right-panel">

             <label>  Destination: </label>
              <select onChange={handleCityChange} value={selectedCity} disabled={!selectedCountry}>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.city}
              </option>
            ))}
          </select>
          
              {/* Przycisk strzałki, który otwiera filtry */}
              <div className="arrow-show" onClick={toggleFilters}>
                <img className="arrow" src={arrowDownIcon} alt="Down Arrow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sekcja filtres-bar-open, która jest widoczna po kliknięciu na strzałkę */}
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
          <label>  Destination: </label>
              <select onChange={handleCityChange} value={selectedCity} disabled={!selectedCountry}>
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

          <label>Date Range From:</label> <br></br>
          <input
            type="date"
            onChange={(e) => handleDateRangeChange("dateFrom", e.target.value)}
          />

          </div>
          <div className="filtres-item">

          <label>Date Range To:</label> <br></br>
          <input
            type="date"
            onChange={(e) => handleDateRangeChange("dateTo", e.target.value)}
          />

          </div>
          </div>

          {/* Przycisk strzałki w górę, który zamyka filtry */}
          <div className="arrow-hide" onClick={toggleFilters}>
            <img className="arrow" src={arrowUpIcon} alt="Up Arrow" />
          </div>

          <div className="filtres-bar-bottom">
          <Link className="light-purple-button" to="/add/office"><div >Offices</div></Link>
            <div className="light-purple-button">Rooms</div>
            <div className="light-purple-button">Desks</div>
          </div>
        </div>
      )}
         <label>Sort by:</label>
          <select onChange={handleSortChange}>
            <option value="asc">Alphabetically (A-Z)</option>
            <option value="desc">Alphabetically (Z-A)</option>
            <option value="creationDate">Creation Date</option>
          </select>
    </div>
  );
};

export default FiltresBar;
