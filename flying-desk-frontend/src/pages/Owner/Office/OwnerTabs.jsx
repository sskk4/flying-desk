// OwnerTabs.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/Owner/ManageAds.css";

const OwnerTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabMap = {
    "/owner/offices": "Offices",
    "/owner/rooms": "Rooms",
    "/owner/desks": "Desks",
  };

  const reverseTabMap = {
    "Offices": "/owner/offices",
    "Rooms": "/owner/rooms",
    "Desks": "/owner/desks",
  };

  const currentTab = tabMap[location.pathname] || "Offices";

  const handleTabChange = (tab) => {
    navigate(reverseTabMap[tab]);
  };

  return (
    <div className="manage-ads-tabs">
      {["Offices", "Rooms", "Desks"].map(tab => (
        <button
          key={tab}
          className={`tab-button ${currentTab === tab ? 'active' : ''}`}
          onClick={() => handleTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default OwnerTabs;
