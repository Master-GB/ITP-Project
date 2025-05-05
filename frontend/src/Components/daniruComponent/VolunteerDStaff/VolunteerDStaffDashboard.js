import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./VolunteerDStaffDashboard.css";
import VolunteerNav from "./VolunteerNav";
import VolunteerTasks from "./VolunteerTasks";

const VolunteerDStaffDashboard = () => {
  const { volunteerName } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const decodedVolunteerName = decodeURIComponent(volunteerName);
        const response = await fetch(
          `http://localhost:8090/tasks/volunteer/${decodedVolunteerName}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (volunteerName) {
      fetchTasks();
    }
  }, [volunteerName]);

  // Calculate statistics
  const activeStatuses = ["pending", "ongoing"];
  const todayTasks = tasks.filter(
    (task) => activeStatuses.includes(task.status.toLowerCase())
  ).length;
  const completedTasks = tasks.filter((task) => task.status.toLowerCase() === "completed").length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Improved performance rating logic
  let performanceRating = 3.0;
  if (completionRate === "100.0") {
    performanceRating = 5.0;
  } else if (completionRate >= 80) {
    performanceRating = 4.5;
  } else if (completionRate >= 60) {
    performanceRating = 4.0;
  } else if (completionRate >= 40) {
    performanceRating = 3.5;
  }

  return (
    <div className="volunteer-delivery-staff-dashboard">
      <VolunteerNav />
      {/* Main Content */}
      <div className="container volunteer-delivery-staff-dashboard">
        <h2 className="dashboard-title volunteer-delivery-staff-dashboard">
          👋 Welcome back, {volunteerName}!
        </h2>

        {/* Stats Section */}
        <div className="stats volunteer-delivery-staff-dashboard">
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Tasks</p>
            <h3>{todayTasks}</h3>
            <span className="green volunteer-delivery-staff-dashboard">
              Active tasks
            </span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Completed</p>
            <h3>{completedTasks}</h3>
            <span className="green volunteer-delivery-staff-dashboard">
              {completionRate}% complete
            </span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Total Tasks</p>
            <h3>{totalTasks}</h3>
            <span className="green volunteer-delivery-staff-dashboard">
              All time
            </span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Performance Rating</p>
            <h3>{performanceRating.toFixed(1)}</h3>
            <span className="green volunteer-delivery-staff-dashboard">
              Based on completion rate
            </span>
          </div>
        </div>

        {/* Current Tasks */}
        <h3 className="section-title volunteer-delivery-staff-dashboard">
          📋 Current Tasks
        </h3>
        <VolunteerTasks/>
      </div>
    </div>
  );
};

export default VolunteerDStaffDashboard;