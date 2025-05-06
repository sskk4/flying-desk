// src/components/FiltresBar/FiltresBarRooms.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import arrowDownIcon from "../../assets/icons/arrow-down.svg";
import arrowUpIcon from "../../assets/icons/arrow-up.svg";
import "./FiltresBar.css";

const FiltresBarRooms = ({
  isFiltersOpen,
  toggleFilters,
  onFilterChange = () => {},
  onSortChange = () => {},
}) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/v1/country")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

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

  const handleCountryChange = (e) => {
    const countryName = e.target.selectedOptions[0]?.text;
    setSelectedCountry(e.target.value);
    onFilterChange("countryId", countryName);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.selectedOptions[0]?.text;
    setSelectedCity(e.target.value);
    onFilterChange("cityId", cityName);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const handleStatusChange = (e) => {
    onFilterChange("status", e.target.value);
  };

  const handleDateRangeChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="filtres-bar">
      {!isFiltersOpen && (
        <div className="filtres-bar-close">
          <div className="filtres-bar-left">
            <Link className="light-purple-button" to="/">
              Offices
            </Link>
            <Link className="light-purple-button active-button" to="/rooms">
              Rooms
            </Link>
            <Link className="light-purple-button" to="/desks">
              Desks
            </Link>
          </div>
          <div className="filtres-bar-right">
            <div className="filtres-bar-right-panel">
              <select onChange={handleSortChange}>
                <option className="first-option" value="">Sort by</option>
                <option value="room-desc">Name (A-Z)</option>
                <option value="room-asc">Name (Z-A)</option>
                <option value="creationDate-desc">Creation Date (Oldest)</option>
                <option value="creationDate-asc">Creation Date (Newest)</option>
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
                <option value=""></option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="filtres-item">
              <label>Destination:</label>
              <select onChange={handleCityChange} value={selectedCity} disabled={!selectedCountry}>
                <option value=""></option>
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
                <option value=""></option>
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
            <Link className="light-purple-button" to="/">
              Offices
            </Link>
            <Link className="light-purple-button active-button" to="/rooms">
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

export default FiltresBarRooms;