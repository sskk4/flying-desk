import React, { useState } from "react";
import "./Info.css";

import New1 from "../../assets/images/new1.png";
import New2 from "../../assets/images/new2.png";
import New3 from "../../assets/images/new3.png";
import New4 from "../../assets/images/new4.png";
import New5 from "../../assets/images/new5.png";
import New6 from "../../assets/images/new6.png";
import New7 from "../../assets/images/new7.png";
import New8 from "../../assets/images/new8.png";

const steps = [
  {
    image: New1,
    text: "Step 1: Click on 'Login' to access the login page. Enter your registered email and password to proceed.",
  },
  {
    image: New2,
    text: "Step 2: On the registration page, start by entering your email address.",
  },
  {
    image: New3,
    text: "Step 3: Enter your full name as the next step in the registration.",
  },
  {
    image: New4,
    text: "Step 4: Choose a secure password and confirm it by entering it again.",
  },
  {
    image: New5,
    text: "Step 5: A verification email has been sent to your inbox.",
  },
  {
    image: New6,
    text: "Step 6: Open the email and click on the activation link to continue.",
  },
  {
    image: New7,
    text: "Step 7: After activation, you'll see the confirmation screen and can log in.",
  },
  {
    image: New8,
    text: "Step 8: Once logged in, you can access the dashboard and start using the application.",
  },
];

const InfoGuide = () => {
  return (
    <div className="info-wrapper">
      <div className="info-guide-container">

        <div className="guide-content">
          {steps.map((step, index) => (
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

export default InfoGuide;
