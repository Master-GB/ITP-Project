import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBarP.css";

function RequestNavBar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    document.body.classList.toggle("req-nav-show-overlay", !isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
    document.body.classList.remove("req-nav-show-overlay");
  };

  return (
    <div>
      <div className={`req-nav-overlay ${isSideNavOpen ? 'req-nav-show' : ''}`} onClick={closeSideNav}></div>

      <nav className="req-nav-navbar">
        <div className="req-nav-side-nav">
          <button className="req-nav-hamburger-menu" onClick={toggleSideNav}>
            ☰
          </button>
          <div className={`req-nav-side-nav-content ${isSideNavOpen ? 'req-nav-open' : ''}`}>
              <button className="req-nav-close-icon" onClick={closeSideNav}>
                <img
                  src="/Resources/gihanRes/donationRes/cancel.png"
                  alt="Close"
                />
              </button>

              <div className="req-nav-profile-container">
                <div className="req-nav-profile-photo-cover">
                  <img
                    src="/Resources/gihanRes/requestRes/dp.png"
                    alt="Profile"
                    className="req-nav-profile-photo"
                  />
                </div>
                <div className="req-nav-profile-info">
                  <p className="req-nav-request-name">Malshi</p>
                  <p className="req-nav-request-email">malshi@example.com</p>
                </div>
              </div>

              <div className="req-nav-separator"></div>

              <ul className="req-nav-side-nav-links">
                <li onClick={closeSideNav}>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li onClick={closeSideNav}>
                  <Link to="/profile">Profile</Link>
                </li>
                <li onClick={closeSideNav}>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li onClick={closeSideNav}>
                  <Link to="/guidance">Guidelines</Link>
                </li>
                <li onClick={closeSideNav}>
                  <Link to="/support">Support</Link>
                </li>
                <li className="req-nav-sign-out" onClick={closeSideNav}>
                  <Link to="/sign-out">Sign Out</Link>
                </li>
              </ul>
            </div>
        </div>
        
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

        <div className="req-nav-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-requests">Add Request</Link>
          <Link to="/display-requests">My Requests</Link>
          <Link to="/funds">Funds</Link>
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
          
        <div className="req-nav-ai-chatbot">
          <button className="req-nav-chatbot-icon">
            <img
              src="/Resources/gihanRs/donationRes/AIBot.png"
              alt="Feedback"
            />
          </button>
        </div>

        <div className="req-nav-ai-chatbot">
          <button className="req-nav-chatbot-icon">
            <img
              src="/Resources/gihanRes/donationRes/AIBot.png"
              alt="Chatbot"
            />
          </button>
        </div>

        <div className="req-nav-communicate">
          <button className="req-nav-messages-icon">
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Messages"
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
        
      </nav>
    </div>
  );
}

export default RequestNavBar;