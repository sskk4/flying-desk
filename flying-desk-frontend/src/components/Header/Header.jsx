import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider";
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
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Uzyskaj aktualny URL

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  const isActiveLink = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some((path) => location.pathname === path);
    }
    return location.pathname === paths;
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
                  <Link
            className={`menu-bar-button slide-in-out ${
              isActiveLink("/") ? "active" : ""
            }`}
            to="/"
          >
            office spaces
          </Link>
          <Link
            className={`menu-bar-button slide-in-out ${
              isActiveLink("/start-rent") ? "active" : ""
            }`}
            to="/start-rent"
          >
            for customers
          </Link>
          <Link
          className={`menu-bar-button slide-in-out ${
            isActiveLink(["/become-owner", "/owner"]) ? "active" : ""
          }`}
          to="/become-owner"
        >
          for owners
        </Link>
          <Link
            className={`menu-bar-button slide-in-out ${
              isActiveLink("/info") ? "active" : ""
            }`}
            to="/info"
          >
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
      className={`top-bar-right-panel ${
        isDropdownOpen ? "top-bar-right-panel-open" : ""
      } ${location.pathname === "/profile" ? "highlighted" : ""}`}
      onClick={toggleDropdown}
    >
          <img className="top-bar-right-panel-menu-img" src={menuIcon} alt="Menu" />
          <img className="top-bar-right-panel-menu-img" src={userIcon} alt="User" />
        </div>

        {isDropdownOpen && (
          <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/profile/personal-info" className="dropdown-item">
                  Settings
                </Link>
                <Link to="/info" className="dropdown-item">
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
        <Link
          to="/start-rent"
          className={isActiveLink("/start-rent") ? "active" : ""}
        >
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={forCustomerIcon}
            alt="For Customers"
          />
        </Link>
        <Link
          to="/become-owner"
          className={isActiveLink("/become-owner") ? "active" : ""}
        >
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={forOwnerIcon}
            alt="For Owners"
          />
        </Link>
        <Link to="/" className={isActiveLink("/") ? "active" : ""}>
          <img
            className="nav-bar-menu-img nav-bar-bigger"
            src={officesIcon}
            alt="Offices"
          />
        </Link>
        <Link to="/info" className={isActiveLink("/info") ? "active" : ""}>
          <img
            className="nav-bar-menu-img nav-bar-smaller"
            src={infoIcon}
            alt="Info"
          />
        </Link>
        {isAuthenticated && (
          <Link to="/profile" className={isActiveLink("/profile") ? "active" : ""}>
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
