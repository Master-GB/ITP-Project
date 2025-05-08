import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardP.css";
import FooterP from "../FooterP/FooterP";
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaListAlt, 
  FaPlus 
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import ChatBox from "../../imalshaComponent/Chatbot/Chatbot";   
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function Dashboard() {
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0);
  const [allRequests, setAllRequests] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [quantityByDay, setQuantityByDay] = useState({ labels: [], data: [] });
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set current date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    const loadRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8090/requests');
        const requests = response.data.requests || [];
        setFoodRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to load requests');
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  useEffect(() => {
    // Filter out requests that are not completed
    const completedRequests = foodRequests.filter(request => request.status && request.status.toLowerCase() === 'completed');
    const quantityByDate = {};
    completedRequests.forEach(request => {
      const date = new Date(request.createdAt).toLocaleDateString();
      if (!quantityByDate[date]) {
        quantityByDate[date] = 0;
      }
      quantityByDate[date] += parseInt(request.quantity) || 0;
    });
    const dates = Object.keys(quantityByDate).sort();
    const quantities = dates.map(date => quantityByDate[date]);
    setQuantityByDay({ labels: dates, data: quantities });
  }, [foodRequests]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8090/requests");
        const requests = response.data.requests;

        // Calculate statistics
        const approvedCount = requests.filter((req) => req.status === "approved" || req.status === "completed").length;
        const pendingCount = requests.filter((req) => req.status === "pending").length;
        const rejectedCount = requests.filter((req) => req.status === "rejected" || req.status === "cancelled").length;

        setApprovedRequests(approvedCount);
        setPendingRequests(pendingCount);
        setRejectedRequests(rejectedCount);
        setAllRequests(requests.length);

        // Get recent requests (last 4 requests)
        const recent = requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map(request => ({
            id: request._id,
            requestCode: request.requestCode || 'N/A',
            status: (request.status === 'completed' ? 'Approved' : request.status.charAt(0).toUpperCase() + request.status.slice(1)),
            foodType: request.foodType || 'N/A',
            createdAt: new Date(request.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }));

        setRecentRequests(recent);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-dashboard-page">
      <ChatBox/>
      <div className="req-dash-content-wrap">
        <br/>
        <br/> 
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="req-dash-h1">Welcome to Your Partnership Dashboard!</h1>
            <div className="dashboard-date">{currentDate}</div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <FaCheckCircle className="stat-icon" />
              <h3 className="req-dash-h3">Approved Requests</h3>
              <p>{approvedRequests}</p>
            </div>
            
            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h3>Pending Requests</h3>
              <p>{pendingRequests}</p>
            </div>
            
            <div className="stat-card">
              <FaTimesCircle className="stat-icon" />
              <h3>Rejected Requests</h3>
              <p>{rejectedRequests}</p>
            </div>
            
            <div className="stat-card">
              <FaListAlt className="stat-icon" />
              <h3>Total Requests</h3>
              <p>{allRequests}</p>
            </div>
          </div>
          
          {/* Recent Requests Section */}
          <div className="recent-requests">
            <div className="recent-requests-header">
              <h2>Recent Requests</h2>
              <div className="recent-requests-actions">
                <Link to="/rl/display-requests" className="view-all-btn">
                  View All
                </Link>
                <Link to="/rl/add-requests" className="add-request-btn">
                  <FaPlus /> Add Request
                </Link>
              </div>
            </div>
            <div className="requests-table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request Code</th>
                    <th>Food Type</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.requestCode}</td>
                      <td>{request.foodType}</td>
                      <td>
                        <span className={`status-badge status-${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Quantity by Day Bar Chart */}
          <div className="quantity-bar-chart-section" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Requests Quantity by Day</h2>
            <Bar
              data={{
                labels: quantityByDay.labels,
                datasets: [
                  {
                    label: 'Total Quantity',
                    data: quantityByDay.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false }
                },
                scales: {
                  x: { title: { display: true, text: 'Date' } },
                  y: { title: { display: true, text: 'Quantity' }, beginAtZero: true }
                }
              }}
              height={180}
            />
          </div>
        </div>
        <br/>
        <br/>
      </div>
      <FooterP/>
    </div>
  );
}

export default Dashboard;