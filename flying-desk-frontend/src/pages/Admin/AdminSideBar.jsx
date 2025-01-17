import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminPanel.css';
import logo from '../../assets/images/flyingdesk.png';

const Sidebar = () => {
    return (
        <div className="ap-sidebar">
            
             <NavLink
                            to="/">
            <img
                className="top-bar-logo-img ap-logo"
                src={logo}
                alt="Flying Desk"
            />
            </NavLink>
            <div className="ap-menu-section">
                <h3 className="ap-menu-title">Owners</h3>
                <ul>
                    <li>
                        <NavLink
                            to="/admin-fd/submissions"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Submissions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin-fd/buildings"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Buildings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin-fd/rooms"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Rooms
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin-fd/desks"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Desks
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="ap-menu-section">
                <h3 className="ap-menu-title">Rents</h3>
                <ul>
                    <li>
                        <NavLink
                            to="/admin-fd/rents"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Rents
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin-fd/payments"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            Payments
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="ap-menu-section">
                <h3 className="ap-menu-title">Users</h3>
                <ul>
                    <li>
                        <NavLink
                            to="/admin-fd/users"
                            className={({ isActive }) => `ap-menu-link ${isActive ? 'active' : ''}`}
                        >
                            List
                        </NavLink>
                    </li>
                </ul>
            </div>
            <button className="create-button ap-logout">Logout</button>
        </div>
    );
};

export default Sidebar;
