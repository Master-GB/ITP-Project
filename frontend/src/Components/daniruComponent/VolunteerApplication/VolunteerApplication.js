import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VolunteerApplication.css";
import Home from "../VolunteerCDashboard";
import HomeFooter from "../Home/HomeFooter";

function VolunteerForm() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    volunteerName: "",
    contactNumber: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    general: ""
  });
  const [success, setSuccess] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [contactValid, setContactValid] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      inputs.volunteerName.trim() &&
      contactValid &&
      emailValid &&
      !errors.email &&
      !errors.phone &&
      inputs.role;
    setFormValid(isValid);
  }, [inputs, emailValid, contactValid, errors]);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "contactNumber") {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 10) {
        setInputs(prev => ({ ...prev, [name]: numbersOnly }));
        setContactValid(numbersOnly.length === 10);
        // Clear phone error when user starts typing
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    } else if (name === "email") {
      setInputs(prev => ({ ...prev, [name]: value }));
      setEmailValid(validateEmail(value));
      // Clear email error when user starts typing
      setErrors(prev => ({ ...prev, email: "" }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8090/volunteers/check-email/${email}`);
      if (response.data.exists) {
        setErrors(prev => ({ 
          ...prev, 
          email: response.data.message || "This email is already registered as a volunteer"
        }));
        return false;
      }
      setErrors(prev => ({ ...prev, email: "" }));
      return true;
    } catch (error) {
      console.error("Error checking email:", error);
      setErrors(prev => ({ 
        ...prev, 
        email: "Error checking email availability"
      }));
      return false;
    }
  };

  const checkPhoneAvailability = async (phone) => {
    try {
      const response = await axios.get(`http://localhost:8090/volunteers/check-phone/${phone}`);
      if (response.data.exists) {
        setErrors(prev => ({ 
          ...prev, 
          phone: response.data.message || "This phone number is already registered as a volunteer"
        }));
        return false;
      }
      setErrors(prev => ({ ...prev, phone: "" }));
      return true;
    } catch (error) {
      console.error("Error checking phone:", error);
      setErrors(prev => ({ 
        ...prev, 
        phone: "Error checking phone availability"
      }));
      return false;
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    
    if (name === "email" && value) {
      if (!emailValid) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        await checkEmailAvailability(value);
      }
    } 
    else if (name === "contactNumber" && value) {
      if (!contactValid) {
        setErrors(prev => ({ ...prev, phone: "Please enter a 10-digit contact number" }));
      } else {
        await checkPhoneAvailability(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValid) {
      setErrors(prev => ({ ...prev, general: "Please fill all fields correctly" }));
      return;
    }

    // Final validation before submission
    const isEmailAvailable = await checkEmailAvailability(inputs.email);
    const isPhoneAvailable = await checkPhoneAvailability(inputs.contactNumber);

    if (!isEmailAvailable || !isPhoneAvailable) {
      return; // Stop if either email or phone is already registered
    }

    // Clear all errors
    setErrors({ email: "", phone: "", general: "" });
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8090/volunteers", {
        volunteerName: inputs.volunteerName.trim(),
        contactNumber: inputs.contactNumber,
        email: inputs.email.trim(),
        role: inputs.role,
        status: "Pending",
        dateApplied: new Date().toISOString()
      });

      if (response.status === 200) {
        setSuccess("Volunteer application submitted successfully!");
        // Clear form
        setInputs({
          volunteerName: "",
          contactNumber: "",
          email: "",
          role: "",
        });
        // Reset validation states
        setEmailValid(false);
        setContactValid(false);
        // Redirect after 2 seconds
        setTimeout(() => history("/volunteerapplication"), 2000);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.type === "email") {
          setErrors(prev => ({ ...prev, email: err.response.data.message }));
        } else if (err.response.data.type === "phone") {
          setErrors(prev => ({ ...prev, phone: err.response.data.message }));
        } else {
          setErrors(prev => ({ 
            ...prev, 
            general: err.response.data.message || "Something went wrong! Please try again."
          }));
        }
      } else {
        setErrors(prev => ({ 
          ...prev, 
          general: "Something went wrong! Please try again."
        }));
      }
      console.error("Submission error:", err);
    }
  };

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
    <div className="volunteer-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Resources/daniruRes/volunteer-bg.jpg)` }}>
      <div className="volunteer-application-form-container">
        <h2 className="volunteer-application-name">Volunteer Application</h2>

        {errors.general && <div className="error-message">{errors.general}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="volunteer-application-form">
          <div className="volunteer-application-form-group">
            <label htmlFor="volunteerName">Full Name:</label>
            <input
              type="text"
              id="volunteerName"
              name="volunteerName"
              value={inputs.volunteerName}
              onChange={handleChange}
              required
              className={inputs.volunteerName.trim() ? 'valid-input' : ''}
            />
          </div>

          <div className="volunteer-application-form-group contact-group">
            <label htmlFor="contactNumber">Contact Number:</label>
            <div className="contact-input-wrapper">
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={inputs.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                placeholder="10 digits required"
                required
                className={errors.phone ? 'phone-error' : contactValid ? 'valid-input' : ''}
              />
              {errors.phone && (
                <span className="contact-error-hint">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="volunteer-application-form-group">
            <label htmlFor="email">Email Address:</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={errors.email ? 'email-error' : emailValid ? 'valid-input' : ''}
              />
              {errors.email && (
                <span className="email-error-hint">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="volunteer-application-form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={inputs.role}
              onChange={handleChange}
              required
              className={inputs.role ? 'valid-input' : ''}
            >
              <option value="">Select a role</option>
              <option value="Volunteer Delivery Staff">Volunteer Delivery Staff</option>
              <option value="Volunteer Packing Staff">Volunteer Packing Staff</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="volunteer-application-submit-button"
            disabled={!formValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    <HomeFooter/>
    </div>
  );
}

export default VolunteerForm;