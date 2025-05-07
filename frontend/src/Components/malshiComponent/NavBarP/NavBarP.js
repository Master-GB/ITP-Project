import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBarP.css";


function RequestNavBar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    // Add your sign out logic here (e.g., clear tokens)
    navigate("/home");
  };


  return (
    <div>
      <nav className="req-nav-navbar">
        <div className="req-nav-logo-container">
          <Link to="/" className="req-nav-logo-container">
            <img
              src="/Resources/gihanRes/donationRes/mainlogo.png"
              alt="Logo"
              className="req-nav-logo-img"
            />
            <div className="req-nav-logo-text">
              <span className="req-nav-top-text">හොද</span>
              <span className="req-nav-bottom-text">
                හිත<span className="req-nav-lk-text">.lk</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/rl/dashboard">Dashboard</Link>
          <Link to="/rl/add-requests">Add Request</Link>
          <Link to="/rl/display-requests">My Requests</Link>
          <Link to="/rl/funds">Funds</Link>
        </div>

        <div className="req-nav-nav-search-container">
          <input 
            type="text" 
            placeholder="Search" 
            className="req-nav-nav-search-input"
          />
          <button className="req-nav-nav-search-button">
            <img
              src="/Resources/gihanRes/donationRes/search.png"
              alt="Search"
              className="req-nav-nav-search-icon"
            />
          </button>
        </div>


        <div className="req-nav-notifications">
          <button className="req-nav-notification-icon" onClick={() => navigate('/rl/pfeedback')}>
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Notifications"
            />
          </button>
        </div>

        <div className="req-nav-notifications">
          <button className="req-nav-notification-icon">
            <img
              src="/Resources/gihanRes/donationRes/notification.png"
              alt="Notifications"
            />
          </button>
        </div>

        <div className="req-nav-signout">
          <button className="req-nav-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
}

export default RequestNavBar;