import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFeedbacks: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('http://localhost:8090/users/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats({
          totalUsers: response.data.totalUsers,
          totalFeedbacks: response.data.totalFeedbacks
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        setLoading(false);
        console.error('Dashboard stats error:', err);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div>
            <button className="btn btn-primary">Refresh Data</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number" id="userCount">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <h3>Total Feedbacks</h3>
            <div className="stat-number" id="feedbackCount">{stats.totalFeedbacks}</div>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <div className="stat-number" id="activeUserCount">0</div>
          </div>
        </div>

        <div className="graph-container">
          <h3 className="text-center mb-4">User Growth and Feedback Trends</h3>
          <canvas id="userFeedbackChart"></canvas>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;