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
        <div className="side-nav">
          <button className="hamburger-menu" onClick={toggleSideNav}>
            ☰
          </button>
          {isSideNavOpen && (
            <div className="side-nav-content">
              <button className="close-icon" onClick={toggleSideNav}>
                <img
                  src="/Resources/gihanRes/donationRes/cancel.png"
                  alt="Close"
                />
              </button>

              <div className="profile-container">
                <div className="profile-photo-cover">
                  <img
                    src="/Resources/gihanRes/donationRes/dp.png"
                    alt="Profile"
                    className="profile-photo"
                  />
                </div>
                <div className="profile-info">
                  <p className="donor-name">Gihan</p>
                  <p className="donor-email">gihan@example.com</p>
                </div>
              </div>

              <div className="separator"></div>

              <ul className="side-nav-links">
                <li>
                  <Link to ="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/guidance">guidelines</Link>
                </li>
                <li>
                  <Link to="/support">Support</Link>
                </li>
                <li className="sign-out">
                  <Link to="/sign-out">Sign Out</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="logo-container">
          <Link to="/" className="logo-container">
            <img
              src="/Resources/gihanRes/donationRes/mainlogo.png"
              alt="Logo"
              className="logo-img"
            />
            <div className="logo-text">
              <span className="top-text">හොද</span>
              <span className="bottom-text">
                හිත<span className="lk-text">.lk</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/donate">Donate Now</Link>
          <Link to="/myDonate">My Donation</Link>
          <Link to="/monitor">Analytics</Link>
        </div>

        <div className="nav-search-container">
  <input 
    type="text" 
    placeholder="Search" 
    className="nav-search-input"
  />
  <button className="nav-search-button">
    <img
      src="/Resources/gihanRes/donationRes/search.png"
      alt="Search"
      className="nav-search-icon"
    />
  </button>
</div>

          
        <div className="ai-chatbot">
          <button className="chatbot-icon">
            <img
              src="/Resources/gihanRes/donationRes/AIBot.png"
              alt="Chatbot"
            />
          </button>
        </div>

        <div className="communicate">
          <button className="messages-icon">
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Messages"
            />
          </button>
        </div>
        
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
