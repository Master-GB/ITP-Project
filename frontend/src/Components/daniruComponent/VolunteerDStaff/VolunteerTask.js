import React from "react";
import "./VolunteerTask.css";
import VolunteerNav from "./VolunteerNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";

const Dashboard = () => {
  return (
    <div>
      <VolunteerNav/>
    <div className="dashboard">
      {/* Search Section */}
      <section className="search-section">
        <h2>🔍 Search & Filter</h2>
        <div className="search-bar">
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
      <section className="performance-section">
        <h2>📊 Weekly Performance</h2>
        <div className="performance-cards">
          <div className="performance-card">
            <span>✅ Task Completion Rate</span>
            <span className="percentage">95%</span>
          </div>
          <div className="performance-card">
            <span>⏳ On-Time Delivery Rate</span>
            <span className="percentage">92%</span>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Dashboard;
