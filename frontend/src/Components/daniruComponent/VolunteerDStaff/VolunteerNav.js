import React from 'react';
import { Link } from "react-router-dom";
import "./VolunteerNav.css";

function VolunteerNav() {
  return (
    <nav className="navbar">
      <div className="logo">VolunteerDash</div>
      <ul className="nav-links">
        <li><Link to="/volunteerdstaffdashboard">Dashboard</Link></li>
        <li><Link to="/volunteer/:volunteerName">My Tasks</Link></li>
        <li><Link to="/routeplanning">Route Planning</Link></li>
        <li><Link to="/messages">Messages</Link></li>
        <li><Link to="/performance">Performance</Link></li>
      </ul>
      <button className="logout-btn">Logout</button>
    </nav>
  );
}

export default VolunteerNav;
