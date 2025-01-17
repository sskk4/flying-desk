import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider"; // Import kontekstu autoryzacji
import "./Header.css";
import logo from "../../assets/images/flyingdesk.png";
import menuIcon from "../../assets/icons/menu.svg";
import userIcon from "../../assets/icons/user.svg";
import forCustomerIcon from "../../assets/icons/forcustomer.svg";
import forOwnerIcon from "../../assets/icons/forowner.svg";
import officesIcon from "../../assets/icons/offices.svg";
import infoIcon from "../../assets/icons/info.svg";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Pobranie statusu logowania i funkcji wylogowania
  const navigate = useNavigate();

  // Funkcja do przełączania widoczności menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Funkcja wylogowania
  const handleLogout = async () => {
    try {
      await logout(); // Wywołanie funkcji wylogowania
      navigate("/login"); // Przekierowanie na stronę logowania
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <Link className="menu-bar-button slide-in-out" to="/">
            office spaces
          </Link>
          <Link className="menu-bar-button slide-in-out" to="/start-rent">
            for customers
          </Link>
          <Link className="menu-bar-button slide-in-out" to="/become-owner">
            for owners
          </Link>
          <Link className="menu-bar-button slide-in-out" to="/info">
            more info
          </Link>
        </div>

        <div className="top-bar-logo">
          <img
            className="top-bar-logo-img"
            src={logo}
            alt="Flying Desk"
            onClick={() => navigate("/")}
          />
        </div>

        <div
          className={`top-bar-right-panel ${isDropdownOpen ? "top-bar-right-panel-open" : ""}`}
          onClick={toggleDropdown}
        >
          <img className="top-bar-right-panel-menu-img" src={menuIcon} alt="Menu" />
          <img className="top-bar-right-panel-menu-img" src={userIcon} alt="User" />
        </div>

        {/* Wyświetlanie menu w zależności od stanu */}
        {isDropdownOpen && (
          <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Settings
                </Link>
                <Link to="/help" className="dropdown-item">
                  Help
                </Link>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item">
                  Login
                </Link>
                <Link to="/register" className="dropdown-item">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <Link to="/customers">
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={forCustomerIcon}
            alt="For Customers"
          />
        </Link>
        <Link to="/become-owner">
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={forOwnerIcon}
            alt="For Owners"
          />
        </Link>
        <Link to="/">
          <img
            className="nav-bar-menu-img nav-bar-bigger"
            src={officesIcon}
            alt="Offices"
          />
        </Link>
        <Link to="/info">
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={infoIcon}
            alt="Info"
          />
        </Link>
        {isAuthenticated && (
          <Link to="/profile">
            <img
              className="nav-bar-menu-img nav-bar-bigger"
              src={userIcon}
              alt="User"
            />
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
