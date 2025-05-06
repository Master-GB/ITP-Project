import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import UserChart from '../UserChart';
import FeedbackChart from '../FeedbackChart';
import NavigationBar from '../anavbar/aNavigationBar';

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:8090/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const users = response.data.users;
        const totalUsers = users.length;
        // Count users who have been active in the last 30 days
        const activeUsers = users.filter(user => {
          const lastActive = new Date(user.lastActive || user.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastActive >= thirtyDaysAgo;
        }).length;
        
        setUserCount(totalUsers);
        setActiveUserCount(activeUsers);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setError('Failed to load user statistics');
      }
    };

    const fetchFeedbackCount = async () => {
      try {
        const response = await axios.get("http://localhost:8090/feedbacks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const totalFeedbacks = response.data.feedbacks.length;
        setFeedbackCount(totalFeedbacks);
      } catch (error) {
        console.error("Error fetching feedback count:", error);
        setError('Failed to load feedback statistics');
      }
    };

    fetchUserCount();
    fetchFeedbackCount();
  }, [navigate]);

  return (
    <div>
      <NavigationBar></NavigationBar>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number" id="userCount">{userCount}</div>
          </div>
          <div className="stat-card">
            <h3>Total Feedbacks</h3>
            <div className="stat-number" id="feedbackCount">{feedbackCount}</div>
          </div>
          <div className="stat-card">
            <h3>Active Users (Last 30 Days)</h3>
            <div className="stat-number" id="activeUserCount">{activeUserCount}</div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-section">
            <h3 className="text-center mb-4">User Statistics</h3>
            <UserChart />
          </div>
          <div className="chart-section">
            <h3 className="text-center mb-4">Feedback Statistics</h3>
            <FeedbackChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
