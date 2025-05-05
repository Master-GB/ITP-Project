import React, { useState } from "react";
import "./VolunteerTask.css";
import VolunteerNav from "./VolunteerNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";

const VolunteerTaskDashboard = () => {
  const [stats, setStats] = useState({
    completionRate: "0.0",
    onTimeRate: "0.0"
  });

  const handleStatsCalculated = (newStats) => {
    setStats(newStats);
  };

  return (
    <div>
      <VolunteerNav />
      <div className="volunteer-task-dashboard">
  
        <VolunteerTaskDisplay onStatsCalculated={handleStatsCalculated} />

        {/* Performance Section */}
        <section className="volunteer-task-performance-section">
          <h2 className="volunteer-task-h2">📊 Weekly Performance</h2>
          <div className="volunteer-task-performance-cards">
            <div className="volunteer-task-performance-card">
              <span>✅ Task Completion Rate</span>
              <span className="volunteer-task-percentage">{stats.completionRate}%</span>
            </div>
            <div className="volunteer-task-performance-card">
              <span>⏳ On-Time Delivery Rate</span>
              <span className="volunteer-task-percentage">{stats.onTimeRate}%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VolunteerTaskDashboard;
