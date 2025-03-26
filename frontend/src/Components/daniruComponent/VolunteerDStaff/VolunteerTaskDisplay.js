import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VolunteerTaskDisplay.css"; // Import CSS file

function VolunteerTaskDisplay() {
  const { volunteerName } = useParams(); // Get volunteer name from URL
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log(`Fetching tasks for: ${volunteerName}`);
        const response = await axios.get(
          `http://localhost:8090/tasks/volunteer/${volunteerName}`
        );
        console.log("API Response:", response.data);

        setTasks(response.data.tasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("No tasks found or error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [volunteerName]); // Run when volunteerName changes

  // Handle accepting a task
  const handleAcceptTask = async (taskId) => {
    const confirmAccept = window.confirm("Are you sure you want to accept this task?");
    if (!confirmAccept) return;

    try {
      const response = await axios.patch(
        `http://localhost:8090/tasks/${taskId}`,  // Ensure correct endpoint
        { status: "ongoing" }
      );
      console.log("Task status updated:", response.data);

      // Update the task status locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "ongoing" } : task
        )
      );
    } catch (err) {
      console.error("Error accepting task:", err);
      setError("Failed to update task status.");
    }
  };

  return (
    <div className="volunteer-tasks-container">
      <h2 className="task-title">📌 Tasks for {volunteerName}</h2>

      {loading && <p className="loading">⏳ Loading tasks...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      {!loading && !error && tasks.length > 0 ? (
        <div className="task-cards-container">
          {tasks.map((task) => (
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
                <button
                  className="accept-btn"
                  onClick={() => handleAcceptTask(task._id)}
                  disabled={task.status === "ongoing"} // Disable if already accepted
                >
                  {task.status === "ongoing" ? "⏳ Ongoing" : "✅ Accept"}
                </button>
                <button className="reject-btn">❌ Reject</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="no-tasks">🚫 No tasks assigned to {volunteerName}.</p>
        )
      )}
    </div>
  );
}

export default VolunteerTaskDisplay;
