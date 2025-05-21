import React from "react";
import "./Info.css";

import Desks1 from "../../assets/images/desks1.png";
import Desks2 from "../../assets/images/desks2.png";

const deskSteps = [
  {
    image: Desks1,
    text: "Simply try finding a room or desk and rent it directly through the platform.",
  },
  {
    image: Desks2,
    text: "Remember, you can always use filters to narrow results by price, location, and availability on a specific day.",
  },
];

const DeskInfo = () => {
  return (
    <div className="info-wrapper">
      <div className="info-guide-container">
        <div className="guide-content">
          {deskSteps.map((step, index) => (
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

export default DeskInfo;
