import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaList,
  FaPlus,
  FaMapMarkedAlt,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "./Nav.css";

function StandardNav() {
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const toggleTaskMenu = () => {
    setIsTaskOpen(!isTaskOpen);
  };

  return (
    <div className="task-nav-sidebar">
      <div className="task-nav-title">VolunteerHub</div>

      <div className="task-nav-menu">
        <Link to="/dashboard" className="task-nav-item">
          <FaHome className="task-nav-icon" />
          <span>Dashboard</span>
        </Link>

        <Link to="/volunteers" className="task-nav-item">
          <FaUsers className="task-nav-icon" />
          <span>Volunteers</span>
        </Link>

        {/* Tasks with dropdown */}
        <div className={`task-nav-dropdown ${isTaskOpen ? "active" : ""}`}>
          <div className="task-nav-item" onClick={toggleTaskMenu}>
            <FaList className="task-nav-icon" />
            <span>Task Management</span>
            {isTaskOpen ? <FaChevronUp className="task-chevron-icon" /> : <FaChevronDown className="task-chevron-icon" />}
          </div>

          {/* Dropdown menu only shows when clicked */}
          {isTaskOpen && (
            <div className="task-dropdown-menu">
              <Link to="/createtask" className="task-dropdown-item">
                <FaPlus className="task-nav-icon" />
                <span>Create Task</span>
              </Link>
              <Link to="/viewtasks" className="task-dropdown-item">
                <FaList className="task-nav-icon" />
                <span>View Tasks</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/tracking" className="task-nav-item">
          <FaMapMarkedAlt className="task-nav-icon" />
          <span>Tracking</span>
        </Link>

        <Link to="/reports" className="task-nav-item">
          <FaChartLine className="task-nav-icon" />
          <span>Reports</span>
        </Link>
      </div>
    </div>
  );
}

export default StandardNav;
