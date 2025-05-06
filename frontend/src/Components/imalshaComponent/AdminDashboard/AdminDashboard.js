import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import UserChart from '../UserChart';
import FeedbackChart from '../FeedbackChart';
import NavigationBar from '../anavbar/aNavigationBar';
import ChatBox from '../chatbot/chatbot'; // ✅ Import ChatBox

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:8090/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = response.data.users;
        const totalUsers = users.length;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activeUsers = users.filter(user => {
          const lastLogin = new Date(user.lastLogin || user.createdAt);
          return lastLogin >= sevenDaysAgo;
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
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbackCount(response.data.feedbacks.length);
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
      <NavigationBar />
      <ChatBox /> {/* ✅ Add ChatBot here */}

      <div className="imalshacomponent-dashboard-container">
        <div className="imalshacomponent-dashboard-header">
          <h1 className="imalshacomponent-dashboard-title">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="imalshacomponent-error-message">{error}</div>
        )}

        <div className="imalshacomponent-stats-grid">
          <div className="imalshacomponent-stat-card">
            <h3>Total Users</h3>
            <div className="imalshacomponent-stat-number" id="userCount">{userCount}</div>
          </div>
          <div className="imalshacomponent-stat-card">
            <h3>Total Feedbacks</h3>
            <div className="imalshacomponent-stat-number" id="feedbackCount">{feedbackCount}</div>
          </div>
          <div className="imalshacomponent-stat-card">
            <h3>Active Users (Last 7 Days)</h3>
            <div className="imalshacomponent-stat-number">{activeUserCount}</div>
            <div className="imalshacomponent-stat-change">
              {activeUserCount > 0 
                ? `${Math.round((activeUserCount / userCount) * 100)}% of total users` 
                : 'No active users'}
            </div>
          </div>
        </div>

        <div className="imalshacomponent-charts-container">
          <div className="imalshacomponent-chart-section">
            <h3 className="imalshacomponent-text-center imalshacomponent-mb-4">User Statistics</h3>
            <UserChart />
          </div>
          <div className="imalshacomponent-chart-section">
            <h3 className="imalshacomponent-text-center imalshacomponent-mb-4">Feedback Statistics</h3>
            <FeedbackChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
