import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VolunteerNav.css";

const Nav = ({ volunteerName }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    document.body.classList.toggle("show-overlay", !isSideNavOpen);
  };

  useEffect(() => {
    // Fetch all notifications
    axios.get('http://localhost:8090/api/tasks/notifications')
      .then(res => setNotifications(res.data.notifications || []));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDropdown = () => {
    setShowDropdown((prev) => !prev);
    // Only mark as read when opening the dropdown
    if (!showDropdown) {
      axios.patch('http://localhost:8090/api/tasks/notifications/mark-read')
        .then(() => {
          // Update local state to set all as read
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
          );
        });
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/home');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div>
      {isSideNavOpen && <div className="overlay" onClick={toggleSideNav}></div>}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-popup">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="logout-confirm-buttons">
              <button onClick={confirmLogout} className="confirm-btn">Yes, Sign Out</button>
              <button onClick={cancelLogout} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="side-nav">
          <button className="hamburger-menu" onClick={toggleSideNav}>
            ☰
          </button>
          {isSideNavOpen && (
            <div className="daniru-side-nav-content">
              <button className="daniru-close-icon" onClick={toggleSideNav}>
                <img
                  src="/Resources/gihanRes/donationRes/cancel.png"
                  alt="Close"
                />
              </button>
              <div className="daniru-profile-container">
                <div className="daniru-profile-photo-cover">
                  <img
                    src="/Resources/gihanRes/donationRes/dp.png"
                    alt="Profile"
                    className="daniru-profile-photo"
                  />
                </div>
                <div className="daniru-profile-info">
                  <p className="daniru-donor-name">Daniru Dodangoda</p>
                  <p className="daniru-donor-email">mastergba2001@gmail.com</p>
                </div>
              </div>
              <div className="daniru-separator"></div>
              <ul className="daniru-side-nav-links">
                <li>
                  <Link to="/vdsl/volunteeraboutus">About Us</Link>
                </li>
                <li>
                  <Link to="/vdsl/volunteercontactus">Contact Us</Link>
                </li>
                <li className="daniru-sign-out">
                  <button onClick={handleLogout} className="sign-out-btn">Sign Out</button>
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
            <div className="donor-nav-logo-text">
              <span className="donor-nav-top-text">හොද</span>
              <span className="donor-nav-bottom-text">
                හිත<span className="donor-nav-lk-text">.lk</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/vdsl/volunteerdstaffdashboard">Dashboard</Link>
          <Link to="/vdsl/volunteerTask">My Tasks</Link>
          <Link to="/vdsl/route">Route</Link>
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

          

        <div className="communicate">
          <button className="messages-icon" onClick={() => navigate('/vdsl/feedback')}>
            <img
              src="/Resources/gihanRes/donationRes/message.png"
              alt="Messages"
            />
          </button>
        </div>
        
        <div className="notifications" style={{ position: "relative" }}>
          <button
            className="notification-icon"
            onClick={handleDropdown}
          >
            <img
              src="/Resources/gihanRes/donationRes/notification.png"
              alt="Notifications"
            />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          {showDropdown && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className={`notification-item${n.read ? '' : ' unread'}`}>
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
