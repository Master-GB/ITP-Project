import React from 'react';
import { Link } from 'react-router-dom';
import './DisplayRequests.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function DisplayRequests(props) {
  const { request } = props;
  const history = useNavigate();
  
  if (!request) {
    return <div className="food-display-empty">No request data available</div>;
  }

  const { _id, organizationName, location, contactNumber, foodType, quantity, additionalNotes } = request;
  

  const deleteHandler = async() =>{
    await axios.delete(`http://localhost:8090/requests/${_id}`)
    .then(res => res.data)
    window.location.reload();
    history('/display-requests');
  }

  return (
    <div className="food-display-container">
      
      <div className="food-display-table-wrapper">
        <table className="food-display-table">
          <tbody>
            <tr className="food-display-row">
              <td className="food-display-label">Request ID:</td>
              <td className="food-display-value">{_id}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Organization Name:</td>
              <td className="food-display-value">{organizationName}</td>
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
            <tr className="food-display-row food-display-notes-row">
              <td className="food-display-label">Additional Notes:</td>
              <td className="food-display-value">{additionalNotes}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="food-display-actions">
      <Link to={`/display-requests/${_id}`} className="food-display-button food-display-view-btn">Update</Link>
        <button onClick={deleteHandler} className="food-display-button food-display-delete-btn">Delete</button>
        
      </div>
    </div>
  );
}

export default DisplayRequests;