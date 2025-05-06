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

      if (onStatsCalculated) {
        onStatsCalculated({
          completionRate,
          onTimeRate
        });
      }
    }
  }, [tasks]);

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
    <div className="volunteertaskdisplay-container volunteertaskdisplay-fade-in">
      <section className="volunteertaskdisplay-search-filter-section">
        <div className="volunteertaskdisplay-search-container">
          <FaSearch className="volunteertaskdisplay-search-icon" />
          <input
            type="text"
            placeholder="Search tasks by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="volunteertaskdisplay-search-input"
          />
        </div>
        
        <div className="volunteertaskdisplay-filter-container">
          <div className="volunteertaskdisplay-filter-group">
            <FaFilter className="volunteertaskdisplay-filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="volunteertaskdisplay-filter-select"
            >
              <option value="">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Ongoing">🚀 Ongoing</option>
              <option value="Completed">✅ Completed</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
          <div className="volunteertaskdisplay-filter-group">
            <FaInfoCircle className="volunteertaskdisplay-filter-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="volunteertaskdisplay-filter-select"
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
        <div className="volunteertaskdisplay-success-message">
          <FaCheckCircle className="volunteertaskdisplay-success-icon" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {loading && (
        <div className="volunteertaskdisplay-loading-container">
          <FaSpinner className="volunteertaskdisplay-spinner" />
          <p>Loading your tasks...</p>
        </div>
      )}
      
      {error && (
        <div className="volunteertaskdisplay-error-message">
          <FaExclamationTriangle className="volunteertaskdisplay-error-icon" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="volunteertaskdisplay-task-cards-container">
          {filteredTasks.map((task) => (
            <div key={task._id} className="volunteertaskdisplay-task-card">
              <div className="volunteertaskdisplay-task-header">
                <div className="volunteertaskdisplay-task-title-wrapper">
                  <h3 className="volunteertaskdisplay-task-name">{task.taskName}</h3>
                  <span className={`volunteertaskdisplay-priority-badge ${task.priority?.toLowerCase() || 'low'}`}>
                    {task.priority || 'Low'} Priority
                  </span>
                </div>
                <span className={`volunteertaskdisplay-status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              
              <div className="volunteertaskdisplay-task-content">
                <p className="volunteertaskdisplay-task-description">
                  {task.taskDescription}
                </p>
                
                <div className="volunteertaskdisplay-task-details">
                  <div className="volunteertaskdisplay-detail-item">
                    <FaMapMarkerAlt className="volunteertaskdisplay-detail-icon" />
                    <span>{task.location}</span>
                  </div>
                  <div className="volunteertaskdisplay-detail-item">
                    <FaCalendarAlt className="volunteertaskdisplay-detail-icon" />
                    <span>Start: {new Date(task.startDateTime).toLocaleString()}</span>
                  </div>
                  <div className="volunteertaskdisplay-detail-item">
                    <FaClock className="volunteertaskdisplay-detail-icon" />
                    <span>End: {new Date(task.endDateTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="volunteertaskdisplay-task-actions">
                {task.status === "Pending" && (
                  <>
                    <button
                      className="volunteertaskdisplay-accept-btn"
                      onClick={() =>
                        handleStatusChange(
                          task._id,
                          "Ongoing",
                          "Task accepted successfully!"
                        )
                      }
                    >
                      <FaThumbsUp className="volunteertaskdisplay-action-icon" />
                      Accept
                    </button>
                    <button
                      className="volunteertaskdisplay-reject-btn"
                      onClick={() => handleRejectTask(task._id)}
                    >
                      <FaThumbsDown className="volunteertaskdisplay-action-icon" />
                      Reject
                    </button>
                  </>
                )}
                {task.status === "Ongoing" && (
                  <button
                    className="volunteertaskdisplay-complete-btn"
                    onClick={() =>
                      handleStatusChange(
                        task._id,
                        "Completed",
                        "Task marked as completed!"
                      )
                    }
                  >
                    <FaCheck className="volunteertaskdisplay-action-icon" />
                    Complete
                  </button>
                )}
                {task.status === "Completed" && (
                  <button className="volunteertaskdisplay-completed-btn" disabled>
                    <FaCheck className="volunteertaskdisplay-action-icon" />
                    Completed
                  </button>
                )}
                {task.status === "Rejected" && (
                  <button className="volunteertaskdisplay-rejected-btn" disabled>
                    <FaTimes className="volunteertaskdisplay-action-icon" />
                    Rejected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="volunteertaskdisplay-no-tasks-container">
            <FaTasks className="volunteertaskdisplay-no-tasks-icon" />
            <p className="volunteertaskdisplay-no-tasks">No tasks match your search/filter criteria</p>
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