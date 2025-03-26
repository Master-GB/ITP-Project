import React from 'react';
import './NavBarP.css';
import { Link } from "react-router-dom";

function RequestNavBar() {
  return (
    <div className="request-navbar">
      <ul className="request-navbar-menu">
        <li className="request-navbar-item">
          <Link to="/add-request">
            <h1>Add Request</h1>
          </Link>
        </li>
        <li className="request-navbar-item">
          <Link to="/display-requests">
            <h1>Display Requests</h1>
          </Link>
        </li>
        <li className="request-navbar-item">
          <Link to="/profile">
            <h1>Profile</h1>
          </Link>
        </li>
        <li className="request-navbar-item">
          <Link to="/funds">
            <h1>Funds</h1>
          </Link>
        </li>
        <li className="request-navbar-item">
          <Link to="/display-request">
            <h1>Display Request</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default RequestNavBar;
