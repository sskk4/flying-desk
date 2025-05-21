import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import arrowDownIcon from "../../assets/icons/arrow-down.svg";
import arrowUpIcon from "../../assets/icons/arrow-up.svg";
import { Calendar } from "react-feather";
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
  const [showAvailabilityFilters, setShowAvailabilityFilters] = useState(false);

  const [availabilityFilters, setAvailabilityFilters] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    onlyAvailable: false
  });

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
    const sortValue = e.target.value;
    onSortChange(sortValue);
  };

  const handlePriceChange = (field, value) => {
    onFilterChange(field, value);
  };

  const toggleAvailabilityFilters = () => {
    setShowAvailabilityFilters(!showAvailabilityFilters);
  };

  const handleAvailabilityChange = (field, value) => {
    const newAvailabilityFilters = {
      ...availabilityFilters,
      [field]: value
    };
    
    setAvailabilityFilters(newAvailabilityFilters);
    
    if (field === "date") {
      onFilterChange("availabilityDate", value);
    } else if (field === "startTime") {
      onFilterChange("availabilityStartTime", value);
    } else if (field === "endTime") {
      onFilterChange("availabilityEndTime", value);
    } else if (field === "onlyAvailable") {
      onFilterChange("onlyAvailable", value);
    }
  };

  const getCurrentDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
                <option value="room-asc">Name (A-Z)</option>
                <option value="room-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
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
              <label>City:</label>
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
              <label>Price From:</label>
              <input 
                type="number" 
                min="0"
                onChange={(e) => handlePriceChange("priceFrom", e.target.value)}
              />
            </div>
            <div className="filtres-item">
              <label>Price To:</label>
              <input 
                type="number" 
                min="0"
                onChange={(e) => handlePriceChange("priceTo", e.target.value)}
              />
            </div>
          </div>

          <div className="filtres-availability-toggle" onClick={toggleAvailabilityFilters}>
            <Calendar size={16} />
            <span>Availability Filters</span>
            <img className="arrow" src={showAvailabilityFilters ? arrowUpIcon : arrowDownIcon} alt="Arrow" />
          </div>

          {showAvailabilityFilters && (
            <div className="filtres-availability-section">
              <div className="filtres-availability-row">
                <div className="filtres-item">
                  <label>Date:</label>
                  <input 
                    type="date"
                    min={getCurrentDateString()}
                    onChange={(e) => handleAvailabilityChange("date", e.target.value)}
                    value={availabilityFilters.date}
                  />
                </div>
                <div className="filtres-item">
                  <label>Start Time:</label>
                  <input 
                    type="time"
                    onChange={(e) => handleAvailabilityChange("startTime", e.target.value)}
                    value={availabilityFilters.startTime}
                  />
                </div>
                <div className="filtres-item">
                  <label>End Time:</label>
                  <input 
                    type="time"
                    onChange={(e) => handleAvailabilityChange("endTime", e.target.value)}
                    value={availabilityFilters.endTime}
                  />
                </div>
                <div className="filtres-item checkbox-item">
                  <label>
                    <input 
                      type="checkbox"
                      onChange={(e) => handleAvailabilityChange("onlyAvailable", e.target.checked)}
                      checked={availabilityFilters.onlyAvailable}
                    />
                    Show only available rooms
                  </label>
                </div>
              </div>
            </div>
          )}

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