import React from 'react';

function Volunteer({ volunteer, onApprove, onReject }) {
  if (!volunteer) return null;

  const { volunteerName, contactNumber, email, role, status = "Pending" } = volunteer;
  const statusClass = status.toLowerCase();

  // Handle approve click
  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this volunteer?")) {
      onApprove(volunteer);
    }
  };

  // Handle reject click
  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this volunteer?")) {
      onReject(volunteer);
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
          onClick={handleApprove}
          title="Approve Volunteer"
          disabled={status !== "Pending"}
        >
          ✅ Approve
        </button>
        <button
          className="volunteer-action-button volunteer-reject"
          onClick={handleReject}
          title="Reject Volunteer"
          disabled={status !== "Pending"}
        >
          ❌ Reject
        </button>
      </td>
    </tr>
  );
}

export default Volunteer;