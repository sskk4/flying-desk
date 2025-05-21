// src/pages/Customer/CustomerExperience.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Rent/Start.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

import customer1 from "../../assets/png/customer1.png";
import customer2 from "../../assets/png/customer2.png";
import customer3 from "../../assets/png/customer3.png";

const CustomerExperience = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.customer-row');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="customer-experience">
      <Header />
      <div className="experience-container">
        <h1 className="experience-title">
          <span className="fancy-text">Find Your Perfect Workspace</span>
        </h1>

        <div className="customer-sections">
          <div className="customer-row">
            <div className="customer-image">
              <img src={customer1} alt="Search workspace" className="animated-image" />
            </div>
            <div className="customer-content">
              <h2>01. Find</h2>
              <p>
                Discover the perfect workspace for your needs. Use our advanced filters 
                to locate the ideal desk or meeting room in your city. Filter by amenities, 
                location, and price to match your exact requirements.
              </p>
            </div>
          </div>

          <div className="customer-row">
            <div className="customer-content">
              <h2>02. Book</h2>
              <p>
                Book by the hour or day with our flexible reservation system. 
                No long-term commitments required. Confirm your booking in just 
                a few clicks and receive instant confirmation.
              </p>
            </div>
            <div className="customer-image">
              <img src={customer2} alt="Book workspace" className="animated-image" />
            </div>
          </div>

          <div className="customer-row">
            <div className="customer-image">
              <img src={customer3} alt="Work comfortably" className="animated-image" />
            </div>
            <div className="customer-content">
              <h2>03. Work</h2>
              <p>
                Arrive, show your booking code, and start working immediately. 
                Manage all your reservations and history through your personal 
                dashboard. Return whenever you need your next productive space.
              </p>
            </div>
          </div>
        </div>

        <div className="action-container">
          <Link to="/desks" className="book-button">
            Start Booking Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerExperience;