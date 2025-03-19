import React from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import "./AdminPanel.css";

const Header = ({ title, addButtonText, addPath }) => {
  const navigate = useNavigate();
  const params = useParams(); 

  const handleAddClick = () => {
    if (!addPath) {
      console.error("addPath is not provided");
      return;
    }

  
    const resolvedPath = addPath.replace(/:([a-zA-Z]+)/g, (_, key) => {
      if (!params[key]) {
        console.error(`Parameter ${key} not found in the current URL.`);
        return `:${key}`; 
      }
      return params[key];
    });

    if (resolvedPath.includes(":")) {
      console.error("Invalid addPath: unresolved parameters remain in the URL");
      return;
    }

    navigate(resolvedPath);
  };

  return (
    <div className="ap-header">
      <div className="ap-bars">
        <div className="ap-bar ap-header-1"></div>
        <div className="ap-bar ap-header-2"></div>
        <div className="ap-bar ap-header-3"></div>
      </div>
      <div className="ap-header-section">
        <div className="ap-title-section">
          <h2 className="header-title">{title}</h2>
        </div>
        <div className="ap-button-section">
          <button className="create-button ap-add" onClick={handleAddClick}>
            {addButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
