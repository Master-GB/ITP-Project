import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/auth/login', formData);
            const { token, user } = response.data;
            
            // Store token and user info in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect based on role
            switch (user.role) {
                case 'Donor':
                    navigate("/dl/dashboard");
                    break;
                case 'Volunteer Coordinator':
                    navigate('/vcl/dashboard');
                    break;
                case 'Volunteer Packing Staff':
                    navigate('/vpsl/volunteerpstaffdashboard');
                    break;
                case 'Volunteer Delivery Staff':
                    navigate('/vdsl/volunteerdstaffdashboard');
                    break;
                case 'Admin':
                    navigate('/al/admindashboard');
                    break;
                case 'Operating Manager':
                    navigate('/opl/dashboard');
                    break;
                case 'PartnerShip':
                    navigate('/rl/dashboard');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="imalshacompnant-login-bg">
            <div className="imalshacompnant-login-box">
                <h2 className="imalshacompnant-login-title">Login</h2>
                {error && <div className="imalshacompnant-login-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="imalshacompnant-login-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="imalshacompnant-login-input"
                            required
                        />
                        <span className="imalshacompnant-login-icon">
                            <i className="fa fa-user"></i>
                        </span>
                    </div>
                    <div className="imalshacompnant-login-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="imalshacompnant-login-input"
                            required
                        />
                        <span className="imalshacompnant-login-icon">
                            <i className="fa fa-lock"></i>
                        </span>
                    </div>
                    <div className="imalshacompnant-login-options">
                        <label className="imalshacompnant-login-remember-label">
                            <input type="checkbox" className="imalshacompnant-login-checkbox" />
                            Remember Me
                        </label>
                        <a href="/forgot-password" className="imalshacompnant-login-forgot">Forgot Password?</a>
                    </div>
                    <button type="submit" className="imalshacompnant-login-btn">Login</button>
                </form>
                <p className="imalshacompnant-login-register">
                    Don't have an account? <Link to="/adduser">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;