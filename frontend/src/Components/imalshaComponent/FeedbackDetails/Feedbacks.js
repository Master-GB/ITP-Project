import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigationbar from '../unavbar/Navigationbar';
import './feedback.css';

const FEEDBACK_URL = 'http://localhost:8090/feedbacks';
const USER_URL = 'http://localhost:8090/users';

// Function to fetch all feedbacks
const fetchFeedbacks = async () => {
    const res = await axios.get(FEEDBACK_URL);
    return res.data.feedbacks;
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
    const [users, setUsers] = useState({}); // Store user details mapped by userId

    useEffect(() => {
        // Fetch feedbacks
        fetchFeedbacks().then((data) => {
            setFeedbacks(data);

            // Fetch user details for each feedback
            const userIds = [...new Set(data.map(feedback => feedback.userId))]; // Unique user IDs
            userIds.forEach(userId => {
                if (userId && !users[userId]) { // Fetch only if not already stored
                    axios.get(`${USER_URL}/${userId}`)
                        .then((res) => {
                            setUsers(prevUsers => ({ ...prevUsers, [userId]: res.data }));
                        })
                        .catch((error) => {
                            console.error(`Error fetching user ${userId}:`, error);
                        });
                }
            });
        });
    }, []);

    return (
        <div>
            <Navigationbar />
            <h1 className="feedback-title-main">User Feedbacks</h1>
            <div className="feedbacks-container">
                {feedbacks && feedbacks.map((feedback, i) => {
                    const user = users[feedback.userId]; // Get user details if available

                    return (
                        <div key={i} className="feedback-card">
                            <p className="feedback-content">{feedback.message}</p>
                            <StarRating rating={feedback.rating} />

                            {user ? (
                                <div className="user-info">
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>
                            ) : (
                                <p>Loading user details...</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Feedbacks;
