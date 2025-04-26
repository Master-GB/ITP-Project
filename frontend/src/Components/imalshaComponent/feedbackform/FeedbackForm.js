import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feedback.css';

function FeedbackForm() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        message: '',
        rating: '',
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        await sendRequest();
        navigate('/feedback');
    };

    const sendRequest = async () => {
        try {
            await axios.post('http://localhost:8090/feedbacks', {
                message: String(inputs.message),
                rating: Number(inputs.rating),
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div className="feedback-container">
            <h2>Feedback Form</h2>
            <form onSubmit={handleSubmit} className="feedback-form">
                <label htmlFor="message">Message:</label>
                <textarea 
                    name="message" 
                    id="message" 
                    value={inputs.message} 
                    onChange={handleChange} 
                    required
                ></textarea>

                <label>Rating:</label>
                <div className="rating">
                    {[5, 4, 3, 2, 1].map((value) => (
                        <React.Fragment key={value}>
                            <input
                                type="radio"
                                name="rating"
                                id={`star${value}`}
                                value={value}
                                checked={inputs.rating === String(value)}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor={`star${value}`}></label>
                        </React.Fragment>
                    ))}
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default FeedbackForm;