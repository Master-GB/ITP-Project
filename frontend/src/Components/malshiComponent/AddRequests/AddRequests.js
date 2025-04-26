import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRequests.css';

function AddRequests() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    organizationName: "",
    location: "",
    contactNumber: "",
    foodType: "",
    quantity: "",
    additionalNotes: "",
    status: "pending"  // Default status
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => navigate('/display-requests'));
  }

  const sendRequest = async () => {
    await axios.post('http://localhost:8090/requests', {
      organizationName: String(inputs.organizationName),
      location: String(inputs.location),
      contactNumber: String(inputs.contactNumber),
      foodType: String(inputs.foodType),
      quantity: String(inputs.quantity),
      additionalNotes: String(inputs.additionalNotes)
    }).then(res => res.data);
  }

  return (
    <div className="donation-request-container">
      <h1 className="donation-request-title">Add Request</h1>
      <form onSubmit={handleSubmit} className="donation-request-form">
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-org-name">Organization Name</label>
          <input 
            type="text" 
            id="donation-org-name"
            name="organizationName" 
            onChange={handleChange} 
            value={inputs.organizationName} 
            required 
            className="donation-request-input"
          />
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-location">Location</label>
          <input 
            type="text" 
            id="donation-location"
            name="location" 
            onChange={handleChange} 
            value={inputs.location} 
            required 
            className="donation-request-input"
          />
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-contact">Contact Number</label>
          <input 
            type="text" 
            id="donation-contact"
            name="contactNumber" 
            onChange={handleChange} 
            value={inputs.contactNumber} 
            required 
            className="donation-request-input"
          />
        </div>
        
        <div className="donation-request-field-group donation-request-select-container">
          <label className="donation-request-label" htmlFor="donation-food-type">Food Type</label>
          <select 
            id="donation-food-type"
            name="foodType" 
            onChange={handleChange} 
            value={inputs.foodType} 
            required
            className="donation-request-select"
          >
            <option value="">-- Select Type --</option>
            <option value="Type01">Type01</option>
            <option value="Type02">Type02</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-quantity">Food Quantity</label>
          <input 
            type="text" 
            id="donation-quantity"
            name="quantity" 
            onChange={handleChange} 
            value={inputs.quantity} 
            required 
            className="donation-request-input"
          />
        </div>
        
        <div className="donation-request-field-group">
          <label className="donation-request-label" htmlFor="donation-notes">Additional Notes</label>
          <textarea 
            id="donation-notes"
            name="additionalNotes" 
            onChange={handleChange} 
            value={inputs.additionalNotes} 
            required
            className="donation-request-textarea"
          ></textarea>
        </div>
        
        <button type="submit" className="donation-request-submit-btn">Submit</button>
        
      </form>
    </div>
  )
}

export default AddRequests;