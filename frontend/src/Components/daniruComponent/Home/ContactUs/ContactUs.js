import React, { useState } from "react";
import "./ContactUs.css";
import Home from "../Home";
import HomeFooter from "../HomeFooter";
import { useNavigate } from "react-router-dom";


const Support = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you would send the form data to the backend here
  };

  const navigate = useNavigate();
  return (
    <div>
        {/* Modern Header with Logo and Site Name */}
      <header className="home-modern-header">
        <div className="home-header-content">
          <img src="/resources/danirures/logo.png" alt="HodaHitha.lk Logo" className="home-site-logo" />
          <span className="home-site-name">HodaHitha.lk</span>
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
    <div className="support-background">
      <div className="support-container">
        <div className="support-header">
          <h1>Support & Help Center</h1>
          <p className="support-intro">
            Need assistance? We're here to help! Find answers to common questions or contact our support team below.
          </p>
        </div>
        <div className="support-content">
          <div className="support-contact">
            <h2>Contact Us</h2>
            <p>Email: <a href="mailto:hithahoda@gmail.com">hithahoda@gmail.com</a></p>
            <p>Phone: <a href="tel:+94772129310">+94 077 2129 310</a></p>
          </div>
          <div className="support-form-section">
            <h2>Submit a Support Request</h2>
            {submitted ? (
              <div className="support-success">Thank you! Your message has been sent.</div>
            ) : (
              <form className="support-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
        <div className="support-topics">
          <h2>Common Support Topics</h2>
          <ul>
            <li>How to donate surplus food</li>
            <li>How to track your donations</li>
            <li>Editing your donor profile</li>
            <li>Understanding donation guidelines</li>
            <li>Contacting the volunteer team</li>
          </ul>
        </div>
      </div>
    </div>
    <HomeFooter/>
    </div>
  );
};

export default Support;
