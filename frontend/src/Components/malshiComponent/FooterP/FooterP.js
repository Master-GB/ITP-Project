import React from "react";
import "./FooterP.css";

const Footer = () => {
  return (
    <footer className="Freq-donor-foot-footer">
      <div className="Freq-donor-foot-footer-first-section">
        <div className="Freq-donor-foot-platform-and-newsletter">
          <div className="Freq-donor-foot-platform-info">
            <div className="Freq-donor-foot-logo-container">
              <img
                src="/Resources/gihanRes/donationRes/mainlogo.png"
                alt="Platform Logo"
                className="Freq-donor-foot-logo"
              />
              <p className="Freq-donor-foot-tagline">Fighting hunger, one donation at a time.</p>
            </div>
          </div>

          <div className="Freq-donor-foot-newsletter-section">
            <h2>Stay Updated!</h2>
            <p>Subscribe to our newsletter for the latest news, updates, and impact stories.</p>
            <form className="Freq-donor-foot-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="Freq-donor-foot-right-sections">
          <div className="Freq-donor-foot-about-us">
            <h3>About Us</h3>
            <ul>
              <li><a href="/our-team">Our Team</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div className="Freq-donor-foot-donor-resources">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/Home">Home</a></li>
              <li><a href="/impact-stories">Be a Volunteer</a></li>
              <li><a href="/impact-stories">Donate Food</a></li>
              <li><a href="/impact-stories">FAQ</a></li>
            </ul>
          </div>

          <div className="Freq-donor-foot-contact-us">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/phone.png" alt="Phone" className="Freq-donor-foot-contact-icon" />
                +(94) 77 2525 320 
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/email.png" alt="Email" className="Freq-donor-foot-contact-icon" />
                hithahoda@gmail.com
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/location.png" alt="Address" className="Freq-donor-foot-contact-icon" />
                101/B,Bangalawatha road,Kothalawala,Kaduwela
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="Freq-donor-foot-horizontal-separator"></div>

      <div className="Freq-donor-foot-footer-second-section">
        <div className="Freq-donor-foot-social-media">
          <div className="Freq-donor-foot-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="Freq-donor-foot-facebook">
              <img src="/Resources/gihanRes/donationRes/footerRes/facebook.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="Freq-donor-foot-twitter-x">
              <img src="/Resources/gihanRes/donationRes/footerRes/twitter-x.png" alt="Twitter-X" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="Freq-donor-foot-insta">
              <img src="/Resources/gihanRes/donationRes/footerRes/instagram.png" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="Freq-donor-foot-linkedin">
              <img src="/Resources/gihanRes/donationRes/footerRes/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="Freq-donor-foot-legal-compliance">
          <p className="Freq-donor-foot-copyright">
            © 2025 HodaHitha.lk All rights reserved.
          </p>
          <div className="Freq-donor-foot-legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookie-policy">Cookie Policy</a>
          </div>
        </div>

        <div className="Freq-donor-foot-partner-logos">
          <div className="Freq-donor-foot-logos">
            <img src="/Resources/gihanRes/donationRes/footerRes/parLogo1.png" alt="Partner 1" />
            <img src="/Resources/gihanRes/donationRes/footerRes/parLogo2.png" alt="Partner 2" />
            <img src="/Resources/gihanRes/donationRes/footerRes/parLogo3.png" alt="Partner 3" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;