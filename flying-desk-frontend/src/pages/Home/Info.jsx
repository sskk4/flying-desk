// src/pages/MoreInfo/MoreInfo.jsx
import React, { useState } from "react";
import "./Info.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import InfoRegister from "./InfoRegister"; 
import InfoCustomer from "./InfoCustomer";
import InfoOwner from "./InfoOwner";
import InfoOffice from "./InfoOffice";
import InfoDesk from "./InfoDesk";

import FlyingDesk from "../../assets/images/logo.png";


const MoreInfo = () => {
  const [currentSection, setCurrentSection] = useState("create");

  const instructions = {
    create: {
      title: "Create account",
      content: <InfoRegister />,
    },
    customers: {
      title: "For customers",
      content: <InfoCustomer />,
    },
    owners: {
      title: "For owners",
      content: <InfoOwner />,
    },
    offices: {
      title: "Offices",
      content: <InfoOffice />,
    },
    rooms: {
      title: "Rooms and Desks",
      content: <InfoDesk />,
    },
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
            <nav className="info-menu">
              <h3>How to start with Flying Desk</h3>
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
            </nav>

            <section className="info-instructions">
              <h2 className="fancy-text">{instructions[currentSection].title}</h2>
              <hr></hr>
              {instructions[currentSection].content}
            </section>
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
