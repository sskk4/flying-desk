import React from "react";
import { Link } from "react-router-dom";

import "../../../styles/Owner/Terms.css";
import Footer from "../../../components/Footer/Footer"
import Header from '../../../components/Header/Header';

const TermsContainer = () => {
  return (
    
    <div> 
        <Header />

        <div class="terms-container">
        <h1 className="owner-title">If You Want To Be an Owner</h1>
        <p class="subtitle">Terms for Registering Your Office Space on Our Platform</p>
        <p class="description">
            To ensure a seamless experience for both space owners and renters, we require all registered office spaces to meet the following criteria:
        </p>

        <h2>1. Ownership and Authorization</h2>
        <ul>
            <li>You must be the legal owner of the space or have written authorization from the owner to list the property for rent.</li>
            <li>Proof of ownership or authorization may be requested during the verification process.</li>
        </ul>

        <h2>2. Space Requirements</h2>
        <ul>
            <li>The space should be fully equipped for professional use, including basic facilities like electricity, lighting, and internet connectivity.</li>
            <li>Ensure the space is clean, safe, and well-maintained before listing it.</li>
        </ul>

        <h2>3. Listing Information</h2>
        <ul>
            <li>Provide accurate and detailed information about the space, including:
                <ul>
                    <li>Full address and location.</li>
                    <li>Type of space (e.g., open space, private office, meeting room).</li>
                    <li>Capacity (e.g., number of desks or people it can accommodate).</li>
                    <li>Available amenities (e.g., Wi-Fi, kitchen, parking).</li>
                    <li>Upload high-quality photos or videos showcasing the space.</li>
                </ul>
            </li>
        </ul>

        <h2>4. Pricing and Availability</h2>
        <ul>
            <li>Set transparent pricing for hourly, daily, or monthly rentals.</li>
            <li>Use the availability calendar to block dates when the space is not available.</li>
        </ul>

        <h2>5. Policies and Terms</h2>
        <ul>
            <li>Clearly define cancellation policies and any additional fees (e.g., cleaning, equipment rental).</li>
            <li>Agree to respond to booking requests or inquiries in a timely manner.</li>
        </ul>

        <h2>6. Compliance with Local Regulations</h2>
        <ul>
            <li>Ensure your space complies with local zoning laws and safety regulations.</li>
            <li>Any additional licenses or permits required for coworking activities must be obtained by the owner.</li>
        </ul>

        <h2>7. Professional Conduct</h2>
        <ul>
            <li>Maintain professional communication with renters.</li>
            <li>Address complaints or issues promptly to uphold a positive experience.</li>
        </ul>

        <p>
            By registering your space, you agree to adhere to these terms and contribute to a community of high-quality coworking spaces.
        </p>

        <div class="buttons">
          <Link to="/become-owner/add/submission">
            <button className="create-button">Accept</button>
            </Link>
            <Link to="/">
            <button className="create-button">Cancel</button>
            </Link>
        </div>
    </div>

    <Footer />
    </div>

  );
};

export default TermsContainer;