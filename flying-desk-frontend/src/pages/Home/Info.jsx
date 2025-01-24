import React, { useState } from "react";
import "./Info.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FlyingDesk from "../../assets/images/logo.png";
import PhoneIcon from "../../assets/png/phone2.png";

const MoreInfo = () => {
  const [currentSection, setCurrentSection] = useState("create");

  const instructions = {
    create: { title: "Create account", content: "1. To create an account, click on 'Sign up' and follow the steps." },
    login: { title: "Login", content: "2. Enter your credentials to log in to your account." },
    customers: { title: "For customers", content: "3. Customers can explore the available offices and desks." },
    owners: { title: "For owners", content: "4. Owners can manage their properties and bookings here." },
    offices: { title: "Offices", content: "5. View and book available office spaces." },
    rooms: { title: "Rooms", content: "6. Find shared or private rooms for your team." },
    desks: { title: "Desks", content: "7. Browse individual desks tailored for co-working." },
  };

  return (
    <div>
      <Header />
      <div className="info-container">
        <div className="image-container">
          <img src={FlyingDesk} alt="Flying desk" className="flying-image" />
        </div>

        <div className="info-content-container">
          <div className="header">
            <h1>
              Start with <strong>flying desk</strong>
            </h1>
          </div>
          <div className="main">
            <div className="info-menu">
              <h3>How to start with flying desk</h3>
              <ul>
                {Object.keys(instructions).map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => setCurrentSection(key)}
                      className={`info-menu-button ${
                        currentSection === key ? "active" : ""
                      }`}
                    >
                      {instructions[key].title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="info-instructions">
              <h2>{instructions[currentSection].title}</h2>
              <p>{instructions[currentSection].content}</p>
            </div>
          </div>
          <div className="contact-button-container">
            <a href="/contact" className="contact-button">
                <span>Contact us</span>
            </a>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoreInfo;
