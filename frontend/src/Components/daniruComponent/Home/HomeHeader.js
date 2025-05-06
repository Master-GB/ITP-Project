import React from "react";
import "./HomeHeader.css";
import { Link } from "react-router-dom";
import VolunteerApplication from "../VolunteerApplication/VolunteerApplication";

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
};

const HomeHeader = () => (
  <header className="home-header">
    <div className="branding">
      <span role="img" aria-label="logo" className="logo"><img
              src="/Resources/daniruRes/logo.png"
              alt="Logo"
              className="logo-img"
            /></span>
      <span className="branding-name">HODAHITHA.LK</span>
    </div>
    <nav className="home-nav">
      <Link to="/">Home</Link>
      <Link to="/volunteerapplication">Be a Volunteer</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
    <div className="home-user-section">
      <span>{getTimeBasedGreeting()}! | <Link to="/login">Login</Link></span>
      <span className="user-icon" role="img" aria-label="user">👤</span>
    </div>
  </header>
);

export default HomeHeader;
