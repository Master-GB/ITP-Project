import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./nav.css";

const Nav = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    document.body.classList.toggle("show-overlay", !isSideNavOpen);
  };

  return (
    <div>
      {isSideNavOpen && <div className="overlay" onClick={toggleSideNav}></div>}

      <nav className="navbar">
        {/* Side Navigation (Hamburger Menu) */}
        <div className="side-nav">
          <button className="hamburger-menu" onClick={toggleSideNav}>
            ☰
          </button>
          {isSideNavOpen && (
            <div className="side-nav-content">
              {/* Cancel (Close) Icon */}
              <button className="close-icon" onClick={toggleSideNav}>
                <img
                  src="/Resources/gihanRes/donationRes/cancel.png"
                  alt="Close"
                />
              </button>

              <div className="profile-section">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Profile"
                  className="profile-photo"
                />
                <div className="profile-info">
                  <p className="donor-name">Gihan</p>
                  <p className="donor-email">gihan@example.com</p>
                </div>
              </div>
              <ul className="side-nav-links">
                <li>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/guidance">Guidance</Link>
                </li>
                <li>
                  <Link to="/support">Support</Link>
                </li>
                <li>
                  <Link to="/sign-out">Sign Out</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo-text">
            <span className="top-text">හොද</span>
            <span className="bottom-text">හිත</span>
          </div>
          <img src="/icons/logo.png" alt="Logo" className="logo-img" />
        </div>

        {/* Main Navigation Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Donate Now</Link>
          <Link to="/features">My Donation</Link>
          <Link to="/about"></Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="search-icon">
            <img
              src="/Resources/gihanRes/donationRes/search.png"
              alt="Search"
            />
          </button>
        </div>

        {/* AI Chatbot */}
        <div className="ai-chatbot">
          <button className="chatbot-icon">
            <img
              src="/Resources/gihanRes/donationRes/AIBot.png"
              alt="Chatbot"
            />
          </button>
        </div>

        {/* Communicate with Recipients */}
        <div className="communicate">
          <button className="messages-icon">
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Messages"
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="notifications">
          <button className="notification-icon">
            <img
              src="/Resources/gihanRes/donationRes/notification.png"
              alt="Notifications"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
