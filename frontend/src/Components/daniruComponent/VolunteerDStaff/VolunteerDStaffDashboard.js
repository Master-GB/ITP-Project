import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./VolunteerDStaffDashboard.css";
import VolunteerNav from "./VolunteerNav";
import VolunteerTasks from "./VolunteerTasks";
import VolunteerFooter from "../Home/HomeFooter";
import { FaTasks, FaCheckCircle, FaListOl, FaStar, FaClipboardList, FaUserCircle, FaQuoteLeft } from "react-icons/fa";
import ChatBox from '../../imalshaComponent/Chatbot/Chatbot'; // ✅ Import ChatBox

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
        const response = await fetch("http://localhost:8090/tasks");
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

    fetchTasks();
  }, []);

  // Only consider tasks that are not rejected
  const nonRejectedTasks = tasks.filter(
    (task) => task.status && task.status.toLowerCase() !== "rejected"
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
    <>
      <VolunteerNav />
      <ChatBox /> {/* ✅ Add ChatBot here */}
      <div className="volunteerdstaffdashboard-main-content volunteerdstaffdashboard-fade-in">
        <div className="volunteerdstaffdashboard-fullwidth volunteerdstaffdashboard-container">
          {/* Modern Greeting Section */}
          <h2 className="volunteerdstaffdashboard-title">
            <span role="img" aria-label="wave">👋</span> Welcome back !
          </h2>
        
          {/* Stats Section */}
          <div className="volunteerdstaffdashboard-stats">
            <div className="volunteerdstaffdashboard-card" title="Active tasks assigned to you">
              <FaTasks className="volunteerdstaffdashboard-animated-icon" style={{fontSize:'2.2rem', color:'#1abc9c', marginBottom:8}}/>
              <p>Tasks</p>
              <h3>{todayTasks}</h3>
              <span className="volunteerdstaffdashboard-green">Active tasks</span>
            </div>
            <div className="volunteerdstaffdashboard-card" title="Number of tasks you have completed">
              <FaCheckCircle className="volunteerdstaffdashboard-animated-icon" style={{fontSize:'2.2rem', color:'#2ecc71', marginBottom:8}}/>
              <p>Completed</p>
              <h3>{completedTasks}</h3>
              <span className="volunteerdstaffdashboard-green">{completionRate}% complete</span>
            </div>
            <div className="volunteerdstaffdashboard-card" title="Total number of tasks assigned to you">
              <FaListOl className="volunteerdstaffdashboard-animated-icon" style={{fontSize:'2.2rem', color:'#3498db', marginBottom:8}}/>
              <p>Total Tasks</p>
              <h3>{totalTasks}</h3>
              <span className="volunteerdstaffdashboard-green">All time</span>
            </div>
            <div className="volunteerdstaffdashboard-card" title="Your performance rating based on completion rate">
              <FaStar className="volunteerdstaffdashboard-animated-icon" style={{fontSize:'2.2rem', color:'#f39c12', marginBottom:8}}/>
              <p>Performance Rating</p>
              <h3>{performanceRating.toFixed(1)}</h3>
              <span className="volunteerdstaffdashboard-green">Based on completion rate</span>
            </div>
          </div>

          {/* Divider */}
          <div className="volunteerdstaffdashboard-divider"></div>

          {/* Current Tasks */}
          <h3 className="volunteerdstaffdashboard-section-title">
            <FaClipboardList style={{color:'#1abc9c', marginRight:10, verticalAlign:'middle'}}/>
            Current Tasks
          </h3>
          <VolunteerTasks/>
        </div>
        <VolunteerFooter/>
      </div>
    </>
  );
};

export default VolunteerDStaffDashboard;