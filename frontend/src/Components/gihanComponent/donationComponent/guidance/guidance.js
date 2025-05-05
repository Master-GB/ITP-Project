import React from "react";
import "./guidance.css";

const Guidance = () => {
  return (
    <div className="guidance-background">
      <div className="guidance-container">
        <div className="guidance-header">
          <h1>Donor Guidance: How to Donate Surplus Food</h1>
          <p className="guidance-intro">
            Thank you for your interest in donating surplus food! Whether you are a restaurant, hotel, or any other food business, your contribution can make a big difference in the community.
          </p>
        </div>
        <div className="guidance-steps">
          <h2>How to Donate</h2>
          <ol>
            <li>
              <strong>Register / Log In:</strong> Create an account or log in to your donor dashboard.
            </li>
            <li>
              <strong>Prepare Your Surplus Food:</strong> Ensure food is safe, properly packaged, and labeled with contents and date.
            </li>
            <li>
              <strong>Submit a Donation:</strong> Fill out the donation form with details about the food, quantity, and preferred collection time.
            </li>
            <li>
              <strong>Coordinate Collection:</strong> Our team or volunteers will contact you to arrange a convenient pickup.
            </li>
            <li>
              <strong>Track Your Impact:</strong> See how your donations help reduce waste and support those in need!
            </li>
          </ol>
        </div>
        <div className="guidance-best-practices">
          <h2>Best Practices for Food Donation</h2>
          <ul>
            <li>Only donate food that is safe for consumption (not spoiled or expired).</li>
            <li>Use clean, sealed packaging to maintain freshness and hygiene.</li>
            <li>Label all items with contents and preparation/expiry dates.</li>
            <li>Refrigerate or freeze perishable items until collection.</li>
            <li>Contact us if you have questions about what can be donated.</li>
          </ul>
        </div>
        <div className="guidance-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="guidance-faq-list">
            <div className="guidance-faq-item">
              <strong>What types of food can I donate?</strong>
              <p>Fresh, surplus, or packaged food that meets safety standards. Please avoid donating opened or expired items.</p>
            </div>
            <div className="guidance-faq-item">
              <strong>Is there a minimum quantity for donations?</strong>
              <p>No minimum—every contribution helps!</p>
            </div>
            <div className="guidance-faq-item">
              <strong>Who collects the food?</strong>
              <p>Our volunteers or partner organizations will coordinate collection based on your availability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidance;
