import React, { useState, useEffect } from "react";
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
  { className: "home-blurred-shape home-shape1", style: { top: "10%", left: "-5%" } },
  { className: "home-blurred-shape home-shape2", style: { top: "60%", right: "-8%" } },
  { className: "home-blurred-shape home-shape3", style: { bottom: "-10%", left: "30%" } },
];

const Home = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

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
      <header className="home-modern-header">
        <div className="home-header-content">
          <img src="/resources/danirures/logo.png" alt="HodaHitha.lk Logo" className="home-site-logo" />
          <span className="home-site-name">HodaHitha.lk</span>
        </div>
        <nav className="home-header-nav">
          <a href="#home">Home</a>
          <a href="/volunteerapplication">Be a Volunteer</a>
          <a href="#about">About Us</a>
        </nav>
        <div className="home-header-auth-btns">
          <button className="home-header-btn home-sign-in">Sign In</button>
          <button className="home-header-btn home-register">Register</button>
          <div className="home-header-profile-icon">
            <img src="/resources/danirures/profile.png" alt="Profile" />
          </div>
        </div>
      </header>
      {/* Decorative Top Bar */}
      <div className="home-decorative-top-bar">
        <span>🌱 Reducing Food Waste, Spreading Hope! 🌱</span>
      </div>
      {/* Floating Blurred Background Shapes */}
      <div className="home-background-blobs">
        {blurredShapes.map((shape, idx) => (
          <div key={idx} className={shape.className} style={shape.style}></div>
        ))}
      </div>
      <main className="home-main-content">
        {/* Hero Section */}
        <section className="home-hero-section">
          {/* Animated Gradient Overlay */}
          <div className="home-hero-gradient-overlay"></div>
          {/* Animated Floating Food Icons */}
          {floatingIcons.map((item, idx) => (
            <span
              key={idx}
              className={`home-floating-food-icon home-floating-food-icon-${idx}`}
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
            className="home-hero-content"
          >
            <h1 className="home-main-title home-hero-glow">
              <span className="home-title-highlight">Turn Surplus</span> into Support
            </h1>
            <p className="home-mission">Join our mission to reduce food waste and help communities.</p>
            <div className="home-cta-btns">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="home-cta-btn home-donate home-glowing-btn"
              >
                Donate Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="home-cta-btn home-request"
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
          <div className="home-hero-decoration">
            <div className="home-decoration-circle"></div>
            <div className="home-decoration-wave"></div>
          </div>
          {/* Scroll Down Indicator */}
          <div className="home-scroll-down-indicator">
            <span className="home-arrow">↓</span>
          </div>
      </section>

        {/* SVG Wave Divider */}
        <div className="home-svg-divider home-svg-divider-bottom">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#f5f7fa"/></svg>
        </div>

        {/* Why Section */}
        <section className="home-why-section home-decorated-section home-glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="home-section-title">Why HodaHitha?</h2>
            <p className="home-why-desc">Every day, tons of food go to waste while thousands go hungry. Our platform connects food donors with those in need, ensuring surplus food is safely redistributed.</p>
          </motion.div>
        </section>

        <div className="home-svg-divider home-svg-divider-top">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C480,0 960,100 1440,0 L1440,0 L0,0 Z" fill="#fff"/></svg>
        </div>

        {/* How It Works Section */}
        <section className="home-how-section home-decorated-section home-glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="home-section-title">How It Works</h2>
            <div className="home-how-steps-grid">
              <motion.div 
                whileHover={{ y: -10 }}
                className="home-how-card home-glass-card"
              >
                <div className="home-how-icon-container">
                  <span className="home-how-icon" role="img" aria-label="List Surplus">🍽️</span>
                </div>
                <h3>List Surplus</h3>
                <p>Donors upload food info, expiry, and location.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10 }}
                className="home-how-card home-glass-card"
              >
                <div className="home-how-icon-container">
                  <span className="home-how-icon" role="img" aria-label="Auto-Match">📍</span>
                </div>
                <h3>Auto-Match</h3>
                <p>We match with nearby needy people.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10 }}
                className="home-how-card home-glass-card"
              >
                <div className="home-how-icon-container">
                  <span className="home-how-icon" role="img" aria-label="Deliver">🚚</span>
                </div>
                <h3>Deliver</h3>
                <p>Food is collected and delivered safely and on time.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="home-svg-divider home-svg-divider-bottom">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#f5f7fa"/></svg>
        </div>

        {/* Impact Section */}
        <section className="home-impact-section home-decorated-section home-glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="home-section-title">Our Impact</h2>
            <div className="home-impact-cards">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="home-impact-card home-glass-card"
              >
                <div className="home-impact-icon-container">
                  <span className="home-impact-icon" role="img" aria-label="Meals">🍛</span>
                </div>
                <div className="home-impact-value">12,345</div>
                <div className="home-impact-label">Meals Donated</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="home-impact-card home-glass-card"
              >
                <div className="home-impact-icon-container">
                  <span className="home-impact-icon" role="img" aria-label="Food Saved">🥗</span>
                </div>
                <div className="home-impact-value">8,912 kg</div>
                <div className="home-impact-label">Food Saved</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="home-impact-card home-glass-card"
              >
                <div className="home-impact-icon-container">
                  <span className="home-impact-icon" role="img" aria-label="Donors">🤝</span>
                </div>
                <div className="home-impact-value">1,200+</div>
                <div className="home-impact-label">Registered Donors</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="home-impact-card home-glass-card"
              >
                <div className="home-impact-icon-container">
                  <span className="home-impact-icon" role="img" aria-label="People Helped">❤️</span>
                </div>
                <div className="home-impact-value">9,450</div>
                <div className="home-impact-label">People Helped</div>
              </motion.div>
        </div>
          </motion.div>
        </section>

        <div className="home-svg-divider home-svg-divider-top">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C480,0 960,100 1440,0 L1440,0 L0,0 Z" fill="#fff"/></svg>
        </div>

        {/* Success Stories Section */}
        <section className="home-success-section home-decorated-section home-glass-card">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="home-section-title">Success Stories</h2>
            <div className="home-success-stories">
              <motion.div 
                whileHover={{ y: -5 }}
                className="home-success-card home-glass-card"
              >
                <div className="home-quote-icon">❝</div>
                <p>"Thanks to HodaHitha, my family now has food security."</p>
                <span className="home-success-author">– Ayesha, Colombo</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="home-success-card home-glass-card"
              >
                <div className="home-quote-icon">❝</div>
                <p>"Our restaurant donates leftover meals every night."</p>
                <span className="home-success-author">– Shan, Kandy</span>
              </motion.div>
    </div>
          </motion.div>
        </section>
      </main>
      <HomeFooter />
      {/* Back to Top Button */}
      {showTopBtn && (
        <button className="home-back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
};

export default Home;