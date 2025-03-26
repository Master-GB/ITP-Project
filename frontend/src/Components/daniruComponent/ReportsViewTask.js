import React from 'react';
import { FiMoreVertical } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import "./ViewTasks.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewTasks(props) {
    const { _id, taskName, taskDescription, location, startDateTime, endDateTime, priority = "Low", assignedVolunteer, status = "Pending" } = props.viewtasks;
    const history = useNavigate();

    const deleteHandler = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        
        if (confirmDelete) {
            await axios.delete(`http://localhost:8090/tasks/${_id}`)
            .then(res => res.data)
            .then(() => history("/viewtasks"));
        }
    };

    return (
        <div className="task-card">
            
            {/* Status with safe check for undefined */}
            <p className={`task-status ${status && typeof status === "string" ? status.toLowerCase() : "pending"}`}>
                {status || "Pending"}
            </p>
            
            {/* Priority with safe check for undefined */}
            <p className={`task-priority ${priority && typeof priority === "string" ? priority.toLowerCase() : "low"}`}>
                {priority || "Low"}
            </p>

            <h3 className="task-name">{taskName} ({_id})</h3>
            <p className="task-description">{taskDescription}</p>
            <div className="assigned-volunteer">
                <span>Assigned Volunteer: {assignedVolunteer}</span>
            </div>
            <div className="task-details">
                <FaRegCalendarAlt />
                <span>{new Date(startDateTime).toLocaleString()}</span>
                <span> - </span>    
                <span>{new Date(endDateTime).toLocaleString()}</span>
                <IoLocationOutline />
                <span>{location}</span>
            </div>
            <div className="task-buttons">
                <Link to={`/task/${_id}`}>
                    <button className="update-btn">Update</button>
                </Link>
                <button className="delete-btn" onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    );
}

export default ViewTasks;
