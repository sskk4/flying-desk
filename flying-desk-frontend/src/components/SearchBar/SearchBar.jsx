import React, { useState } from "react";
import "./SearchBar.css";
import FiltresBarOffice from "../FiltresBar/FiltresBarOffice"; 
import FiltresBarDesks from "../FiltresBar/FiltresBarDesk"; 
import searchIcon from "../../assets/icons/search.svg";
import filterIcon from "../../assets/icons/filter.svg";

const SearchBar = ({ filterType, onSearchChange, onFilterChange, onSortChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const toggleFilters = () => {
    setIsFiltersOpen((prevState) => !prevState);
  };


  const handleSearch = () => {
    const trimmedValue = inputValue.trim(); 
    onSearchChange(trimmedValue); 
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); 
    }
  };


  const handleButtonClick = () => {
    handleSearch(); 
  };


  const renderFiltresBar = () => {
    switch (filterType) {
      case "office":
        return (
          <FiltresBarOffice
            isFiltersOpen={isFiltersOpen}
            toggleFilters={toggleFilters}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
          />
        );
      case "desk":
        return (
          <FiltresBarDesks
            isFiltersOpen={isFiltersOpen}
            toggleFilters={toggleFilters}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
          />
        );
      default:
        console.warn(`Unknown filter type: ${filterType}`);
        return null;
    }
  };

  return (
    <>
      {/* Główna belka wyszukiwania */}
      <div className="search-bar">
        <div className="search-bar-left"></div>
        <div className="search-bar-center">
          <input
            className="search-bar-text-input"
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={handleKeyDown} 
          />
          <img
            className="search-bar-button"
            src={searchIcon}
            alt="Search"
            onClick={handleButtonClick} 
          />
        </div>
        <div className="search-bar-right">
          <div
            className={`search-bar-filtres ${isFiltersOpen ? "active" : ""}`}
            onClick={toggleFilters}
          >
            <img className="search-bar-filtres-img" src={filterIcon} alt="Filter" />
            <span className="search-bar-filtres-text">Filters</span>
          </div>
        </div>
      </div>

      {/* Dynamicznie renderowany panel filtrów */}
      {renderFiltresBar()}
    </>
  );
};

export default SearchBar;
