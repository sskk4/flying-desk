import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom"; // Dodanie nawigacji
import "./SideBar.css"; // Plik CSS dla stylizacji

const Sidebar = ({ header, items }) => {
  return (
    <aside className="sidebar">
      <h2>
        {header.split(" ").map((word, index) => (
          <React.Fragment key={index}>
            {word}
            {index < header.split(" ").length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "sidebar-link active-link" : "sidebar-link")}
            >
              <span className="icon">{item.icon}</span> {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};


// PropTypes do walidacji
Sidebar.propTypes = {
  header: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;
