import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRequests.css';

function AddRequests() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    location: "",
    contactNumber: "",
    foodType: "",
    quantity: "",
    additionalNotes: "",
    status: "pending"
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // Location validation
    if (!inputs.location.trim()) {
      formErrors.location = "Location is required";
    } else if (inputs.location.length < 2 || inputs.location.length > 200) {
      formErrors.location = "Location must be between 2 and 200 characters";
    }

    // Contact Number validation
    const phoneRegex = /^\d{10}$/; // Ensures exactly 10 digits
    if (!inputs.contactNumber.trim()) {
      formErrors.contactNumber = "Contact Number is required";
    } else if (!phoneRegex.test(inputs.contactNumber)) {
      formErrors.contactNumber = "Contact Number must be exactly 10 digits";
    }

    // Food Type validation
    if (!inputs.foodType) {
      formErrors.foodType = "Please select a food type";
    }

    // Quantity validation
    const quantityRegex = /^[1-9]\d*$/; // Positive integers only
    if (!inputs.quantity.trim()) {
      formErrors.quantity = "Quantity is required";
    } else if (!quantityRegex.test(inputs.quantity)) {
      formErrors.quantity = "Quantity must be a positive number";
    } else if (parseInt(inputs.quantity) <= 0) {
      formErrors.quantity = "Quantity must be greater than zero";
    }

    // Additional Notes validation
    if (!inputs.additionalNotes.trim()) {
      formErrors.additionalNotes = "Additional Notes are required";
    } else if (inputs.additionalNotes.length > 500) {
      formErrors.additionalNotes = "Notes cannot exceed 500 characters";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for contact number
    if (name === 'contactNumber') {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setInputs(prevState => ({
        ...prevState,
        [name]: digitsOnly
      }));
    } 
    // Special handling for quantity
    else if (name === 'quantity') {
      // Remove any non-digit characters except for the first minus sign
      const cleanValue = value.replace(/[^\d-]/g, '');
      // If there's a minus sign, show error
      if (cleanValue.includes('-')) {
        setErrors(prevErrors => ({
          ...prevErrors,
          quantity: "Quantity cannot be negative"
        }));
        return;
      }
      setInputs(prevState => ({
        ...prevState,
        [name]: cleanValue
      }));
    }
    else {
      setInputs(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sendRequest().then(() => navigate('/rl/display-requests'));
    }
  }

  const sendRequest = async () => {
    return await axios.post('http://localhost:8090/requests', {
      location: String(inputs.location),
      contactNumber: String(inputs.contactNumber),
      foodType: String(inputs.foodType),
      quantity: String(inputs.quantity),
      additionalNotes: String(inputs.additionalNotes)
    }).then(res => res.data);
  }

  return (
    <div className="donation-request-background">
    <div className="donation-request-container">
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 className="donation-request-title">Request for Surplus Food</h1>
      <p className="donation-request-description">
      "If your organization needs food support, fill out this form to request surplus food from our redistribution program."
      </p>
      <form onSubmit={handleSubmit} className="donation-request-form">
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-location">Location</label>
          <input 
            type="text" 
            id="donation-location"
            name="location" 
            onChange={handleChange} 
            value={inputs.location} 
            className={`donation-request-input ${errors.location ? 'error' : ''}`}
          />
          {errors.location && (
            <span className="error-message">{errors.location}</span>
          )}
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-contact">Contact Number</label>
          <input 
            type="text" 
            id="donation-contact"
            name="contactNumber" 
            onChange={handleChange} 
            value={inputs.contactNumber} 
            className={`donation-request-input ${errors.contactNumber ? 'error' : ''}`}
          />
          {errors.contactNumber && (
            <span className="error-message">{errors.contactNumber}</span>
          )}
        </div>
        
        <div className="donation-request-field-group donation-request-select-container">
          <label className="donation-request-label" htmlFor="donation-food-type">Food Type</label>
          <select 
            id="donation-food-type"
            name="foodType" 
            onChange={handleChange} 
            value={inputs.foodType} 
            className={`donation-request-select ${errors.foodType ? 'error' : ''}`}
          >
            <option value="">-- Select Type --</option>
            <option value="Milk Rice">Milk Rice</option>
            <option value="White Rice">White Rice</option>
            <option value="Biriyani">Biriyani</option>
            <option value="Yellow Rice">Yellow Rice</option>
            <option value="Noodles">Noodles</option>
            <option value="Koththu">Koththu</option>
          </select>
          {errors.foodType && (
            <span className="error-message">{errors.foodType}</span>
          )}
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-quantity">Food Quantity</label>
          <input 
            type="text" 
            id="donation-quantity"
            name="quantity" 
            onChange={handleChange} 
            value={inputs.quantity} 
            className={`donation-request-input ${errors.quantity ? 'error' : ''}`}
          />
          {errors.quantity && (
            <span className="error-message">{errors.quantity}</span>
          )}
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-notes">Additional Notes</label>
          <textarea 
            id="donation-notes"
            name="additionalNotes" 
            onChange={handleChange} 
            value={inputs.additionalNotes} 
            className={`donation-request-textarea ${errors.additionalNotes ? 'error' : ''}`}
          ></textarea>
          {errors.additionalNotes && (
            <span className="error-message">{errors.additionalNotes}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="donation-request-submit-btn"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  )
}

export default AddRequests;