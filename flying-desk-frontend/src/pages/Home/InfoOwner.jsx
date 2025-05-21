import React from "react";
import "./Info.css";

import Owner1 from "../../assets/images/owner1.png";
import Owner2 from "../../assets/images/owner2.png";
import Owner3 from "../../assets/images/owner3.png";
import Owner4 from "../../assets/images/owner4.png";

const ownerSteps = [
  {
    image: Owner1,
    text: "If you have an office available for rent, you can start offering it on our platform.",
  },
  {
    image: Owner2,
    text: "Submit your application by filling out the dedicated office registration form.",
  },
  {
    image: Owner3,
    text: "Your submission will be reviewed by the administration team for approval.",
  },
  {
    image: Owner4,
    text: "Once approved, you will receive the 'Lessor' rank and gain access to desk and room listings.",
  },
];

const OwnerInfo = () => {
  return (
    <div className="info-wrapper">
      <div className="info-guide-container">
        <div className="guide-content">
          {ownerSteps.map((step, index) => (
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

export default OwnerInfo;
