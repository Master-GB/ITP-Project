import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Volunteer({ volunteer, onApprove }) {
  const navigate = useNavigate(); // ✅ Hook must be at the top

  if (!volunteer) return null; // Prevents rendering if volunteer data is missing

  const { _id, volunteerName, contactNumber, email, role, status = "Pending" } = volunteer;
  const statusClass = status.toLowerCase();

  // Delete Handler with Error Handling
  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to reject this volunteer?")) {
      try {
        await axios.delete(`http://localhost:8090/volunteers/${_id}`);
        navigate(0); // ✅ Refresh the page
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Failed to reject volunteer. Please try again.");
      }
    }
  };

  return (
    <tr>
      <td>{volunteerName}</td>
      <td>
        {contactNumber}
        <br />
        {email}
      </td>
      <td>{role}</td>
      <td className={`volunteer-status ${statusClass}`}>{status}</td>
      <td>
        <button
          className="volunteer-action-button volunteer-approve"
          onClick={() => onApprove(volunteer)}
          title="Approve Volunteer"
        >
          ✅ Approve
        </button>
        <button
          className="volunteer-action-button volunteer-reject"
          onClick={deleteHandler}
          title="Reject Volunteer"
        >
          ❌ Reject
        </button>
      </td>
    </tr>
  );
}

export default Volunteer;
