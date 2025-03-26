import React from "react";
import "./VolunteerDStaffDashboard.css";
import VolunteerNav from "./VolunteerNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";

const Dashboard = () => {
  return (
    <div>
      <VolunteerNav />
      {/* Main Content */}
      <div className="container">
        <h2 className="dashboard-title">👋 Welcome back, John!</h2>
        
        {/* Stats Section */}
        <div className="stats">
          <div className="card">
            <p>Today's Tasks</p>
            <h3>8</h3>
            <span className="green">+2 from yesterday</span>
          </div>
          <div className="card">
            <p>Completed</p>
            <h3>5</h3>
            <span className="green">62.5% complete</span>
          </div>
          <div className="card">
            <p>Distance Covered</p>
            <h3>42.5 km</h3>
            <span className="green">Today's total</span>
          </div>
          <div className="card">
            <p>Performance Rating</p>
            <h3>4.9</h3>
            <span className="green">+0.2 this week</span>
          </div>
        </div>

        <VolunteerTaskDisplay/>

        {/* Current Tasks */}
        <h3 className="section-title">📋 Current Tasks</h3>
        <div className="tasks">
          <div className="task">
            <h4>🚚 Food Pickup - Restaurant A</h4>
            <p>📍 123 Main St, Downtown</p>
            <span className="status in-progress">In Progress</span>
          </div>
          <div className="task">
            <h4>📦 Delivery - Community Center</h4>
            <p>📍 456 Park Ave, Westside</p>
            <span className="status pending">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
