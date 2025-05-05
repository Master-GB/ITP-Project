import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./updateUser.css";

function UpdateUser() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/users/${id}`);
                setInputs(response.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        try {
            await axios.put(`http://localhost:8090/users/${id}`, {
                name: String(inputs.name),
                email: String(inputs.email),
                password: String(inputs.password),
                role: String(inputs.role),
                contactNumber: Number(inputs.contactNumber),
                address: String(inputs.address),
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => navigate('/userdetails'));
    };

    return (
        <div className="update-form-container">
            <h1 className="form-header">Update User</h1>
            <form className="update-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input
                        className="form-input"
                        type="text"
                        id="name"
                        name="name"
                        value={inputs.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        id="email"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        id="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="role">Role</label>
                    <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={inputs.role || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="Donor">Donor</option>
                        <option value="Recipient">Recipient</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="contactNumber">Contact Number</label>
                    <input
                        className="form-input"
                        type="number"
                        id="contactNumber"
                        name="contactNumber"
                        value={inputs.contactNumber || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="address">Address</label>
                    <textarea
                        className="form-input form-textarea"
                        id="address"
                        name="address"
                        value={inputs.address || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="submit-button" type="submit">
                    Update User
                </button>
            </form>
        </div>
    );
}

export default UpdateUser;