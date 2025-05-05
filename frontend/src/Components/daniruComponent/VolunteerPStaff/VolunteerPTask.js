import React, { useState } from "react";
import "./VolunteerPTask.css";
import VolunteerPNav from "./VolunteerPNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";
import VolunteerFooter from "../Home/HomeFooter";
import { FaChartLine, FaCheckCircle, FaClock } from "react-icons/fa";
import axios from "axios";

const VolunteerTaskDashboard = () => {
  const [stats, setStats] = useState({
    completionRate: "0.0",
    onTimeRate: "0.0"
  });

  const handleStatsCalculated = (newStats) => {
    setStats(newStats);
  };

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8090/tasks");
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Only consider tasks that are not rejected
  const nonRejectedTasks = tasks.filter(
    (task) => task.status.toLowerCase() !== "rejected"
  );

  const activeStatuses = ["pending", "ongoing"];
  const todayTasks = nonRejectedTasks.filter(
    (task) => activeStatuses.includes(task.status.toLowerCase())
  ).length;
  const completedTasks = nonRejectedTasks.filter(
    (task) => task.status.toLowerCase() === "completed"
  ).length;
  const totalTasks = nonRejectedTasks.length;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  return (
    <div className="volunteer-task-app-container">
      <VolunteerPNav />
      
      {/* Main Content Area with proper spacing */}
      <main className="volunteer-task-main-content">
        <div className="volunteer-task-content-container">
          <div className="volunteer-task-glass-bg">
            {/* Greeting Section */}
            <div className="volunteer-task-greeting-row">
              <div>
                <h1 className="volunteer-task-title">
                  <span role="img" aria-label="wave">👋</span> Welcome to your <span className="blue-text">Task Dashboard</span>!
                </h1>
              </div>
            </div>

            <VolunteerTaskDisplay onStatsCalculated={handleStatsCalculated} />

            {/* Divider */}
            <div className="volunteer-task-divider"></div>

            {/* Performance Section */}
            <section className="volunteer-task-performance-section">
              <h2 className="volunteer-task-section-title">
                <FaChartLine className="icon-blue" />
                Weekly Performance
              </h2>
              <div className="volunteer-task-performance-cards">
                <div className="volunteer-task-performance-card" title="Task Completion Rate">
                  <FaCheckCircle className="icon-green" />
                  <span>Task Completion Rate</span>
                  <span className="volunteer-task-percentage">{stats.completionRate}%</span>
                </div>
                <div className="volunteer-task-performance-card" title="On-Time Delivery Rate">
                  <FaClock className="icon-orange" />
                  <span>On-Time Delivery Rate</span>
                  <span className="volunteer-task-percentage">{stats.onTimeRate}%</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <VolunteerFooter />
    </div>
  );
};

export default VolunteerTaskDashboard;