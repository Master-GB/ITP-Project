import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="check-icon">✓</div>
        <h1>Thank You!</h1>
        <p>Your donation has been successfully processed.</p>
        <p>Your support helps us reduce food waste and provide meals to those in need.</p>
        <p className="impact">Your contribution will help provide approximately 
          <span className="meals"> 5 meals</span> to people in need.</p>
        <div className="action-buttons">
          <Link to="/" className="home-button">Return Home</Link>
          <Link to="/fund" className="donate-again-button">Donate Again</Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;