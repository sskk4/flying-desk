import React from 'react';
import './Footer.css';
import logo from "../../assets/images/flyingdesk.png";

const Footer = () => {
  return (
    
    <div className="footer">
      <div className="footer-section footer-logo">
      <img
            className="footer-logo-img"
            src={logo}
            alt="Flying Desk"
          />
      </div>
      <div className="footer-section footer-links">
        <div className="footer-column">
          <a href="#office-space">office space</a>
          <a href="#rooms">rooms</a>
          <a href="#desks">desks</a>
        </div>
        <div className="footer-column">
          <a href="#for-customers">for customers</a>
          <a href="#for-owners">for owners</a>
          <a href="#become-owner">become owner</a>
        </div>
        <div className="footer-column">
          <a href="#more-info">more info</a>
          <a href="#about-us">about us</a>
        </div>
        <div className="footer-column">
          <a href="#login">login</a>
          <a href="#register">register</a>
        </div>
      </div>
      
    </div>
  );
};

export default Footer;
