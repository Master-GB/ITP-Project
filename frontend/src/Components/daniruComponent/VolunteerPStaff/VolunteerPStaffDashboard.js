import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./VolunteerPStaffDashboard.css";
import VolunteerPNav from "./VolunteerPNav";
import VolunteerTaskDisplay from "./VolunteerTaskDisplay";

const Dashboard = () => {
  const { volunteerName } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${volunteerName}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [volunteerName]);

  return (
    <div className="volunteer-delivery-staff-dashboard">
      <VolunteerPNav />
      {/* Main Content */}
      <div className="container volunteer-delivery-staff-dashboard">
        <h2 className="dashboard-title volunteer-delivery-staff-dashboard">
          👋 Welcome back {volunteerName}!
        </h2>
        
        {/* Stats Section */}
        <div className="stats volunteer-delivery-staff-dashboard">
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Today's Tasks</p>
            <h3>8</h3>
            <span className="green volunteer-delivery-staff-dashboard">+2 from yesterday</span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Completed</p>
            <h3>5</h3>
            <span className="green volunteer-delivery-staff-dashboard">62.5% complete</span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Distance Covered</p>
            <h3>42.5 km</h3>
            <span className="green volunteer-delivery-staff-dashboard">Today's total</span>
          </div>
          <div className="card volunteer-delivery-staff-dashboard">
            <p>Performance Rating</p>
            <h3>4.9</h3>
            <span className="green volunteer-delivery-staff-dashboard">+0.2 this week</span>
          </div>
        </div>

        {/* Current Tasks */}
        {/*<h3 className="section-title volunteer-delivery-staff-dashboard">📋 Current Tasks</h3>
        <div className="tasks volunteer-delivery-staff-dashboard">
          <div className="task volunteer-delivery-staff-dashboard">
            <h4>🚚 Food Pickup - Restaurant A</h4>
            <p>📍 123 Main St, Downtown</p>
            <span className="status in-progress volunteer-delivery-staff-dashboard">In Progress</span>
          </div>
          <div className="task volunteer-delivery-staff-dashboard">
            <h4>📦 Delivery - Community Center</h4>
            <p>📍 456 Park Ave, Westside</p>
            <span className="status pending volunteer-delivery-staff-dashboard">Pending</span>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Dashboard;
