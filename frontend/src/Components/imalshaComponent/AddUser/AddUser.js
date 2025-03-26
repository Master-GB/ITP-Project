import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './AddUser.css';


function AddUser() {
    const history = useNavigate();
    const [inputs,setInputs]=useState({
        name:'',
        email:'',
        password:'',
        role:'',
        contactNumber:'',
        address:'',

        
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
      sendRequest().then(() =>history('/login')); 
    }
    const sendRequest = async()=>{
      await axios.post('http://localhost:8090/users',{
        name: String(inputs.name),
        email: String(inputs.email),
        password: String(inputs.password),
        role: String(inputs.role),
        contactNumber: Number(inputs.contactNumber),
        address: String(inputs.address),
      }).then(res => res.data);
    
    }

// In your AddUser.js file, update the return statement like this:

return (
  <div className="user-details-container">
    <h2 className="user-details-title">Register</h2>
    <form className="user-details-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Name:</label>
        <input className="form-input" type="text" name="name" value={inputs.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Email:</label>
        <input className="form-input" type="email" name="email" value={inputs.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Password:</label>
        <input className="form-input" type="password" name="password" value={inputs.password} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Role:</label>
        <select className="form-select" name="role" value={inputs.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Donor">Donor</option>
          <option value="Recipient">Recipient</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Contact Number:</label>
        <input className="form-input" type="number" name="contactNumber" value={inputs.contactNumber} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Address:</label>
        <textarea className="form-textarea" name="address" value={inputs.address} onChange={handleChange} required></textarea>
      </div>

      <button className="form-submit-btn" type="submit">Register</button>
    </form>
  </div>
);
}

export default AddUser;


