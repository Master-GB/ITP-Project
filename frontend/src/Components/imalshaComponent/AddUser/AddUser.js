import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddUser.css';

function AddUser() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        contactNumber: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Limit contactNumber to 10 digits
        if (name === 'contactNumber') {
            // Only allow numbers and max 10 digits
            const cleaned = value.replace(/\D/g, '').slice(0, 10);
            setInputs((prevState) => ({
                ...prevState,
                [name]: cleaned,
            }));
            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
            return;
        }
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        // Clear error when user starts typing again
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateInputs = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        // Validate name
        if (inputs.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Validate email
        if (!emailRegex.test(inputs.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Validate password
        if (!passwordRegex.test(inputs.password)) {
            newErrors.password = 'Invalid Password';
        }

        // Validate role
        if (!inputs.role) {
            newErrors.role = 'Please select a role';
        }

        // Validate phone
        if (!phoneRegex.test(inputs.contactNumber)) {
            newErrors.contactNumber = 'Phone number must be exactly 10 digits';
        }

        // Validate address
        if (inputs.address.trim().length < 5) {
            newErrors.address = 'Please enter a valid address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        
        if (validateInputs()) {
            setIsSubmitting(true);
            
            try {
                await sendRequest();
                setSuccess('Registration successful!');
                
                // Clear form
                setInputs({
                    name: '',
                    email: '',
                    password: '',
                    role: '',
                    contactNumber: '',
                    address: '',
                });
                
                // Navigate based on role
                if (inputs.role === 'Volunteer Delivery Staff' || inputs.role === 'Volunteer Packing Staff') {
                    navigate('/verificationcode');
                } else {
                    navigate('/login');
                }
                
            } catch (error) {
                setErrors({
                    submit: error.response?.data?.message || 'Registration failed. Please try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const sendRequest = async () => {
        return await axios.post('http://localhost:8090/users', {
            name: String(inputs.name),
            email: String(inputs.email),
            password: String(inputs.password),
            role: String(inputs.role),
            contactNumber: Number(inputs.contactNumber),
            address: String(inputs.address),
        });
    };

    return (
        <div className="imalshacompnant-adduser-bg">
            <div className="imalshacompnant-adduser-card">
                <h2 className="imalshacompnant-adduser-title">Create Your Account</h2>
                
                {success && <div className="imalshacompnant-adduser-success">{success}</div>}
                {errors.submit && <div className="imalshacompnant-adduser-error">{errors.submit}</div>}
                
                <form className="imalshacompnant-adduser-form" onSubmit={handleSubmit}>
                    <div className="imalshacompnant-adduser-row">
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Full Name</label>
                            <input 
                                className={`imalshacompnant-adduser-input ${errors.name ? 'imalshacompnant-adduser-input-error' : ''}`}
                                type="text" 
                                name="name" 
                                value={inputs.name} 
                                onChange={handleChange} 
                                placeholder="Enter your full name"
                                required 
                            />
                            {errors.name && <span className="imalshacompnant-adduser-error-text">{errors.name}</span>}
                        </div>
                        
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Email Address</label>
                            <input 
                                className={`imalshacompnant-adduser-input ${errors.email ? 'imalshacompnant-adduser-input-error' : ''}`}
                                type="email" 
                                name="email" 
                                value={inputs.email} 
                                onChange={handleChange} 
                                placeholder="your.email@example.com"
                                required 
                            />
                            {errors.email && <span className="imalshacompnant-adduser-error-text">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="imalshacompnant-adduser-row">
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Password</label>
                            <input 
                                className={`imalshacompnant-adduser-input ${errors.password ? 'imalshacompnant-adduser-input-error' : ''}`}
                                type="password" 
                                name="password" 
                                value={inputs.password} 
                                onChange={handleChange} 
                                placeholder="Create a secure password"
                                required 
                            />
                            {errors.password && <span className="imalshacompnant-adduser-error-text">{errors.password}</span>}
                        </div>
                        
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Role</label>
                            <select 
                                className={`imalshacompnant-adduser-select ${errors.role ? 'imalshacompnant-adduser-input-error' : ''}`}
                                name="role" 
                                value={inputs.role} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Your Role</option>
                                <option value="Donor">Donor</option>
                                <option value="Volunteer Packing Staff">Volunteer Packing Staff</option>
                                <option value="Volunteer Delivery Staff">Volunteer Delivery Staff</option>
                                <option value="Operating Manager">Operating Manager</option>
                                <option value="PartnerShip">PartnerShip</option>
                            </select>
                            {errors.role && <span className="imalshacompnant-adduser-error-text">{errors.role}</span>}
                        </div>
                    </div>

                    <div className="imalshacompnant-adduser-row">
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Contact Number</label>
                            <input 
                                className={`imalshacompnant-adduser-input ${errors.contactNumber ? 'imalshacompnant-adduser-input-error' : ''}`}
                                type="tel" 
                                name="contactNumber" 
                                value={inputs.contactNumber} 
                                onChange={handleChange} 
                                placeholder="07xxxxxxxx"
                                required 
                            />
                            {errors.contactNumber && <span className="imalshacompnant-adduser-error-text">{errors.contactNumber}</span>}
                        </div>
                        
                        <div className="imalshacompnant-adduser-group">
                            <label className="imalshacompnant-adduser-label">Address</label>
                            <textarea 
                                className={`imalshacompnant-adduser-textarea ${errors.address ? 'imalshacompnant-adduser-input-error' : ''}`}
                                name="address" 
                                value={inputs.address} 
                                onChange={handleChange} 
                                placeholder="Your complete address"
                                required
                            ></textarea>
                            {errors.address && <span className="imalshacompnant-adduser-error-text">{errors.address}</span>}
                        </div>
                    </div>

                    <div className="imalshacompnant-adduser-actions">
                        <button 
                            className="imalshacompnant-adduser-button" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register Account'}
                        </button>
                        
                        <p className="imalshacompnant-adduser-login-link">
                            Already have an account? <a href="/login">Sign in</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUser;