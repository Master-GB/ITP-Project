import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VolunteerTaskDisplay.css";

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
      const response = await axios.get(
        `http://localhost:8090/tasks/volunteer/${volunteerName}`
      );
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
    // eslint-disable-next-line
  }, [volunteerName]);

  // Calculate task completion rate and on-time delivery rate
  useEffect(() => {
    if (tasks.length > 0) {
      // Calculate task completion rate
      const completedTasks = tasks.filter(
        task => task.status && task.status.toLowerCase() === "completed"
      ).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 
        ? ((completedTasks / totalTasks) * 100).toFixed(1) 
        : "0.0";

      // Calculate on-time delivery rate
      const onTimeCompleted = tasks.filter(task => {
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

      // Pass the calculated stats to the parent component
      if (onStatsCalculated) {
        onStatsCalculated({
          completionRate,
          onTimeRate
        });
      }
    }
  }, [tasks, onStatsCalculated]);

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

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    // Search by task name or description
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      !statusFilter || task.status === statusFilter;

    // Priority filter
    const matchesPriority =
      !priorityFilter || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="volunteer-tasks-container">
      <h2 className="task-title">📌 Tasks for {volunteerName}</h2>

      {/* Search & Filter Section */}
      <section className="volunteer-task-search-section">
        <h2 className="volunteer-task-h2">🔍 Search & Filter</h2>
        <div className="volunteer-task-search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Ongoing">🚀 Ongoing</option>
            <option value="Completed">✅ Completed</option>
            <option value="Rejected">❌ Rejected</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
      </section>

      {successMessage && (
        <p className="success-message">✅ {successMessage}</p>
      )}
      {loading && <p className="loading">⏳ Loading tasks...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="task-cards-container">
          {filteredTasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.taskName}</h3>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              <p>
                <strong>📖 Description:</strong> {task.taskDescription}
              </p>
              <p>
                <strong>📍 Location:</strong> {task.location}
              </p>
              <p>
                <strong>🕒 Start:</strong>{" "}
                {new Date(task.startDateTime).toLocaleString()}
              </p>
              <p>
                <strong>⏳ End:</strong>{" "}
                {new Date(task.endDateTime).toLocaleString()}
              </p>
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
                      ✅ Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectTask(task._id)}
                    >
                      ❌ Reject
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
                    🎉 Completed
                  </button>
                )}
                {task.status === "Completed" && (
                  <button className="accept-btn" disabled>
                    🎉 Completed
                  </button>
                )}
                {task.status === "Rejected" && (
                  <button className="reject-btn" disabled>
                    ❌ Rejected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="no-tasks">🚫 No tasks match your search/filter.</p>
      )}
    </div>
  );
}

export default VolunteerTaskDisplay;