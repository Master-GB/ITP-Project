import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VolunteerTasks() {
  const { volunteerName } = useParams(); // Get volunteer name from URL
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/tasks/volunteer/${volunteerName}`);
        setTasks(response.data.tasks); // Update state with fetched tasks
      } catch (err) {
        setError("No tasks found or error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [volunteerName]); // Run when volunteerName changes

  return (
    <div className="volunteer-tasks-container">
      <h2>Tasks for {volunteerName}</h2>
      
      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h3>{task.taskName}</h3>
              <p><strong>Description:</strong> {task.taskDescription}</p>
              <p><strong>Location:</strong> {task.location}</p>
              <p><strong>Start:</strong> {new Date(task.startDateTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(task.endDateTime).toLocaleString()}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No tasks assigned to {volunteerName}.</p>
      )}
    </div>
  );
}

export default VolunteerTasks;
