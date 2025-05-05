import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerTaskDisplay.css";

function VolunteerTaskDisplay() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search/filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8090/tasks");
        setTasks(response.data.tasks || []);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const activeStatuses = ["pending", "ongoing"];
  const todayTasks = tasks.filter(
    (task) => activeStatuses.includes(task.status.toLowerCase())
  ).length;

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
    <>
    <div className="volunteer-tasks-container">
      {successMessage && (
        <p className="success-message">✅ {successMessage}</p>
      )}
      {loading && <p className="loading">⏳ Loading tasks...</p>}
      {error && <p className="error-message">❌ {error}</p>}
      {!loading && !error && filteredTasks.length > 0 ? (
          <div className="current-tasks-card">
            <table className="task-list-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>📝 Task Name</th>
                  <th>🗒️ Description</th>
                  <th>📍 Location</th>
                  <th>🕒 Start</th>
                  <th>⏳ End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
          {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.taskDescription}</td>
                    <td>{task.location}</td>
                    <td>{new Date(task.startDateTime).toLocaleString()}</td>
                    <td>{new Date(task.endDateTime).toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-badge ${task.status.toLowerCase()}`}
                        title={task.status === "Rejected" ? "This task was rejected" : ""}
                      >
                        {task.status === "Completed" && "✅ "}
                        {task.status === "Ongoing" && "🚚 "}
                        {task.status === "Rejected" && "❌ "}
                        {task.status === "Pending" && "⏳ "}
                  {task.status}
                </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ) : (
        !loading && <p className="no-tasks">🚫 No tasks match your search/filter.</p>
      )}
    </div>
    </>
  );
}

export default VolunteerTaskDisplay;