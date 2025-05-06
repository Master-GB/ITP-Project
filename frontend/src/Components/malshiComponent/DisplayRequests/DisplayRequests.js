import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DisplayRequests.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DisplayRequests(props) {
  const { request, searchQuery, highlightText } = props;
  const history = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!request) {
    return <div className="food-display-empty">No request data available</div>;
  }

  const { _id, requestCode, location, contactNumber, foodType, quantity, additionalNotes, status } = request;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
      case 'completed':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:8090/requests/${_id}`)
      .then(res => res.data);
    window.location.reload();
    history('/display-requests');
  };

  return (
    <div className="food-display-container">
       <br/>
      <div className="food-display-table-wrapper">
        <table className="food-display-table">
          <tbody>
            <tr className="food-display-row">
              <td className="food-display-label">Request Code:</td>
              <td className="food-display-value">{requestCode}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Location:</td>
              <td className="food-display-value">{location}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Contact Number:</td>
              <td className="food-display-value">{contactNumber}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Food Type:</td>
              <td className="food-display-value">{foodType}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Quantity:</td>
              <td className="food-display-value">{quantity}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Status:</td>
              <td className="food-display-value">
                <span className={`status-badge ${getStatusClass(status)}`}>
                  {status?.toLowerCase() === 'completed' ? 'Approved' : (status || 'Pending')}
                </span>
              </td>
            </tr>
            <tr className="food-display-row food-display-notes-row">
              <td className="food-display-label">Additional Notes:</td>
              <td className="food-display-value">{additionalNotes}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="food-display-actions">
        <Link to={`/display-requests/${_id}`} className="food-display-button food-display-view-btn">Update</Link>
        <button onClick={handleDeleteClick} className="food-display-button food-display-delete-btn">Delete</button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this request?</p>
            <p className="delete-confirm-details">Request Code: {requestCode}</p>
            <div className="delete-confirm-actions">
              <button onClick={handleCancelDelete} className="delete-confirm-cancel">Cancel</button>
              <button onClick={deleteHandler} className="delete-confirm-delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayRequests;