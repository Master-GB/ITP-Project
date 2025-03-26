import React from 'react';
import './NavBarP.css';
import { Link } from "react-router-dom";

function NavBarP() {
  return (
    <div className="navbar">
      <ul className="navbar-ul">
        <li className="navbar-li">
          <Link to="/add-requests">
            <h1>Add Request</h1>
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/display-requests">
            <h1>Display Requests</h1>
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/profile">
            <h1>Profile</h1>
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/funds">
            <h1>Funds</h1>
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/display-request">
            <h1>Display Request</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBarP;