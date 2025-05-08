import React from "react";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";
import Home from "../Home";
import HomeFooter from "../HomeFooter";


const AboutUs = () => {
    const navigate = useNavigate();
  return (
    <div>
        {/* Modern Header with Logo and Site Name */}
      <header className="home-modern-header">
        <div className="home-header-content">
          <img src="/resources/danirures/logo.png" alt="HodaHitha.lk Logo" className="home-site-logo" />
          <span className="home-site-name">හොද හිත.lk</span>
        </div>
        <nav className="home-header-nav">
          <a href="/home">Home</a>
          <a href="/volunteerapplication">Be a Volunteer</a>
          <a href="/about-us">About Us</a>
          <a href="/contactus">Contact Us</a>
        </nav>
        <div className="home-header-auth-btns">
          <button className="home-header-btn sign-in" onClick={() => navigate('/login')}>Sign In</button>
          <button className="home-header-btn register" onClick={() => navigate('/AddUser')}>Register</button>
          <div className="home-header-profile-icon">
            <img src="/resources/danirures/profile.png" alt="Profile" />
          </div>
        </div>
      </header>
    <div class = "aboutUs-back">
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About Our Donation Platform</h1>
        <p className="about-us-mission">
          Empowering communities by connecting donors and recipients for a better tomorrow.
        </p>
      </div>
      <div className="about-us-content">
        <section className="about-us-section">
          <h2>Who We Are</h2>
          <p>
            We are a passionate team dedicated to reducing food waste and supporting those in need. Our platform bridges the gap between generous donors and trusted organizations, ensuring that every donation makes a meaningful impact.
          </p>
        </section>
        <section className="about-us-section">
          <h2>Our Mission</h2>
          <p>
            To create a transparent, efficient, and compassionate network for food and goods donation. We believe in the power of community and strive to make giving easy, safe, and rewarding for everyone.
          </p>
        </section>
        <section className="about-us-section">
          <h2>Our Core Values</h2>
          <ul className="about-us-values">
            <li>Integrity & Transparency</li>
            <li>Community Empowerment</li>
            <li>Compassion & Inclusion</li>
            <li>Innovation</li>
            <li>Sustainability</li>
          </ul>
        </section>
      </div>
      <div className="about-us-team-section">
        <h2>Our Team</h2>
        <div className="about-us-team-list">
          <div className="about-us-team-member">
            <h3>Delivery Volunteer</h3>
            <p>Responsible for ensuring donations are delivered safely and promptly to recipients, making a direct impact on the community.</p>
          </div>
          <div className="about-us-team-member">
            <h3>Packaging Volunteer</h3>
            <p>Carefully prepares and packages donations to maintain quality and safety before distribution.</p>
          </div>
          <div className="about-us-team-member">
            <h3>Volunteer Coordinator</h3>
            <p>Organizes and supports our volunteer network, ensuring smooth collaboration and effective outreach efforts.</p>
          </div>
          <div className="about-us-team-member">
            <h3>Operating Manager</h3>
            <p>Oversees platform operations, logistics, and partnerships, driving the mission and growth of our organization.</p>
          </div>
        </div>
      </div>
      <div className="about-us-footer">
        <p>Contact us: <a href="mailto:hithahoda@gmail.com">hithahoda@gmail.com</a></p>
      </div>
    </div>
    </div>
    <HomeFooter/>
    </div>
  );
};

export default AboutUs;
