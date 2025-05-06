import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { motion } from "framer-motion";
import HomeFooter from "./HomeFooter";

const floatingIcons = [
  { icon: "🍎", style: { top: "15%", left: "10%" } },
  { icon: "🍞", style: { top: "30%", right: "12%" } },
  { icon: "🥦", style: { bottom: "18%", left: "18%" } },
  { icon: "🍊", style: { bottom: "10%", right: "20%" } },
];

const blurredShapes = [
  { className: "blurred-shape shape1", style: { top: "10%", left: "-5%" } },
  { className: "blurred-shape shape2", style: { top: "60%", right: "-8%" } },
  { className: "blurred-shape shape3", style: { bottom: "-10%", left: "30%" } },
];

const Home = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Modern Header with Logo and Site Name */}
      <header className="modern-header">
        <div className="header-content">
          <img src="/resources/danirures/logo.png" alt="HodaHitha.lk Logo" className="site-logo" />
          <span className="site-name">HodaHitha.lk</span>
        </div>
        <nav className="header-nav">
          <a href="#home">Home</a>
          <a href="/volunteerapplication">Be a Volunteer</a>
          <a href="#about">About Us</a>
        </nav>
        <div className="header-auth-btns">
          <button className="header-btn sign-in" onClick={() => navigate('/login')}>Sign In</button>
          <button className="header-btn register" onClick={() => navigate('/AddUser')}>Register</button>
          <div className="header-profile-icon">
            <img src="/resources/danirures/profile.png" alt="Profile" />
          </div>
        </div>
      </header>
      {/* Decorative Top Bar */}
      <div className="decorative-top-bar">
        <span>🌱 Reducing Food Waste, Spreading Hope! 🌱</span>
      </div>
      {/* Floating Blurred Background Shapes */}
      <div className="background-blobs">
        {blurredShapes.map((shape, idx) => (
          <div key={idx} className={shape.className} style={shape.style}></div>
        ))}
      </div>
      <main className="home-main-content">
        {/* Hero Section */}
        <section className="hero-section">
          {/* Animated Gradient Overlay */}
          <div className="hero-gradient-overlay"></div>
          {/* Animated Floating Food Icons */}
          {floatingIcons.map((item, idx) => (
            <span
              key={idx}
              className={`floating-food-icon floating-food-icon-${idx}`}
              style={item.style}
              aria-hidden="true"
            >
              {item.icon}
            </span>
          ))}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="main-title hero-glow">
              <span className="title-highlight">Turn Surplus</span> into Support
            </h1>
            <p className="home-mission">Join our mission to reduce food waste and help communities.</p>
            <div className="home-cta-btns">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="home-cta-btn donate glowing-btn"
              >
                Donate Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="home-cta-btn request"
              >
                Request Help
              </motion.button>
            </div>
            <div className="home-auth-links">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="home-auth-btn"
              >
              </motion.button>
            </div>
          </motion.div>
          <div className="hero-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-wave"></div>
          </div>
          {/* Scroll Down Indicator */}
          <div className="scroll-down-indicator">
            <span className="arrow">↓</span>
          </div>
      </section>

        {/* SVG Wave Divider */}
        <div className="svg-divider svg-divider-bottom">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#f5f7fa"/></svg>
        </div>

        {/* Why Section */}
        <section className="why-section decorated-section glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why HodaHitha?</h2>
            <p className="why-desc">Every day, tons of food go to waste while thousands go hungry. Our platform connects food donors with those in need, ensuring surplus food is safely redistributed.</p>
          </motion.div>
        </section>

        <div className="svg-divider svg-divider-top">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C480,0 960,100 1440,0 L1440,0 L0,0 Z" fill="#fff"/></svg>
        </div>

        {/* How It Works Section */}
        <section className="how-section decorated-section glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">How It Works</h2>
            <div className="how-steps-grid">
              <motion.div 
                whileHover={{ y: -10 }}
                className="how-card glass-card"
              >
                <div className="how-icon-container">
                  <span className="how-icon" role="img" aria-label="List Surplus">🍽️</span>
                </div>
                <h3>List Surplus</h3>
                <p>Donors upload food info, expiry, and location.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10 }}
                className="how-card glass-card"
              >
                <div className="how-icon-container">
                  <span className="how-icon" role="img" aria-label="Auto-Match">📍</span>
                </div>
                <h3>Auto-Match</h3>
                <p>We match with nearby needy people.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10 }}
                className="how-card glass-card"
              >
                <div className="how-icon-container">
                  <span className="how-icon" role="img" aria-label="Deliver">🚚</span>
                </div>
                <h3>Deliver</h3>
                <p>Food is collected and delivered safely and on time.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="svg-divider svg-divider-bottom">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#f5f7fa"/></svg>
        </div>

        {/* Impact Section */}
        <section className="impact-section decorated-section glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Impact</h2>
            <div className="impact-cards">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="impact-card glass-card"
              >
                <div className="impact-icon-container">
                  <span className="impact-icon" role="img" aria-label="Meals">🍛</span>
                </div>
                <div className="impact-value">12,345</div>
                <div className="impact-label">Meals Donated</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="impact-card glass-card"
              >
                <div className="impact-icon-container">
                  <span className="impact-icon" role="img" aria-label="Food Saved">🥗</span>
                </div>
                <div className="impact-value">8,912 kg</div>
                <div className="impact-label">Food Saved</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="impact-card glass-card"
              >
                <div className="impact-icon-container">
                  <span className="impact-icon" role="img" aria-label="Donors">🤝</span>
                </div>
                <div className="impact-value">1,200+</div>
                <div className="impact-label">Registered Donors</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="impact-card glass-card"
              >
                <div className="impact-icon-container">
                  <span className="impact-icon" role="img" aria-label="People Helped">❤️</span>
                </div>
                <div className="impact-value">9,450</div>
                <div className="impact-label">People Helped</div>
              </motion.div>
        </div>
          </motion.div>
        </section>

        <div className="svg-divider svg-divider-top">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C480,0 960,100 1440,0 L1440,0 L0,0 Z" fill="#fff"/></svg>
        </div>

        {/* Success Stories Section */}
        <section className="success-section decorated-section glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Success Stories</h2>
            <div className="success-stories">
              <motion.div 
                whileHover={{ y: -5 }}
                className="success-card glass-card"
              >
                <div className="quote-icon">❝</div>
                <p>"Thanks to HodaHitha, my family now has food security."</p>
                <span className="success-author">– Ayesha, Colombo</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="success-card glass-card"
              >
                <div className="quote-icon">❝</div>
                <p>"Our restaurant donates leftover meals every night."</p>
                <span className="success-author">– Shan, Kandy</span>
              </motion.div>
    </div>
          </motion.div>
        </section>
      </main>
      <HomeFooter />
      {/* Back to Top Button */}
      {showTopBtn && (
        <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
};

export default Home;
