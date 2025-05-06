import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";
import SignOutDialog from "../signOut/signOut"; // Import the dialog component


const Nav = () => {

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const navigate = useNavigate();

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    document.body.classList.toggle("donor-nav-show-overlay", !isSideNavOpen);
  };

  return (
    <div>
      {isSideNavOpen && <div className="donor-nav-overlay" onClick={toggleSideNav}></div>}

      <nav className="donor-nav-navbar">
        <div className="donor-nav-side-nav">
          <button className="donor-nav-hamburger-menu" onClick={toggleSideNav}>
            ☰
          </button>
          {isSideNavOpen && (
            <div className="donor-nav-side-nav-content">
              <button className="donor-nav-close-icon" onClick={toggleSideNav}>
                <img
                  src="/Resources/gihanRes/donationRes/cancel.png"
                  alt="Close"
                />
              </button>

              <div className="donor-nav-profile-container">
                <div className="donor-nav-profile-photo-cover">
                  <img
                    src="/Resources/gihanRes/donationRes/dp.png"
                    alt="Profile"
                    className="donor-nav-profile-photo"
                  />
                </div>
                <div className="donor-nav-profile-info">
                  <p className="donor-nav-donor-name">Gihan</p>
                  <p className="donor-nav-donor-email">gihan@example.com</p>
                </div>
              </div>

              <div className="donor-nav-separator"></div>

              <ul className="donor-nav-side-nav-links">
                <li>
                  <Link to ="/dl/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/dl/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/dl/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/dl/guidance">guidelines</Link>
                </li>
                <li>
                  <Link to="/dl/support">Support</Link>
                </li>
                <li className="donor-nav-sign-out">
                  <button className="donor-nav-sign-out-btn" onClick={() => setShowSignOutDialog(true)}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="donor-nav-logo-container">
          <Link to="/dl/dashboard" className="donor-nav-logo-container">
            <img
              src="/Resources/gihanRes/donationRes/mainlogo.png"
              alt="Logo"
              className="donor-nav-logo-img"
            />
            <div className="donor-nav-logo-text">
              <span className="donor-nav-top-text">හොද</span>
              <span className="donor-nav-bottom-text">
                හිත<span className="donor-nav-lk-text">.lk</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="donor-nav-nav-links">
          <Link to="/dl/dashboard">Dashboard</Link>
          <Link to="/dl/donate">Donate Now</Link>
          <Link to="/dl/myDonate">My Donation</Link>
          <Link to="/dl/monitor">Analytics</Link>
        </div>

        <div className="donor-nav-nav-search-container">
          <input 
            type="text" 
            placeholder="Search" 
            className="donor-nav-nav-search-input"
          />
          <button className="donor-nav-nav-search-button">
            <img
              src="/Resources/gihanRes/donationRes/search.png"
              alt="Search"
              className="donor-nav-nav-search-icon"
            />
          </button>
        </div>

        <div className="donor-nav-ai-chatbot">
          <button className="donor-nav-chatbot-icon" onClick={() => navigate('/dll/chatbot')}>
            <img
              src="/Resources/gihanRes/donationRes/AIBot.png"
              alt="Chatbot"
            />
          </button>
        </div>

        <div className="donor-nav-communicate">
          <button className="donor-nav-messages-icon" onClick={() => navigate('/dl/chat')}>
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Messages"
            />
          </button>
        </div>
        
        <div className="donor-nav-notifications">
          <button className="donor-nav-notification-icon">
            <img
              src="/Resources/gihanRes/donationRes/notification.png"
              alt="Notifications"
            />
          </button>
        </div>
      </nav>
      {/* Sign Out Dialog Modal */}
      <SignOutDialog
        open={showSignOutDialog}
        onConfirm={() => {
          setShowSignOutDialog(false);
          // TODO: Perform sign out logic here (e.g., clear auth tokens)
          navigate("/Home"); // Redirect to login page after sign out
        }}
        onCancel={() => setShowSignOutDialog(false)}
      />
    </div>
  );
};

export default Nav;