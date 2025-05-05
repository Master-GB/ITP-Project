import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';
import "./VolunteerTaskDisplay.css";
import { 
  FaSearch, 
  FaFilter, 
  FaTasks, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaCheck,
  FaTimes,
  FaInfoCircle
} from "react-icons/fa";

function VolunteerTaskDisplay({ onStatsCalculated }) {
  const { volunteerName } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/tasks");
      setTasks(response.data.tasks);
      setError(null);
    } catch (err) {
      setError("No tasks found or error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate task completion rate and on-time delivery rate
  useEffect(() => {
    if (tasks.length > 0) {
      const nonRejectedTasks = tasks.filter(
        (task) => task.status && task.status.toLowerCase() !== "rejected"
      );
      const completedTasks = nonRejectedTasks.filter(
        (task) => task.status && task.status.toLowerCase() === "completed"
      ).length;
      const totalTasks = nonRejectedTasks.length;
      const completionRate = totalTasks > 0
        ? ((completedTasks / totalTasks) * 100).toFixed(1)
        : "0.0";

      const onTimeCompleted = nonRejectedTasks.filter(task => {
        if (task.status && task.status.toLowerCase() === "completed") {
          const endDate = new Date(task.endDateTime);
          const scheduledEndDate = task.scheduledEndDateTime 
            ? new Date(task.scheduledEndDateTime) 
            : endDate;
          return endDate <= scheduledEndDate;
        }
        return false;
      }).length;
      
      const onTimeRate = completedTasks > 0 
        ? ((onTimeCompleted / completedTasks) * 100).toFixed(1) 
        : "0.0";

      // Only call onStatsCalculated if it exists and the stats have changed
      if (onStatsCalculated) {
        onStatsCalculated({
          completionRate,
          onTimeRate
        });
      }
    }
  }, [tasks]); // Remove onStatsCalculated from dependency array

  const handleStatusChange = async (taskId, newStatus, successMsg) => {
    const confirmMsg =
      newStatus === "Ongoing"
        ? "Are you sure you want to accept this task?"
        : newStatus === "Completed"
        ? "Are you sure you want to mark this task as completed?"
        : "Are you sure?";
    const confirmAction = window.confirm(confirmMsg);
    if (!confirmAction) return;

    try {
      const response = await axios.patch(
        `http://localhost:8090/tasks/${taskId}`,
        { status: newStatus }
      );
      if (response.data.task) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        setSuccessMessage(successMsg);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRejectTask = async (taskId) => {
    const confirmReject = window.confirm("Are you sure you want to reject this task?");
    if (!confirmReject) return;

    try {
      const response = await axios.patch(
        `http://localhost:8090/tasks/${taskId}`,
        { status: "Rejected" }
      );
      if (response.data.task) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: "Rejected" } : task
          )
        );
        setSuccessMessage("Task rejected successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="volunteer-tasks-container fade-in">
      <section className="search-filter-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Ongoing">🚀 Ongoing</option>
              <option value="Completed">✅ Completed</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
          <div className="filter-group">
            <FaInfoCircle className="filter-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Priority</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>
      </section>

      {successMessage && (
        <div className="success-message">
          <FaCheckCircle className="success-icon" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {loading && (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading your tasks...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="task-cards-container">
          {filteredTasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <div className="task-title-wrapper">
                  <h3 className="task-name">{task.taskName}</h3>
                  <span className={`priority-badge ${task.priority?.toLowerCase() || 'low'}`}>
                    {task.priority || 'Low'} Priority
                  </span>
                </div>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              
              <div className="task-content">
                <p className="task-description">
                  {task.taskDescription}
                </p>
                
                <div className="task-details">
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{task.location}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>Start: {new Date(task.startDateTime).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>End: {new Date(task.endDateTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                {task.status === "Pending" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() =>
                        handleStatusChange(
                          task._id,
                          "Ongoing",
                          "Task accepted successfully!"
                        )
                      }
                    >
                      <FaThumbsUp className="action-icon" />
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectTask(task._id)}
                    >
                      <FaThumbsDown className="action-icon" />
                      Reject
                    </button>
                  </>
                )}
                {task.status === "Ongoing" && (
                  <button
                    className="complete-btn"
                    onClick={() =>
                      handleStatusChange(
                        task._id,
                        "Completed",
                        "Task marked as completed!"
                      )
                    }
                  >
                    <FaCheck className="action-icon" />
                    Complete
                  </button>
                )}
                {task.status === "Completed" && (
                  <button className="completed-btn" disabled>
                    <FaCheck className="action-icon" />
                    Completed
                  </button>
                )}
                {task.status === "Rejected" && (
                  <button className="rejected-btn" disabled>
                    <FaTimes className="action-icon" />
                    Rejected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="no-tasks-container">
            <FaTasks className="no-tasks-icon" />
            <p className="no-tasks">No tasks match your search/filter criteria</p>
          </div>
        )
      )}
    </div>
  );
}

VolunteerTaskDisplay.propTypes = {
  onStatsCalculated: PropTypes.func.isRequired
};

export default VolunteerTaskDisplay;