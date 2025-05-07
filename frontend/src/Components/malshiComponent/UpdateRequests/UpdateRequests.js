import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateRequests.css';

function UpdateRequests() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:8090/requests/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.requests));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8090/requests/${id}`, {
        organizationName: String(inputs.organizationName),
        location: String(inputs.location),
        contactNumber: String(inputs.contactNumber),
        foodType: String(inputs.foodType),
        quantity: String(inputs.quantity),
        additionalNotes: String(inputs.additionalNotes),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate('/display-requests'));
  };

  const handleCancel = () => {
    navigate('/display-requests');
  };

  return (
    <div className="FReq-update-form-container">
      <h1 className="FReq-update-form-title">Update Food Request</h1>
      <form onSubmit={handleSubmit} className="update-form">
        <div className="FReq-update-form-field">
          <label className="FReq-update-form-label" htmlFor="org-name">Organization Name</label>
          <input 
            type="text" 
            id="org-name"
            name="organizationName" 
            onChange={handleChange} 
            value={inputs.organizationName || ''} 
            required 
            className="FReq-update-form-input"
          />
        </div>
        
        <div className="FReq-update-form-field">
          <label className="FReq-update-form-label" htmlFor="location">Location</label>
          <input 
            type="text" 
            id="location"
            name="location" 
            onChange={handleChange} 
            value={inputs.location || ''} 
            required 
            className="FReq-update-form-input"
          />
        </div>
        
        <div className="FReq-update-form-field">
          <label className="FReq-update-form-label" htmlFor="contact">Contact Number</label>
          <input 
            type="text" 
            id="contact"
            name="contactNumber" 
            onChange={handleChange} 
            value={inputs.contactNumber || ''} 
            required 
            className="FReq-update-form-input"
          />
        </div>
        
        <div className="FReq-update-form-field update-form-select-wrapper">
          <label className="FReq-update-form-label" htmlFor="food-type">Food Type</label>
          <select 
            id="food-type"
            name="foodType" 
            onChange={handleChange} 
            value={inputs.foodType || ''} 
            required
            className="FReq-update-form-select"
          >
            <option value="">-- Select Type --</option>
            <option value="Milk Rice">Milk Rice</option>
            <option value="White Rice">White Rice</option>
            <option value="Biriyani">Biriyani</option>
            <option value="Yellow Rice">Yellow Rice</option>
            <option value="Noodles">Noodles</option>
            <option value="Koththu">Koththu</option>
          </select>
        </div>
        
        <div className="FReq-update-form-field">
          <label className="FReq-update-form-label" htmlFor="quantity">Quantity</label>
          <input 
            type="text" 
            id="quantity"
            name="quantity" 
            onChange={handleChange} 
            value={inputs.quantity || ''} 
            required 
            className="FReq-update-form-input"
          />
        </div>
        
        <div className="FReq-update-form-field update-form-field-full">
          <label className="FReq-update-form-label" htmlFor="notes">Additional Notes</label>
          <textarea 
            id="notes"
            name="additionalNotes" 
            onChange={handleChange} 
            value={inputs.additionalNotes || ''} 
            className="FReq-update-form-textarea"
          ></textarea>
        </div>
        
        <div className="FReq-update-form-buttons">
          <button type="button" onClick={handleCancel} className="FReq-update-form-button">Cancel</button>
          <button type="submit" className="FReq-update-form-button update-form-button-primary">Update</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateRequests;