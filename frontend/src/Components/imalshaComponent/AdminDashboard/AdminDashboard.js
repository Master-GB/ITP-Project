import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import UserChart from '../UserChart';
import FeedbackChart from '../FeedbackChart';
import NavigationBar from '../anavbar/aNavigationBar';
import ChatBox from '../Chatbot/Chatbot'; // ✅ Import ChatBox

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('token');
      alert('Successfully signed out!');
      navigate('/');
    }
  };

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

        console.log('Seven days ago:', sevenDaysAgo);

        const newUsers = users.filter(user => {
          // Extract timestamp from MongoDB ObjectId
          const timestamp = parseInt(user._id.substring(0, 8), 16) * 1000;
          const registrationDate = new Date(timestamp);
          console.log('User registration date:', registrationDate, 'for user:', user.name);
          return registrationDate >= sevenDaysAgo;
        }).length;

        console.log('Total Users:', totalUsers);
        console.log('New Users:', newUsers);
        
        setUserCount(totalUsers);
        setActiveUserCount(newUsers);
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
      <NavigationBar onSignOut={handleSignOut} />
      <ChatBox /> {/* ✅ Add ChatBot here */}

      <div className="imalshacompnat-dashboard-container">
        <div className="imalshacompnat-dashboard-header">
          <h1 className="imalshacompnat-dashboard-title">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="imalshacompnat-error-message">{error}</div>
        )}

        <div className="imalshacompnat-stats-grid">
          <div className="imalshacompnat-stat-card">
            <h3>Total Users</h3>
            <div className="imalshacompnat-stat-number" id="userCount">{userCount}</div>
          </div>
          <div className="imalshacompnat-stat-card">
            <h3>Total Feedbacks</h3>
            <div className="imalshacompnat-stat-number" id="feedbackCount">{feedbackCount}</div>
          </div>
          <div className="imalshacompnat-stat-card">
            <h3>New Users (Last 7 Days)</h3>
            <div className="imalshacompnat-stat-number">{activeUserCount || 0}</div>
            <div className="imalshacompnat-stat-change">
              {activeUserCount > 0 
                ? `${Math.round((activeUserCount / userCount) * 100)}% of total users` 
                : 'No new users'}
            </div>
          </div>
        </div>

        <div className="imalshacompnat-charts-container">
          <div className="imalshacompnat-chart-section">
            <h3 className="imalshacompnat-text-center imalshacompnat-mb-4">User Statistics</h3>
            <UserChart />
          </div>
          <div className="imalshacompnat-chart-section">
            <h3 className="imalshacompnat-text-center imalshacompnat-mb-4">Feedback Statistics</h3>
            <FeedbackChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
