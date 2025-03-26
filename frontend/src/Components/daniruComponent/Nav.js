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
    <div className="nav-sidebar">
      <div className="nav-title">VolunteerHub</div>

      <div className="nav-menu">
        <Link to="/dashboard" className="nav-item">
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>

        <Link to="/volunteers" className="nav-item">
          <FaUsers className="nav-icon" />
          <span>Volunteers</span>
        </Link>

        {/* Tasks with dropdown */}
        <div className={`nav-dropdown ${isTaskOpen ? "active" : ""}`}>
          <div className="nav-item" onClick={toggleTaskMenu}>
            <FaList className="nav-icon" />
            <span>Task Management</span>
            {isTaskOpen ? <FaChevronUp className="chevron-icon" /> : <FaChevronDown className="chevron-icon" />}
          </div>

          {/* Dropdown menu only shows when clicked */}
          {isTaskOpen && (
            <div className="dropdown-menu">
              <Link to="/createtask" className="dropdown-item">
                <FaPlus className="nav-icon" />
                <span>Create Task</span>
              </Link>
              <Link to="/viewtasks" className="dropdown-item">
                <FaList className="nav-icon" />
                <span>View Tasks</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/tracking" className="nav-item">
          <FaMapMarkedAlt className="nav-icon" />
          <span>Tracking</span>
        </Link>

        <Link to="/reports" className="nav-item">
          <FaChartLine className="nav-icon" />
          <span>Reports</span>
        </Link>
      </div>
    </div>
  );
}

export default StandardNav;
