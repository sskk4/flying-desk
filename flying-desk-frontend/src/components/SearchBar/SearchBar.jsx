import React, { useState } from 'react';
import './SearchBar.css';
import FiltresBar from '../FiltresBar/FiltresBar';
import searchIcon from '../../assets/icons/search.svg';
import filterIcon from '../../assets/icons/filter.svg';

const SearchBar = ({ onSearchChange, onFilterChange, onSortChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Funkcja do przełączania widoczności filtrów
  const toggleFilters = () => {
    console.log("Toggling filters visibility");
    setIsFiltersOpen((prevState) => !prevState);
  };

  // Obsługa zmiany tekstu w polu wyszukiwania
  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log("Search text changed: ", value); // Logowanie zmiany tekstu
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      <div className="search-bar">
        <div className="search-bar-left"></div>
        <div className="search-bar-center">
          <input
            className="search-bar-text-input"
            type="text"
            placeholder="Search..."
            onChange={handleInputChange} // Obsługa zmian tekstu
          />
          <img className="search-bar-button" src={searchIcon} alt="Search" />
        </div>
        <div className="search-bar-right">
          <div className="search-bar-filtres" onClick={toggleFilters}>
            <img className="search-bar-filtres-img" src={filterIcon} alt="Filter" />
            <span className="search-bar-filtres-text">Filters</span>
          </div>
        </div>
      </div>

      {/* Przekazanie stanu i funkcji do FiltresBar */}
      <FiltresBar
        isFiltersOpen={isFiltersOpen}
        toggleFilters={toggleFilters}
        onFilterChange={onFilterChange} // Przekazanie funkcji zmiany filtrów
        onSortChange={onSortChange} // Przekazanie funkcji zmiany sortowania
      />
    </>
  );
};

export default SearchBar;
