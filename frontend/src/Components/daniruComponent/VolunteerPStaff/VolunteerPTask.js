import React from "react";
import "./VolunteerPTask.css";
import VolunteerPNav from "./VolunteerPNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";

const VolunteerTaskDashboard = () => {
  return (
    <div>
      <VolunteerPNav />
      <div className="volunteer-task-dashboard">
        {/* Search Section */}
        <section className="volunteer-task-search-section">
          <h2 className="volunteer-task-h2">🔍 Search & Filter</h2>
          <div className="volunteer-task-search-bar">
            <input type="text" placeholder="Search tasks..." />
            <select>
              <option>📌 All Status</option>
              <option>⏳ Pending</option>
              <option>🚀 In Progress</option>
              <option>✅ Completed</option>
            </select>
            <select>
              <option>🔥 Priority</option>
              <option>🔴 High</option>
              <option>🟡 Medium</option>
              <option>🟢 Low</option>
            </select>
          </div>
        </section>

        <VolunteerTaskDisplay />

        {/* Performance Section */}
        <section className="volunteer-task-performance-section">
          <h2 className="volunteer-task-h2">📊 Weekly Performance</h2>
          <div className="volunteer-task-performance-cards">
            <div className="volunteer-task-performance-card">
              <span>✅ Task Completion Rate</span>
              <span className="volunteer-task-percentage">95%</span>
            </div>
            <div className="volunteer-task-performance-card">
              <span>⏳ On-Time Delivery Rate</span>
              <span className="volunteer-task-percentage">92%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VolunteerTaskDashboard;
