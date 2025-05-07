import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./nav.css";
import SignOutDialog from "../signOut/signOut"; // Import the dialog component


const Nav = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [notifications, setNotifications] = useState([]); // { id, message, time, read }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  // Fetch notifications from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/notifications')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch notifications: ' + res.status + ' ' + res.statusText);
        }
        return res.json();
      })
      .then(data => {
        setNotifications(data.map(n => ({
          id: n._id,
          message: n.message,
          time: new Date(n.time).toLocaleString(),
          read: !!n.read // robust: treat any truthy as read
        })));
      })
      .catch(err => {
        setNotifications([]);
        window.notificationFetchError = err.message;
        console.error('Notification fetch error:', err);
      });
  }, []);

  // Mark all as read when dropdown is opened
  useEffect(() => {
    if (dropdownOpen && notifications.some(n => !n.read)) {
      fetch('http://localhost:5000/api/notifications/markAllRead', { method: 'PATCH' })
        .then(res => {
          if (!res.ok) {
            console.error('Failed to PATCH notifications as read:', res.status, res.statusText);
            return;
          }
          // After backend update, fetch notifications again to get correct read status
          fetch('http://localhost:5000/api/notifications')
            .then(res => res.json())
            .then(data => {
              setNotifications(data.map(n => ({
                id: n._id,
                message: n.message,
                time: new Date(n.time).toLocaleString(),
                read: !!n.read // robust: treat any truthy as read
              })));
            });
        })
        .catch(err => console.error('Error PATCHing notifications as read:', err));
    }
  }, [dropdownOpen]);

  // Add notification from outside (e.g., on donation status change)
  useEffect(() => {
    async function handlePushNotification(e) {
      if (e.detail && e.detail.message) {
        // Save to backend
        const res = await fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: e.detail.message })
        });
        if (res.ok) {
          const notif = await res.json();
          setNotifications(prev => [{
            id: notif._id,
            message: notif.message,
            time: new Date(notif.time).toLocaleString(),
            read: false // Always unread when new notification comes
          }, ...prev]);
        }
      }
    }
    window.addEventListener('push-notification', handlePushNotification);
    return () => window.removeEventListener('push-notification', handlePushNotification);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Show badge if there are unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClearAll = async () => {
    await fetch('http://localhost:5000/api/notifications', { method: 'DELETE' });
    setNotifications([]);
  }

  const handleNotificationIconClick = () => setDropdownOpen(v => !v);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    document.body.classList.toggle("donor-nav-show-overlay", !isSideNavOpen);
  };

  const USER_API_URL = "http://localhost:8090/users";

    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get(USER_API_URL)
        .then(res => {
          const users = res.data.users || [];
          const donorUsers = users.filter(user => user.role === "Donor");
          setDonors(donorUsers);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to fetch donor data");
          setLoading(false);
        });
    }, []);
  
    if (loading) return <div className="donor-profile-loading">Loading donor profiles...</div>;
    if (error) return <div className="donor-profile-error">{error}</div>;
    if (donors.length === 0) return <div className="donor-profile-empty">No donor profiles found.</div>;

    const donor = donors[0];

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
              <Link to="/dl/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="donor-nav-profile-photo-cover">
                  <img
                    src="/Resources/gihanRes/donationRes/dp.png"
                    alt="Profile"
                    className="donor-nav-profile-photo"
                  />
                </div>
                <div className="donor-nav-profile-info">
                  <p className="donor-nav-donor-name">{donor.name}</p>
                  <p className="donor-nav-donor-email">{donor.email}</p>
                </div>
                </Link>
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
          <button className="donor-nav-chatbot-icon" onClick={() => navigate('/dl/feedbackForm')}>
            <img
              src="/Resources/gihanRes/donationRes/rating_feedback.webp"
              alt="Rating and Feedback"
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
        
        <div className="donor-nav-notifications" style={{position:'relative'}} ref={dropdownRef}>
          <button className="donor-nav-notification-icon" onClick={handleNotificationIconClick} style={{position:'relative'}}>
            <img
              src="/Resources/gihanRes/donationRes/notification.png"
              alt="Notifications"
            />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '18px',
                background: 'red',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '11px',
                border: '2px solid white',
                zIndex: 2
              }}>{unreadCount}</span>
            )}
          </button>
          {/* Dropdown menu */}
          <div className={`donor-nav-notification-dropdown${dropdownOpen ? ' open' : ''}`} style={{
            position: 'absolute',
            right: 0,
            top: '40px',
            minWidth: '320px',
            background: 'white',
            color: 'black',
            borderRadius: '10px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.16)',
            zIndex: 100,
            maxHeight: '350px',
            overflowY: 'auto',
            opacity: dropdownOpen ? 1 : 0,
            pointerEvents: dropdownOpen ? 'auto' : 'none',
            transform: dropdownOpen ? 'translateY(0)' : 'translateY(-15px)',
            transition: 'opacity 0.25s, transform 0.25s'
          }}>
            <div style={{padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight:'bold', fontSize:'17px', background:'#f6f6f6'}}>Notifications</div>
            {window.notificationFetchError ? (
              <div style={{padding:'24px', textAlign:'center', color:'red'}}>Error: {window.notificationFetchError}</div>
            ) : notifications.length === 0 ? (
              <div style={{padding:'24px', textAlign:'center', color:'#888'}}>No notifications</div>
            ) : (
              <ul style={{listStyle:'none', margin:0, padding:0}}>
                {notifications.map(n => (
                  <li key={n.id} style={{padding:'12px 16px', borderBottom:'1px solid #f2f2f2', fontSize:'15px'}}>{n.message}<br/><span style={{fontSize:'11px', color:'#888'}}>{n.time}</span></li>
                ))}
              </ul>
            )}
            {notifications.length > 0 && (
              <button className ="notification-donor-clear" onClick={handleClearAll} style={{width:'100%', background:'#e53935', color:'white', border:'none', borderRadius:'0 0 10px 10px', padding:'12px', fontWeight:'bold', fontSize:'15px', cursor:'pointer'}}>
                Clear All
              </button>
            )}
          </div>
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