import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

// Lazy loaded components
const HomeFooter = lazy(() => import("./HomeFooter"));

// Food icons for floating animation
const FOOD_ICONS = [
  { icon: "🍎", style: { top: "15%", left: "10%" } },
  { icon: "🍞", style: { top: "30%", right: "12%" } },
  { icon: "🥦", style: { bottom: "18%", left: "18%" } },
  { icon: "🍊", style: { bottom: "10%", right: "20%" } },
  { icon: "🥑", style: { top: "40%", left: "30%" } },
  { icon: "🍇", style: { top: "25%", right: "28%" } },
];

// Background blurred shapes
const BLURRED_SHAPES = [
  { className: "home-blurred-shape home-shape1", style: { top: "10%", left: "-5%" } },
  { className: "home-blurred-shape home-shape2", style: { top: "60%", right: "-8%" } },
  { className: "home-blurred-shape home-shape3", style: { bottom: "-10%", left: "30%" } },
  { className: "home-blurred-shape home-shape4", style: { top: "20%", right: "20%" } },
];

// Impact statistics
const IMPACT_STATS = [
  { icon: "🍛", value: "12,345", label: "Meals Donated" },
  { icon: "🥗", value: "8,912 kg", label: "Food Saved" },
  { icon: "🤝", value: "1,200+", label: "Registered Donors" },
  { icon: "❤️", value: "9,450", label: "People Helped" },
];

// Success stories
const SUCCESS_STORIES = [
  { quote: "Thanks to HodaHitha, my family now has food security.", author: "Ayesha, Colombo" },
  { quote: "Our restaurant donates leftover meals every night.", author: "Shan, Kandy" },
  { quote: "I can now focus on my studies knowing I'll have meals.", author: "Priya, Jaffna" },
];

// How it works steps
const HOW_IT_WORKS_STEPS = [
  {
    icon: "🍽️",
    title: "List Surplus",
    description: "Donors upload food info, expiry, and location.",
  },
  {
    icon: "📍",
    title: "Auto-Match",
    description: "We match with nearby needy people.",
  },
  {
    icon: "🚚",
    title: "Deliver",
    description: "Food is collected and delivered safely and on time.",
  },
];

// Component for header
const Header = ({ navigate }) => {
  return (
    <header className="home-modern-header">
      <div className="home-header-content">
        <motion.img
          whileHover={{ scale: 1.1, rotate: -5 }}
          src="/resources/danirures/logo.png"
          alt="HodaHitha.lk Logo" 
          className="home-site-logo"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="home-site-name"
        >
          හොද හිත.lk
        </motion.span>
      </div>
      
      <nav className="home-header-nav">
        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: "#eaf6fb" }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/home">Home</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: "#eaf6fb" }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/volunteerapplication">Be a Volunteer</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: "#eaf6fb" }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/about-us">About Us</Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: "#eaf6fb" }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/contactus">Contact Us</Link>
        </motion.div>
      </nav>
      
      <div className="home-header-auth-btns">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="home-header-btn sign-in" 
          onClick={() => navigate('/login')}
        >
          Sign In
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="home-header-btn register" 
          onClick={() => navigate('/AddUser')}
        >
          Register
        </motion.button>
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="home-header-profile-icon"
        >
          <img src="/resources/danirures/profile.png" alt="Profile" />
        </motion.div>
      </div>
    </header>
  );
};

