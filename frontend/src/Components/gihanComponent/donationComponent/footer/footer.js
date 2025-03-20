import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* First Section */}
      <div className="footer-first-section">
        {/* Left Column */}
        <div className="left-column">
          {/* Platform Information */}
          <div className="platform-info">
            <div className="logo-container">
              <img
                src="/Resources/gihanRes/donationRes/mainlogo.png" // Replace with your logo path
                alt="Platform Logo"
                className="logo"
              />
              <p className="tagline">Fighting hunger, one donation at a time.</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="newsletter-section">
            <h2>Stay Updated!</h2>
            <p>Subscribe to our newsletter for the latest news, updates, and impact stories.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* About Us */}
          <div className="about-us">
            <h3>About Us</h3>
            <ul>
              <li><a href="/our-team">Our Team</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          {/* Donor Resources */}
          <div className="donor-resources">
            <h3>Donor Resources</h3>
            <ul>
              <li><a href="/donation-guidelines">Donation Guidelines</a></li>
              <li><a href="/impact-stories">Impact Stories</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="contact-us">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/phone.png" alt="Phone" className="contact-icon" />
                +(65) 6653 8065
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/email.png" alt="Email" className="contact-icon" />
                hello@futuremarketer.co
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/location.png" alt="Address" className="contact-icon" />
                One Neil Road #02-02, Singapore 088804
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="horizontal-separator"></div>

      {/* Second Section */}
      <div className="footer-second-section">
        {/* Social Media Links */}
        <div className="social-media">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook">
              <img src="/Resources/gihanRes/donationRes/footerRes/facebook.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter-x">
              <img src="/Resources/gihanRes/donationRes/footerRes/twitter-x.png" alt="Twitter-X" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="insta">
              <img src="/Resources/gihanRes/donationRes/footerRes/instagram.png" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin">
              <img src="/Resources/gihanRes/donationRes/footerRes/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Legal and Compliance */}
        <div className="legal-compliance">
          <p className="copyright">© 2023 Platform Name. All rights reserved.</p>
          <div className="legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookie-policy">Cookie Policy</a>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="partner-logos">
          <div className="logos">
            <img src="/path/to/partner1.png" alt="Partner 1" />
            <img src="/path/to/partner2.png" alt="Partner 2" />
            <img src="/path/to/partner3.png" alt="Partner 3" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;