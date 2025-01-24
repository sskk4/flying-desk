import React from "react";
import "./Contact.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import ContactImage from "../../assets/png/contact-image.png"; // Ścieżka do obrazu

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="contact-container">
        <div className="contact-content">
          <h1 className="owner-title contact-title">Get in touch</h1>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" name="firstName" placeholder="Your first name" />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" name="lastName" placeholder="Your last name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="Your phone number" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Type your message here"></textarea>
            </div>
            <button type="submit" className="login-button wide contact-submit">Submit</button>
          </form>
        </div>
        <div className="contact-image">
          <img src={ContactImage} alt="Contact" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
