import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './partnerManagement.css';

const PartnerCollaborationPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8090//Requests/");
      setRequests(response.data.requests);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setIsLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests by status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter);

  return (
    <div className="partner-collab-container">
      <div className="header-section">
        <h1>Partner Food Requests</h1>
        <div className="filter-controls">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Requests
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">No food requests found</div>
      ) : (
        <div className="request-cards">
          {filteredRequests.map(request => (
            <div className="food-card" key={request._id}>
              <div className="card-header">
                <h3>{request.organizationName}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </div>
              
              <div className="card-body">
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span>{request.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span>{request.contactNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Food Type:</span>
                  <span>{request.foodType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span>{request.quantity} units</span>
                </div>
                {request.additionalNotes && (
                  <div className="detail-row notes">
                    <span className="label">Notes:</span>
                    <p>{request.additionalNotes}</p>
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button className="action-btn approve">Approve</button>
                <button className="action-btn complete">Mark Complete</button>
                <button className="action-btn contact">Contact</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerCollaborationPage;