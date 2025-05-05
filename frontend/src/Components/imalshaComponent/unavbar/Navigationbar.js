import React from 'react';
import { Link } from 'react-router-dom';
import './Navigationbar.css'; 

function Navigationbar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
          <li className="sidebar-item">
            <Link to="/dashbord" className="sidebar-link">
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
            <Link to="/login" className="sidebar-link">
              <span className="sidebar-text">Login</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/addUser" className="sidebar-link">
              <span className="sidebar-text">Register</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/userdetails" className="sidebar-link">
              <span className="sidebar-text">User Details</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/feedback" className="sidebar-link">
              <span className="sidebar-text">All Feedbacks</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/feedbackForm" className="sidebar-link">
              <span className="sidebar-text">Feedback Form</span>
            </Link>
          </li>
          
         
          
          
        </ul>
      </nav>
    </div>
  
  );
}

export default Navigationbar;
