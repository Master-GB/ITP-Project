import React, { useState, useEffect } from 'react';
import { FaRegCalendarAlt, FaTasks, FaUser, FaArrowUp, FaArrowDown, FaMinus, FaEdit, FaTrash, FaRegClock, FaCopy, FaExclamationCircle } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import "./ViewTasks.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  if (diffDays === 0) return "Due today";
  return `Ended ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
}

function ViewTasks({ viewtasks }) {
  const {
    _id,
    taskName,
    taskDescription,
    location,
    startDateTime,
    endDateTime,
    priority = "Low",
    assignedVolunteer,
    status = "Pending"
  } = viewtasks;

  const history = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const deleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      await axios.delete(`http://localhost:8090/tasks/${_id}`);
      history(0); // reload page to refresh list
    }
  };

  const isOverdue = status.toLowerCase() !== "completed" && new Date(endDateTime) < new Date();

  const handleCopy = () => {
    navigator.clipboard.writeText(_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`task-card${fadeIn ? " fade-in" : ""}${isOverdue ? " overdue" : ""}`}>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px'}}>
        <span className={`task-status ${status && typeof status === "string" ? status.toLowerCase() : "pending"}`}>
          {status || "Pending"}
        </span>
        <span className={`task-priority ${priority && typeof priority === "string" ? priority.toLowerCase() : "low"}`}>
          {priority === "High" && <FaArrowUp style={{marginRight:4, color:'#e74c3c'}}/>}
          {priority === "Medium" && <FaMinus style={{marginRight:4, color:'#f39c12'}}/>}
          {priority === "Low" && <FaArrowDown style={{marginRight:4, color:'#3498db'}}/>}
          {priority || "Low"}
        </span>
        {isOverdue && <span className="overdue-badge" title="This task is overdue!"><FaExclamationCircle style={{marginRight:4}}/>Overdue</span>}
      </div>
      <h3 className="task-name">
        <FaTasks style={{color:'#1abc9c', marginRight:8, verticalAlign:'middle'}}/>{taskName}
        <span style={{fontSize:'0.9rem', color:'#bbb', marginLeft:8, display:'inline-flex', alignItems:'center'}}>
          ({_id})
          <FaCopy
            style={{marginLeft:6, cursor:'pointer'}}
            title={copied ? "Copied!" : "Copy Task ID"}
            onClick={handleCopy}
          />
        </span>
      </h3>
      <p className="task-description">{taskDescription}</p>
      <div className="assigned-volunteer">
        <FaUser style={{marginRight:6, color:'#1abc9c', verticalAlign:'middle'}}/>
        <span>Assigned Volunteer: {assignedVolunteer}</span>
      </div>
      <div className="task-details">
        <FaRegCalendarAlt />
        <span>{new Date(startDateTime).toLocaleString()}</span>
        <span> - </span>
        <span>{new Date(endDateTime).toLocaleString()}</span>
        <FaRegClock style={{marginLeft:8}}/>
        <span style={{fontStyle:'italic'}}>{getRelativeTime(endDateTime)}</span>
        <IoLocationOutline />
        <span>{location}</span>
      </div>
      <div className="task-buttons">
        <Link to={`/vcl/task/${_id}`}>
          <button className="update-btn" title="Edit this task"><FaEdit style={{marginRight:6, verticalAlign:'middle'}}/>Update</button>
        </Link>
        <button className="delete-btn" onClick={deleteHandler} title="Delete this task"><FaTrash style={{marginRight:6, verticalAlign:'middle'}}/>Delete</button>
      </div>
    </div>
  );
}

export default ViewTasks;