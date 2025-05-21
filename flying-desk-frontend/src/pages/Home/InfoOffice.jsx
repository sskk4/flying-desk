import React from "react";
import "./Info.css";

import Office1 from "../../assets/images/office1.png";
import Office2 from "../../assets/images/office2.png";
import Office3 from "../../assets/images/office3.png";
import Office4 from "../../assets/images/office4.png";

const officeSteps = [
  {
    image: Office1,
    text: "Use filters to search for offices in your area. If one catches your interest, click 'Check' to explore it further.",
  },
  {
    image: Office2,
    text: "On the office detail page, you'll find comprehensive information about the workspace.",
  },
  {
    image: Office3,
    text: "Below the main photo section, you’ll see desks that are available for rent within that office.",
  },
  {
    image: Office4,
    text: "Switching the view allows you to explore available rooms too — a building is only shown if it has at least one approved desk or room.",
  },
];

const OfficeInfo = () => {
  return (
    <div className="info-wrapper">
      <div className="info-guide-container">
        <div className="guide-content">
          {officeSteps.map((step, index) => (
            <div key={index} className="guide-step">
              <img src={step.image} alt={`Step ${index + 1}`} />
              <h2>{step.text}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficeInfo;
