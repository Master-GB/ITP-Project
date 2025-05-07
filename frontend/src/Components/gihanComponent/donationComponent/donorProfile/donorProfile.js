import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorProfile.css";

const USER_API_URL = "http://localhost:8090/users";

const DonorProfile = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(USER_API_URL)
      .then(res => {
        const users = res.data.users || [];
        const donorUsers = users.filter(user => user.role === "Donor");
        setDonors(donorUsers);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch donor data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="donor-profile-loading">Loading donor profiles...</div>;
  if (error) return <div className="donor-profile-error">{error}</div>;
  if (donors.length === 0) return <div className="donor-profile-empty">No donor profiles found.</div>;

  // Show only the first donor as a real user profile
  const donor = donors[0];
  return (
    <div className="donor-profile-back">
    <div className="donor-profile-section">
      <div className="real-user-profile">
        <div className="profile-avatar-large">
          {donor.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{donor.name}</h2>
          <div className="profile-field">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{donor.email}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Contact Number:</span>
            <span className="profile-value">{donor.contactNumber}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Address:</span>
            <span className="profile-value">{donor.address}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DonorProfile;
