import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaComments, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import './aNavigationBar.css'; 

function Navigationbar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo-col">
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Logo" className="logo-img" />
        <span className="logo-text-green">User<br/>Management</span>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link to="/admindashboard" className="sidebar-link">
              <FaTachometerAlt className="sidebar-icon" />
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/userdetails" className="sidebar-link">
              <FaUsers className="sidebar-icon" />
              <span className="sidebar-text">User Details</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/feedback" className="sidebar-link">
              <FaComments className="sidebar-icon" />
              <span className="sidebar-text">Feedbacks</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-profile">
        <div className="profile-pic">
          <FaUserCircle size={48} />
        </div>
        <div className="profile-info">
          <span className="profile-name">Admin User</span>
          <span className="profile-role-green">Admin</span>
        </div>
        <button className="signout-btn">
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Navigationbar;