// Component for hero section
const HeroSection = ({ navigate }) => {
  return (
    <section className="home-hero-section" id="home">
      <div className="home-hero-gradient-overlay"></div>
      
      {FOOD_ICONS.map((item, idx) => (
        <motion.span
          key={idx}
          className={`home-floating-food-icon home-floating-food-icon-${idx}`}
          style={item.style}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            delay: idx * 0.5,
          }}
          aria-hidden="true"
        >
          {item.icon}
        </motion.span>
      ))}
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="home-hero-content"
      >
        <h1 className="home-main-title home-hero-glow">
          <span className="home-title-highlight">Turn Surplus</span> into Support
        </h1>
        
        <p className="home-mission">
          Join our mission to reduce food waste and help communities.
        </p>
        
        <div className="home-cta-btns">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="home-cta-btn home-donate home-glowing-btn"
            onClick={() => navigate('/ul/login')}
          >
            Donate Now
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="home-cta-btn home-request"
            onClick={() => navigate('/contactus')}
          >
            Request Help
          </motion.button>
        </div>
      </motion.div>
      
      <div className="home-hero-decoration">
        <div className="home-decoration-circle"></div>
        <div className="home-decoration-wave"></div>
      </div>
      
      <motion.div 
        className="home-scroll-down-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="home-arrow">↓</span>
      </motion.div>
    </section>
  );
};

// Section component for reuse
const Section = ({ id, title, children, className }) => {
  return (
    <section id={id} className={`home-${id}-section home-decorated-section home-glass-card ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="home-section-title">{title}</h2>
        {children}
      </motion.div>
    </section>
  );
};

// Wave divider component
const WaveDivider = ({ position }) => {
  return (
    <div className={`home-svg-divider home-svg-divider-${position}`}>
      <svg 
        viewBox="0 0 1440 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d={position === "bottom" 
            ? "M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" 
            : "M0,100 C480,0 960,100 1440,0 L1440,0 L0,0 Z"} 
          fill={position === "bottom" ? "#f5f7fa" : "#fff"}
        />
      </svg>
    </div>
  );
};

// Main Home component
const Home = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate();

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Header navigate={navigate} />
      
      {/* Decorative Top Bar */}
      <div className="home-decorative-top-bar">
        <span>🌱 Reducing Food Waste, Spreading Hope! 🌱</span>
      </div>
      
      {/* Floating Blurred Background Shapes */}
      <div className="home-background-blobs">
        {BLURRED_SHAPES.map((shape, idx) => (
          <motion.div 
            key={idx} 
            className={shape.className} 
            style={shape.style}
            animate={{
              scale: [1, 1.08, 1],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror",
              delay: idx * 2,
            }}
          />
        ))}
      </div>
      
      <main className="home-main-content">
        <HeroSection navigate={navigate} />
        
        <WaveDivider position="bottom" />
        
        <Section id="why" title="Why HodaHitha?">
          <p className="home-why-desc">
            Every day, tons of food go to waste while thousands go hungry. Our platform connects 
            food donors with those in need, ensuring surplus food is safely redistributed to create 
            a more sustainable and compassionate community.
          </p>
        </Section>
        
        <WaveDivider position="top" />
        
        <Section id="how" title="How It Works">
          <div className="home-how-steps-grid">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="home-how-card home-glass-card"
              >
                <motion.div 
                  className="home-how-icon-container"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.5,
                  }}
                >
                  <span className="home-how-icon" role="img" aria-label={step.title}>
                    {step.icon}
                  </span>
                </motion.div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>
        
        <WaveDivider position="bottom" />
        
        <Section id="impact" title="Our Impact">
          <div className="home-impact-cards">
            {IMPACT_STATS.map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="home-impact-card home-glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="home-impact-icon-container"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.5,
                  }}
                >
                  <span className="home-impact-icon" role="img" aria-label={stat.label}>
                    {stat.icon}
                  </span>
                </motion.div>
                <div className="home-impact-value">{stat.value}</div>
                <div className="home-impact-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Section>
        
        <WaveDivider position="top" />
        
        <Section id="success" title="Success Stories">
          <div className="home-success-stories">
            {SUCCESS_STORIES.map((story, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="home-success-card home-glass-card"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="home-quote-icon">❝</div>
                <p>"{story.quote}"</p>
                <span className="home-success-author">– {story.author}</span>
              </motion.div>
            ))}
          </div>
        </Section>
      </main>
      
      <Suspense fallback={<div>Loading footer...</div>}>
        <HomeFooter />
      </Suspense>
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="home-back-to-top-btn" 
            onClick={scrollToTop} 
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;