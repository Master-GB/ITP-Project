import React from 'react';
import { Link } from 'react-router-dom';
import './Feedback.css';
import { useNavigate } from 'react-router-dom';

function Feedback(props) {
    const { feedback } = props;
    if (!feedback) {
        return <div className="feedback display empty">No feedback data available</div>;
    }
    const { _id, message, rating } = feedback;

    return (
        <tr>
            <th>ID: {_id}</th>
            <th>Message: {message}</th>
            <th>Rating: {rating}</th>
            <td>
                <Link to={`/FeedbackDetails/${_id}`}>
                    Update
                </Link>
                
                <button>Delete</button>
            </td>
        </tr>
    );
}

export default Feedback;

