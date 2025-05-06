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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            await sendRequest();
            setSuccess('Feedback submitted successfully!');
            // Clear form after successful submission
            setInputs({
                message: '',
                rating: '',
            });
            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigate('/feedback');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
        }
    };

    const sendRequest = async () => {
        try {
            const response = await axios.post('http://localhost:8090/feedbacks', {
                message: String(inputs.message),
                rating: Number(inputs.rating),
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    };

    return (
        <div className="feedback-container">
            <h2>Feedback Form</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="feedback-form">
                <label htmlFor="message">Message:</label>
                <textarea 
                    name="message" 
                    id="message" 
                    value={inputs.message} 
                    onChange={handleChange} 
                    required
                    placeholder="Please enter your feedback message..."
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
                            <label 
                                htmlFor={`star${value}`}
                                onMouseEnter={() => setHoveredRating(value)}
                                onMouseLeave={() => setHoveredRating(0)}
                            >
                                {value}
                            </label>
                        </React.Fragment>
                    ))}
                </div>
                <div className="rating-text">
                    {hoveredRating > 0 ? `Rating: ${hoveredRating} stars` : inputs.rating ? `Selected: ${inputs.rating} stars` : 'Select a rating'}
                </div>

                <button type="submit" className="submit-button">Submit Feedback</button>
            </form>
        </div>
    );
}

export default FeedbackForm;