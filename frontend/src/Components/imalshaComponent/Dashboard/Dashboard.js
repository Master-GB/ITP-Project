import React, { useState,useEffect} from 'react';
import axios from "axios";
import './Dashboard.css'



function Dashboard() {

  const [userCount, setUserCount] = useState(0);
  const [feedbackCount,setFeedbackCount]=useState(0);

useEffect(() => {
  const fetchUserCount = async () => {
    try {
      const response = await axios.get("http://localhost:8090/users");
      const totalUsers = response.data.users.length; // Get total count

      setUserCount(totalUsers);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchFeedbackCount = async () => {
    try {
      const response = await axios.get("http://localhost:8090/feedbacks");
      const totalFeedbacks = response.data.feedbacks.length; // Get total count

      setFeedbackCount(totalFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback count:", error);
    }
  };
  fetchUserCount();
  fetchFeedbackCount();
},[]);



    
    


  return (
    <div class="dashboard-container">
    <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Users</h3>
            <div class="stat-number" id="userCount">{userCount}</div>
        </div>
        <div class="stat-card">
            <h3>Total Feedbacks</h3>
            <div class="stat-number" id="feedbackCount">{feedbackCount}</div>
        </div>
        <div class="stat-card">
            <h3>Active Users</h3>
            <div class="stat-number" id="activeUserCount">0</div>
        </div>
    </div>

    <div class="graph-container">
        <h3 class="text-center mb-4">User Growth and Feedback Trends</h3>
        <canvas id="userFeedbackChart"></canvas>
    </div>
</div>
  );
}

export default Dashboard;
