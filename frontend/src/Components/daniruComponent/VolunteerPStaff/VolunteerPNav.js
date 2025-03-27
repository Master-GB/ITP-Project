import React from 'react';
import { Link } from "react-router-dom";
import "./VolunteerPNav.css";

function VolunteerNav() {
  return (
    <nav className="volunteer-navbar">
      <div className="volunteer-nav-logo">VolunteerDash</div>
      <ul className="volunteer-nav-links">
        <li><Link to="/volunteerpstaffdashboard">Dashboard</Link></li>
        <li><Link to="/volunteer/:volunteerName">My Tasks</Link></li>
        <li><Link to="/packinginstructions">Packing Instructions</Link></li>
        <li><Link to="/messages">Messages</Link></li>
      </ul>
      <button className="volunteer-nav-logout-btn">Logout</button>
    </nav>
  );
}

export default VolunteerNav;
