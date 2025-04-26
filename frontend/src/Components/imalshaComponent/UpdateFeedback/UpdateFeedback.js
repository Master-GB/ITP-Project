import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateFeedback() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        message: '',
        rating: '',
    });

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/feedbacks/${id}`);
                setInputs(response.data.feedback);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };
        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8090/feedbacks/${id}`, {
                message: inputs.message,
                rating: inputs.rating,
            });
            if (response.status === 200) {
                alert('Feedback updated successfully');
                navigate('/feedback');
            } else {
                alert('Failed to update feedback');
            }
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    return (
        <div>
            <h2>Update Feedback</h2>
            <form onSubmit={handleSubmit}>
                <label>Message:</label>
                <textarea
                    name="message"
                    value={inputs.message}
                    onChange={handleChange}
                    required
                ></textarea>

                <label>Rating:</label>
                <input
                    type="number"
                    name="rating"
                    value={inputs.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    required
                />
                
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateFeedback;