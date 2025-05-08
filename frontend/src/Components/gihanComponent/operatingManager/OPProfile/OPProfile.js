import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OPProfile.css";

const USER_API_URL = "http://localhost:8090/users";

const OPMProfile = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(USER_API_URL)
      .then(res => {
        const users = res.data.users || [];
        const donorUsers = users.filter(user => user.role === "Operating Manager");
        setDonors(donorUsers);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch donor data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="OPM-profile-donor-profile-loading">Loading donor profiles...</div>;
  if (error) return <div className="OPM-profile-donor-profile-error">{error}</div>;
  if (donors.length === 0) return <div className="OPM-profile-donor-profile-empty">No donor profiles found.</div>;

  const donor = donors[0];
  return (
    <div>
      <div className="opm-donation-my-donation-header">
  <div className="opm-donation-my-donation-header-row">
    <div className="opm-donation-my-donation-avatar">🧑‍💼</div>
    <h1 className="opm-donation-my-donation-title">Operating Manager Profile</h1>
  </div>
  <div className="opm-donation-my-donation-tagline">View and manage your operating manager account details.</div>
</div>
    <div className="OPM-profile-donor-profile-back">
      <div className="OPM-profile-donor-profile-section">
        <div className="OPM-profile-real-user-profile">
          <div className="OPM-profile-profile-avatar-large">
            {donor.name?.charAt(0).toUpperCase()}
          </div>
          <div className="OPM-profile-profile-info">
            <h2 className="OPM-profile-profile-name">{donor.name}</h2>
            <div className="OPM-profile-profile-field">
              <span className="OPM-profile-profile-label">Email:</span>
              <span className="OPM-profile-profile-value">{donor.email}</span>
            </div>
            <div className="OPM-profile-profile-field">
              <span className="OPM-profile-profile-label">Contact Number:</span>
              <span className="OPM-profile-profile-value">{donor.contactNumber}</span>
            </div>
            <div className="OPM-profile-profile-field">
              <span className="OPM-profile-profile-label">Address:</span>
              <span className="OPM-profile-profile-value">{donor.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OPMProfile;
