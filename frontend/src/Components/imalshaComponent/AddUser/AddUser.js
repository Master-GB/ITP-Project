import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './AddUser.css';

function AddUser() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        contactNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validateInputs = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(inputs.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!passwordRegex.test(inputs.password)) {
            newErrors.password = 'Password must be at least 8 characters long, contain uppercase, lowercase, and a number';
        }

        if (!phoneRegex.test(inputs.contactNumber)) {
            newErrors.contactNumber = 'Phone number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateInputs()) {
            sendRequest().then(() => history('/login'));
        }
    };

    const sendRequest = async () => {
        await axios.post('http://localhost:8090/users', {
            name: String(inputs.name),
            email: String(inputs.email),
            password: String(inputs.password),
            role: String(inputs.role),
            contactNumber: Number(inputs.contactNumber),
            address: String(inputs.address),
        }).then(res => res.data);
    };

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
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input className="form-input" type="password" name="password" value={inputs.password} onChange={handleChange} required />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Role:</label>
                    <select className="form-select" name="role" value={inputs.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="Donor">Donor</option>
                        <option value="Recipient">Delivary Volunteer</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Admin">PartnerShip</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Contact Number:</label>
                    <input className="form-input" type="number" name="contactNumber" value={inputs.contactNumber} onChange={handleChange} required />
                    {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
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
