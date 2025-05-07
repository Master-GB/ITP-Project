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
        <div className="imalshacomponat">
            <h1 className="imalshacomponat-form-header">Update User</h1>
            <form className="imalshacomponat-update-form" onSubmit={handleSubmit}>
                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="name">Name</label>
                    <input
                        className="imalshacomponat-form-input"
                        type="text"
                        id="name"
                        name="name"
                        value={inputs.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="email">Email</label>
                    <input
                        className="imalshacomponat-form-input"
                        type="email"
                        id="email"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="password">Password</label>
                    <input
                        className="imalshacomponat-form-input"
                        type="password"
                        id="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="role">Role</label>
                    <select
                        className="imalshacomponat-form-select"
                        id="role"
                        name="role"
                        value={inputs.role || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="Donor">Donor</option>
                        <option value="PartnerShip">PartnerShip</option>
                        <option value="Volunteer Packing Staff">Volunteer Packing Staff</option>
                        <option value="Volunteer Delivery Staff">Volunteer Delivery Staff</option>
                    </select>
                </div>

                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="contactNumber">Contact Number</label>
                    <input
                        className="imalshacomponat-form-input"
                        type="number"
                        id="contactNumber"
                        name="contactNumber"
                        value={inputs.contactNumber || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="imalshacomponat-form-group">
                    <label className="imalshacomponat-form-label" htmlFor="address">Address</label>
                    <textarea
                        className="imalshacomponat-form-input imalshacomponat-form-textarea"
                        id="address"
                        name="address"
                        value={inputs.address || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="imalshacomponat-submit-button" type="submit">
                    Update User
                </button>
            </form>
        </div>
    );
}

export default UpdateUser;