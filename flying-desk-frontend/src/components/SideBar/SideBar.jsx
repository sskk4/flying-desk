import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom"; 
import "./SideBar.css"; 

const Sidebar = ({ header, headerPath, items }) => {
  return (
    <aside className="sidebar">
      <NavLink to={headerPath} className="sidebar-header-link">
        <h2>
          {header.split(" ").map((word, index) => (
            <React.Fragment key={index}>
              {word}
              {index < header.split(" ").length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </NavLink>
      <ul>
        {items.map((item, index) => (
          <li className="side-bar-li" key={index}>
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


Sidebar.propTypes = {
  header: PropTypes.string.isRequired,
  headerPath: PropTypes.string.isRequired, 
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;
