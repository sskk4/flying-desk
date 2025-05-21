import React from "react";
import "./Info.css";

import Customer1 from "../../assets/images/customer1.png";
import Customer2 from "../../assets/images/customer2.png";
import Customer3 from "../../assets/images/customer3.png";
import Customer4 from "../../assets/images/customer4.png";
import Customer5 from "../../assets/images/customer5.png";

const customerSteps = [
  {
    image: Customer1,
    text: "Once your account is registered and activated, you can begin renting desks right away.",
  },
  {
    image: Customer2,
    text: "Check the schedule to see which days the office is open for bookings.",
  },
  {
    image: Customer3,
    text: "Verify the desk availability for your preferred date — you can also use filters on the homepage.",
  },
  {
    image: Customer4,
    text: "In your profile, you'll find a new rental request which you can either accept or cancel.",
  },
  {
    image: Customer5,
    text: "After accepting, you will receive a reservation code to confirm your booking.",
  },
];

const CustomerInfo = () => {
  return (
    <div className="info-wrapper">
      <div className="info-guide-container">
        <div className="guide-content">
          {customerSteps.map((step, index) => (
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

export default CustomerInfo;
