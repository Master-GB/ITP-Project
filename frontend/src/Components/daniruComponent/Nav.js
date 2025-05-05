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
    <div className="task-nav-sidebar-fixed">
      <div className="task-nav-logo-title-col">
        <img src={process.env.PUBLIC_URL + '/Resources/daniruRes/logo.png'} alt="Platform Logo" className="task-nav-logo" />
        <span className="task-nav-title">VolunteerHub</span>
      </div>
      <div className="task-nav-menu-scroll">
        <div className="task-nav-menu">
          <Link to="/dashboard" className="task-nav-item">
            <FaHome className="task-nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/volunteers" className="task-nav-item">
            <FaUsers className="task-nav-icon" />
            <span>Volunteers</span>
          </Link>
          <div className={`task-nav-dropdown ${isTaskOpen ? "active" : ""}`}>
            <div className="task-nav-item" onClick={toggleTaskMenu}>
              <FaList className="task-nav-icon" />
              <span>Task Management</span>
              {isTaskOpen ? <FaChevronUp className="task-chevron-icon" /> : <FaChevronDown className="task-chevron-icon" />}
            </div>
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
      <div className="task-nav-profile-section">
        <img src={process.env.PUBLIC_URL + '/Resources/daniruRes/profile.png'} alt="Profile Avatar" className="task-nav-profile-avatar" />
        <div className="task-nav-profile-info">
          <div className="task-nav-profile-name">Daniru Dodangoda</div>
          <div className="task-nav-profile-role">Volunteer Coordinator</div>
        </div>
        <button className="task-nav-signout-btn">Sign Out</button>
      </div>
    </div>
  );
}

export default StandardNav;
