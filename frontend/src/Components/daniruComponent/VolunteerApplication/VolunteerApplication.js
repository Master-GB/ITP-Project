import React, { useState } from "react";
import "./VolunteerApplication.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VolunteerForm() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    volunteerName: "",
    contactNumber: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState("");  // To capture error messages
  const [success, setSuccess] = useState("");  // To show success message

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation before sending the request
    if (!validateEmail(inputs.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(inputs.contactNumber)) {
      setError("Please enter a valid contact number.");
      return;
    }
    setError(""); // Clear error messages
    setSuccess(""); // Reset success message

    try {
      await sendRequest();
      setSuccess("Volunteer application submitted successfully!");
      history("/volunteers");
    } catch (err) {
      setError("Something went wrong! Please try again.");
    }
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:8090/volunteers", {
        volunteerName: String(inputs.volunteerName),
        contactNumber: String(inputs.contactNumber),
        email: String(inputs.email),
        role: String(inputs.role),
      })
      .then((res) => res.data);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  // Contact number validation (example: ensure it's a valid phone number format)
  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  return (
    <div className="volunteer-application-form-container">
      <h2>Volunteer Application</h2>

      {error && <div className="error-message">{error}</div>}  {/* Display error */}
      {success && <div className="success-message">{success}</div>}  {/* Display success */}

      <form onSubmit={handleSubmit} className="volunteer-application-form">
        <div className="volunteer-application-form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="volunteerName"
            name="volunteerName"
            value={inputs.volunteerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="volunteer-application-form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={inputs.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="volunteer-application-form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="volunteer-application-form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={inputs.role}
            onChange={handleChange}
            required
          >
            <option value="Volunteer Delivery Staff">Volunteer Delivery Staff</option>
            <option value="Volunteer Packing Staff">Volunteer Packing Staff</option>
          </select>
        </div>

        <button type="submit" className="volunteer-application-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default VolunteerForm;
