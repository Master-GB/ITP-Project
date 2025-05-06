import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VolunteerPNav.css";

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
                  <p className="donor-name">Daniru Dodangoda</p>
                  <p className="donor-email">daniru@gmail.com</p>
                </div>
              </div>

              <div className="separator"></div>

              <ul className="side-nav-links">
                <li>
                  <Link to="/profile">Profile</Link>
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
              <span className="top-text">HodaHitha.lk</span>
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/vpsl/volunteerpstaffdashboard">Dashboard</Link>
          <Link to="/vpsl/volunteerTask">My Tasks</Link>
          <Link to="/vpsl/packingInstructions">Packing Instructions</Link>
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
