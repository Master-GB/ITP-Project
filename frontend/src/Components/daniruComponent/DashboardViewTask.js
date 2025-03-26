import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ViewTasks.css";

function ViewTasks(props) {
  const {
    _id,
    taskName,
    taskDescription,
    location,
    startDateTime,
    endDateTime,
    priority,
    assignedVolunteer,
    status,
  } = props.dashboardviewtask;

  return (
    <div>
      <div className="volunteercdashboard-task-card">
      <span className={`task-status ${status.toLowerCase()}`}>
          {status}
        </span>
        <span className={`task-priority ${priority && typeof priority === "string" ? priority.toLowerCase() : "low"}`}>
        {priority || "Low"}
        </span>
        <h4>{taskName}</h4>
        <p>{taskDescription}</p>
        <p>Assigned Volunteer: {assignedVolunteer}</p>
      </div>
    </div>
  );
}

export default ViewTasks;
