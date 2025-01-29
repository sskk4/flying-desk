import React, { useState } from "react";
import "./SearchBar.css";
import FiltresBarOffice from "../FiltresBar/FiltresBarOffice"; // Filtry dla Office
import FiltresBarDesks from "../FiltresBar/FiltresBarDesk"; // Filtry dla Desks
import searchIcon from "../../assets/icons/search.svg";
import filterIcon from "../../assets/icons/filter.svg";

const SearchBar = ({ filterType, onSearchChange, onFilterChange, onSortChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Stan lokalny dla wpisywanego tekstu

  // Obsługa przełączania widoczności filtrów
  const toggleFilters = () => {
    setIsFiltersOpen((prevState) => !prevState);
  };

  // Funkcja do wyszukiwania (bezpośrednie użycie inputValue)
  const handleSearch = () => {
    const trimmedValue = inputValue.trim(); // Usuń białe znaki
    onSearchChange(trimmedValue); // Wywołaj wyszukiwanie niezależnie od wartości (również dla pustego pola)
  };

  // Obsługa klawisza Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Wykonaj wyszukiwanie
    }
  };

  // Obsługa kliknięcia ikony wyszukiwania
  const handleButtonClick = () => {
    handleSearch(); // Wykonaj wyszukiwanie
  };

  // Wybór odpowiedniego komponentu filtrów
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
            onChange={(e) => setInputValue(e.target.value)} // Aktualizacja lokalnego stanu
            onKeyDown={handleKeyDown} // Obsługa wciśnięcia Enter
          />
          <img
            className="search-bar-button"
            src={searchIcon}
            alt="Search"
            onClick={handleButtonClick} // Obsługa kliknięcia w ikonę
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
