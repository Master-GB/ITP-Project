import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './partnerManagement.css';

const PartnerCollaborationPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8090/Requests/");
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

  const updateRequestStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8090/Requests/${id}`, { status: newStatus });
      setRequests(requests.map(request => 
        request._id === id ? { ...request, status: newStatus } : request
      ));
    } catch (err) {
      setError(`Failed to update request status`);
      console.error(err);
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter);

  return (
    <div>
       <div className="opm-donation-my-donation-header">
  <div className="opm-donation-my-donation-header-row">
    <div className="opm-donation-my-donation-avatar">🤝</div>
    <h1 className="opm-donation-my-donation-title">Partner Management</h1>
  </div>
  <div className="opm-donation-my-donation-tagline">Collaborate and manage requests from partner organizations efficiently.</div>
</div>
    <div className="partner-collab-container">
      <div className="header-section">
        <div>
          <h1>Partner Food Requests</h1>
          <p className="subtitle">Manage food donation requests from partner organizations</p>
        </div>
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
          <button 
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <img src="/empty-state.svg" alt="No requests" />
          <p>No food requests found</p>
        </div>
      ) : (
        <div className="request-cards">
          {filteredRequests.map(request => (
            <div className={`food-card ${request.status}`} key={request._id}>
              <div className="card-header">
                <div className="org-info">
                  <h3>{request.organizationName}</h3>
                  <span className="request-id">#{request._id.slice(-6)}</span>
                </div>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </div>
              
              <div className="card-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{request.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Contact:</span>
                    <span className="value">{request.contactNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Food Type:</span>
                    <span className="value">{request.foodType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Quantity:</span>
                    <span className="value">{request.quantity} units</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Request Date:</span>
                    <span className="value">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {request.additionalNotes && (
                  <div className="notes-section">
                    <span className="label">Additional Notes:</span>
                    <p>{request.additionalNotes}</p>
                  </div>
                )}
              </div>

              <div className="card-actions">
                {request.status === 'pending' && (
                  <>
                    <button 
                      className="action-btn approve"
                      onClick={() => updateRequestStatus(request._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="action-btn cancel"
                      onClick={() => updateRequestStatus(request._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {request.status === 'approved' && (
                  <button 
                    className="action-btn complete"
                    onClick={() => updateRequestStatus(request._id, 'completed')}
                  >
                    Mark Complete
                  </button>
                )}
                <button 
                  className="action-btn contact"
                  onClick={() => setSelectedRequest(request)}
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="contact-modal">
            <div className="modal-header">
              <h3>Contact {selectedRequest.organizationName}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedRequest(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Contact Person:</strong> {selectedRequest.contactPerson}</p>
              <p><strong>Phone:</strong> {selectedRequest.contactNumber}</p>
              <p><strong>Email:</strong> {selectedRequest.contactEmail || 'Not provided'}</p>
              <div className="contact-notes">
                <p><strong>Additional Information:</strong></p>
                <p>{selectedRequest.additionalNotes || 'No additional notes provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PartnerCollaborationPage;