import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigationbar from '../unavbar/Navigationbar';
import './feedback.css';

const URL = 'http://localhost:8090/feedbacks';

const fetchHandler = async () => {
    const res = await axios.get(URL);
    return res.data;
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

    useEffect(() => {
        fetchHandler().then((data) => {
            setFeedbacks(data.feedbacks);
        });
    }, []);

    return (
        <div>
            <Navigationbar />
            <br/>
            <h1 className="feedback-title-main">User Feedbacks</h1>
            <br/>
            <br/>
            <div className="feedbacks-container">
                {feedbacks && feedbacks.map((feedback, i) => (
                    <div key={i} className="feedback-card">
                        <p className="feedback-content">{feedback.message}</p>
                        <StarRating rating={feedback.rating} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feedbacks;

