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
    <div className="volunteertask-app-container">
      <VolunteerPNav />
      
      {/* Main Content Area with proper spacing */}
      <main className="volunteertask-main-content">
        <div className="volunteertask-content-container">
          <div className="volunteertask-glass-bg">
            {/* Greeting Section */}
            <div className="volunteertask-greeting-row">
              <div>
                <h1 className="volunteertask-title">
                  <span role="img" aria-label="wave">👋</span> Welcome to your <span className="volunteertask-blue-text">Task Dashboard</span>!
                </h1>
              </div>
            </div>

            <VolunteerTaskDisplay onStatsCalculated={handleStatsCalculated} />

            {/* Divider */}
            <div className="volunteertask-divider"></div>

            {/* Performance Section */}
            <section className="volunteertask-performance-section">
              <h2 className="volunteertask-section-title">
                <FaChartLine className="volunteertask-icon-blue" />
                Weekly Performance
              </h2>
              <div className="volunteertask-performance-cards">
                <div className="volunteertask-performance-card" title="Task Completion Rate">
                  <FaCheckCircle className="volunteertask-icon-green" />
                  <span>Task Completion Rate</span>
                  <span className="volunteertask-percentage">{stats.completionRate}%</span>
                </div>
                <div className="volunteertask-performance-card" title="On-Time Delivery Rate">
                  <FaClock className="volunteertask-icon-orange" />
                  <span>On-Time Delivery Rate</span>
                  <span className="volunteertask-percentage">{stats.onTimeRate}%</span>
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