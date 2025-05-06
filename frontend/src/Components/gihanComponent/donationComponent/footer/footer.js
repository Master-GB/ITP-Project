import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="donor-foot-footer">
      <div className="donor-foot-footer-first-section">
        <div className="donor-foot-platform-and-newsletter">
          <div className="donor-foot-platform-info">
            <div className="donor-foot-logo-container">
              <img
                src="/Resources/gihanRes/donationRes/mainlogo.png"
                alt="Platform Logo"
                className="donor-foot-logo"
              />
              <p className="donor-foot-tagline">Fighting hunger, one donation at a time.</p>
            </div>
          </div>

          <div className="donor-foot-newsletter-section">
            <h2>Stay Updated!</h2>
            <p>Subscribe to our newsletter for the latest news, updates, and impact stories.</p>
            <form className="donor-foot-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="donor-foot-right-sections">
          <div className="donor-foot-about-us">
            <h3>About Us</h3>
            <ul>
              <li><a href="/our-team">Our Team</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div className="donor-foot-donor-resources">
            <h3>Donor Resources</h3>
            <ul>
              <li><a href="/donation-guidelines">Donation Guidelines</a></li>
              <li><a href="/impact-stories">Impact Stories</a></li>
            </ul>
          </div>

          <div className="donor-foot-contact-us">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/phone.png" alt="Phone" className="donor-foot-contact-icon" />
                +(94) 77 2525 320 
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/email.png" alt="Email" className="donor-foot-contact-icon" />
                hithahoda@gmail.com
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/location.png" alt="Address" className="donor-foot-contact-icon" />
                101/B,Bangalawatha road,Kothalawala,Kaduwela
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="donor-foot-horizontal-separator"></div>

      <div className="donor-foot-footer-second-section">
        <div className="donor-foot-social-media">
          <div className="donor-foot-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="donor-foot-facebook">
              <img src="/Resources/gihanRes/donationRes/footerRes/facebook.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="donor-foot-twitter-x">
              <img src="/Resources/gihanRes/donationRes/footerRes/twitter-x.png" alt="Twitter-X" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="donor-foot-insta">
              <img src="/Resources/gihanRes/donationRes/footerRes/instagram.png" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="donor-foot-linkedin">
              <img src="/Resources/gihanRes/donationRes/footerRes/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="donor-foot-legal-compliance">
          <p className="donor-foot-copyright">
            © 2025 Surplus Food Donation and Redistribution Platform. All rights reserved.
          </p>
          <div className="donor-foot-legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookie-policy">Cookie Policy</a>
          </div>
        </div>

        <div className="donor-foot-partner-logos">
          <div className="donor-foot-logos">
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
