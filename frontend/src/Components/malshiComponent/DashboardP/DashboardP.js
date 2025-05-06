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

function Dashboard() {
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0);
  const [allRequests, setAllRequests] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set current date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8090/requests");
        const requests = response.data.requests;

        // Calculate statistics
        const approvedCount = requests.filter((req) => req.status === "approved").length;
        const pendingCount = requests.filter((req) => req.status === "pending").length;
        const rejectedCount = requests.filter((req) => req.status === "rejected").length;

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
            status: request.status.charAt(0).toUpperCase() + request.status.slice(1),
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
      <div className="req-dash-content-wrap">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="req-dash-h1">Welcome to Your Partnership Dashboard!</h1>
            <div className="dashboard-date">{currentDate}</div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <FaCheckCircle className="stat-icon" />
              <h3>Approved Requests</h3>
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
                <Link to="/display-requests" className="view-all-btn">
                  View All
                </Link>
                <Link to="/add-requests" className="add-request-btn">
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
      </div>
      <br/>
      <br/>
      <FooterP />
    </div>
  );
}

export default Dashboard;