import React from "react";
import "./HomeFooter.css";

const Footer = () => {
  return (
    <footer className="daniru-footer">
      {/* First Section */}
      <div className="daniru-footer-first-section">
        {/* Platform Information and Newsletter */}
        <div className="daniru-platform-and-newsletter">
          {/* Platform Information */}
          <div className="daniru-platform-info">
            <div className="daniru-logo-container">
              <img
                src="/Resources/gihanRes/donationRes/mainlogo.png" // Replace with your logo path
                alt="Platform Logo"
                className="daniru-logo"
              />
              <p className="daniru-tagline">Fighting hunger, one donation at a time.</p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="daniru-newsletter-section">
            <h2>Stay Updated!</h2>
            <p>Subscribe to our newsletter for the latest news, updates, and impact stories.</p>
            <form className="daniru-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* About Us, Donor Resources, and Contact Us */}
        <div className="daniru-right-sections">
          <div className="daniru-about-us">
            <h3>About Us</h3>
            <ul>
              <li><a href="/about-us">Our Team</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div className="daniru-donor-resources">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/volunteerapplication">Be a Volunteer</a></li>
              <li><a href="/ul/login">Donate Food</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          <div className="daniru-contact-us">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/phone.png" alt="Phone" className="daniru-contact-icon" />
                +(94) 77 2525 320 
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/email.png" alt="Email" className="daniru-contact-icon" />
                hithahoda@gmail.com
              </li>
              <li>
                <img src="/Resources/gihanRes/donationRes/footerRes/location.png" alt="Address" className="daniru-contact-icon" />
                 101/B,Bangalawatha road,Kothalawala,Kaduwela
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="daniru-horizontal-separator"></div>

      {/* Second Section */}
      <div className="daniru-footer-second-section">
        {/* Social Media Links */}
        <div className="daniru-social-media">
          <div className="daniru-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="daniru-facebook">
              <img src="/Resources/gihanRes/donationRes/footerRes/facebook.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="daniru-twitter-x">
              <img src="/Resources/gihanRes/donationRes/footerRes/twitter-x.png" alt="Twitter-X" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="daniru-insta">
              <img src="/Resources/gihanRes/donationRes/footerRes/instagram.png" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="daniru-linkedin">
              <img src="/Resources/gihanRes/donationRes/footerRes/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Legal and Compliance */}
        <div className="daniru-legal-compliance">
          <p className="daniru-copyright">© 2025 HodaHitha.lk. All rights reserved.</p>
          <div className="daniru-legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookie-policy">Cookie Policy</a>
          </div>
        </div>

        {/* Partner Logos */}
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