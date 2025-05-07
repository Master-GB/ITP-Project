import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigationbar from '../anavbar/aNavigationBar';
import './feedback.css';

const URL = 'http://localhost:8090/feedbacks';

const fetchHandler = async () => {
    try {
        const res = await axios.get(URL);
        return res.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        return { feedbacks: [] };
    }
};

// Function to generate star icons based on rating
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? "#f5c518" : "#ccc" }}>
                ★
            </span>
        );
    }
    return <div className="feedback-rating">{stars}</div>;
};

function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFeedbacks = async () => {
            try {
                const data = await fetchHandler();
                if (data && data.feedbacks) {
                    setFeedbacks(data.feedbacks);
                } else {
                    setFeedbacks([]);
                }
            } catch (err) {
                setError('Failed to load feedbacks');
                console.error('Error loading feedbacks:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFeedbacks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await axios.delete(`http://localhost:8090/feedbacks/${id}`);
            setFeedbacks(prev => prev.filter(fb => fb._id !== id));
        } catch (err) {
            alert('Failed to delete feedback');
            console.error('Error deleting feedback:', err);
        }
    };

    if (loading) {
        return (
            <div>
                <Navigationbar />
                <div className="loading-message">Loading feedbacks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navigationbar />
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <Navigationbar />
            <br/>
            <h1 className="feedback-title-main">User Feedbacks</h1>
            <br/>
            <br/>
            <div className="feedbacks-container">
                {feedbacks.length === 0 ? (
                    <div className="no-feedbacks">No feedbacks available</div>
                ) : (
                    feedbacks.map((feedback, i) => (
                        <div key={feedback._id || i} className="feedback-card">
                            <p className="feedback-content">{feedback.message}</p>
                            <StarRating rating={feedback.rating} />
                            <button className="delete-btn" style={{marginTop: '10px'}} onClick={() => handleDelete(feedback._id)}>Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Feedbacks;

