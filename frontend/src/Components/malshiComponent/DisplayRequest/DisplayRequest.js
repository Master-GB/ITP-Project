import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './DisplayRequest.css';

function DisplayRequest() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:8090/requests/${id}`);
        setInputs(res.data.requests);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchHandler();
  }, [id]);

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:8090/requests/${id}`)
      .then(res => res.data);
    navigate('/display-requests');
  };

  return (
    <div className="food-display-container">
      <h1 className="food-display-header">Food Request Details</h1>
      
      <div className="food-display-table-wrapper">
        <table className="food-display-table">
          <tbody>
            <tr className="food-display-row">
              <td className="food-display-label">Request ID:</td>
              <td className="food-display-value">{inputs._id}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Organization Name:</td>
              <td className="food-display-value">{inputs.organizationName}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Location:</td>
              <td className="food-display-value">{inputs.location}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Contact Number:</td>
              <td className="food-display-value">{inputs.contactNumber}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Food Type:</td>
              <td className="food-display-value">{inputs.foodType}</td>
            </tr>
            <tr className="food-display-row">
              <td className="food-display-label">Quantity:</td>
              <td className="food-display-value">{inputs.quantity}</td>
            </tr>
            <tr className="food-display-row food-display-notes-row">
              <td className="food-display-label">Additional Notes:</td>
              <td className="food-display-value">{inputs.additionalNotes}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="food-display-actions">
        <Link to={`/display-requests/${inputs._id}`} className="food-display-button food-display-view-btn">Update</Link>
        <button onClick={deleteHandler} className="food-display-button food-display-delete-btn">Delete</button>
      </div>
    </div>
  );
}

export default DisplayRequest;