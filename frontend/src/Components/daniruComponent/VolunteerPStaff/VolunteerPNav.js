import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VolunteerPNav.css";

const Nav = ({ volunteerName }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
          <Link to="/vpsl/packinginstructions">Packing Instructions</Link>
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
          <button className="messages-icon" onClick={() => navigate('/vpsl/feedbackp')}>
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
