import React from 'react';

function Volunteer({ volunteer, onApprove, onReject }) {
  if (!volunteer) return null; // Prevents rendering if volunteer data is missing

  const { volunteerName, contactNumber, email, role, status = "Pending" } = volunteer;
  const statusClass = status ? status.toLowerCase() : "pending";

  return (
    <tr>
      <td>{volunteerName}</td>
      <td>{contactNumber}<br />{email}</td>
      <td>{role}</td>
      <td className={`volunteer-status ${statusClass}`}>{status}</td>
      <td>
        <button
          className="volunteer-action-button volunteer-approve"
          onClick={() => onApprove(volunteer)}
        >
          Approve
        </button>
        <button
          className="volunteer-action-button volunteer-reject"
          onClick={() => onReject(volunteer)}
        >
          Reject
        </button>
      </td>
    </tr>
  );
}

export default Volunteer;
