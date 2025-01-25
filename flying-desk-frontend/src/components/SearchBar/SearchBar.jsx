// src/components/SearchBar/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';
import FiltresBar from '../FiltresBar/FiltresBar';
import searchIcon from '../../assets/icons/search.svg';
import filterIcon from '../../assets/icons/filter.svg';

const SearchBar = ({ onSearchChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Funkcja do przełączania stanu
  const toggleFilters = () => {
    setIsFiltersOpen(prevState => !prevState);
  };

  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
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
                  onChange={handleInputChange}
                />
          <img className="search-bar-button" src={searchIcon} alt="Search" />
        </div>
        <div className="search-bar-right">
          <div className="search-bar-filtres" onClick={toggleFilters}>
            <img className="search-bar-filtres-img" src={filterIcon} alt="Filter" />
            <span className="search-bar-filtres-text">Filtres</span>
          </div>
        </div>
      </div>

      {/* Przekazywanie stanu i funkcji do FiltresBar */}
      <FiltresBar isFiltersOpen={isFiltersOpen} toggleFilters={toggleFilters}  />
    </>
  );
};

export default SearchBar;

