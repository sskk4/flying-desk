import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const Header = ({ title, addButtonText, addPath }) => {
    const navigate = useNavigate();

    const handleAddClick = () => {
        if (addPath) {
            navigate(addPath);
        }
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