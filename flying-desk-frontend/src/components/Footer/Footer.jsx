import React from 'react';
import './Footer.css';
import logo from "../../assets/images/flyingdesk.png";
import { Link } from 'react-router-dom';

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
          <Link to="/">office space</Link>
          <Link to="/rooms">rooms</Link>
          <Link to="/desks">desks</Link>
        </div>
        <div className="footer-column">
          <Link to="/start-rent">for customers</Link>
          <Link to="/owner">for owners</Link>
          <Link to="/become-owner">become owner</Link>
        </div>
        <div className="footer-column">
          <Link to="/info">more info</Link>
          <Link to="/contact">contact us</Link>
        </div>
        <div className="footer-column">
          <Link to="/login">login</Link>
          <Link to="/register">register</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
