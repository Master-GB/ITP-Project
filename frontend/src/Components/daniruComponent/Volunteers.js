import React, { useEffect, useState } from "react";
import "./Volunteers.css";
import { FaSearch, FaUsers, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import axios from "axios";
import Volunteer from "./Volunteer";
import Nav from "./Nav";

const URL = "http://localhost:8090/volunteers";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return { volunteers: [] };
  }
};

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Date");
  const [roleFilter, setRoleFilter] = useState("All"); // Add role filter
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  // Function to update stats
  const updateStats = (volunteersList) => {
    const pendingVolunteers = volunteersList.filter(v => v.status === "Pending");
    const newStats = {
      total: volunteersList.length,
      approved: volunteersList.filter(v => v.status === "Accepted").length,
      rejected: volunteersList.filter(v => v.status === "Rejected").length,
      pending: pendingVolunteers.length
    };
    setStats(newStats);
    setVolunteers(pendingVolunteers);
  };

  useEffect(() => {
    fetchHandler().then((data) => {
      const volunteersList = data.volunteers || [];
      updateStats(volunteersList);
    });
  }, []);

  // Handle volunteer approval
  const handleApprove = async (volunteer) => {
    try {
      const response = await axios.put(`${URL}/${volunteer._id}`, {
        ...volunteer,
        status: "Accepted"
      });
      
      if (response.status === 200) {
        const updatedVolunteers = await fetchHandler();
        updateStats(updatedVolunteers.volunteers);
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
      alert("Failed to approve volunteer. Please try again.");
    }
  };

  // Handle volunteer rejection
  const handleReject = async (volunteer) => {
    try {
      const response = await axios.put(`${URL}/${volunteer._id}`, {
        ...volunteer,
        status: "Rejected"
      });

      if (response.status === 200) {
        const updatedVolunteers = await fetchHandler();
        updateStats(updatedVolunteers.volunteers);
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      alert("Failed to reject volunteer. Please try again.");
    }
  };

  // Filter volunteers based on search term and role
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const nameMatch = volunteer.volunteerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === "All" || volunteer.role === roleFilter;
    return nameMatch && roleMatch;
  });

  // Sort volunteers
  const sortedVolunteers = filteredVolunteers.sort((a, b) => {
    if (sortOption === "Date") {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    } else if (sortOption === "Role") {
      return a.role.localeCompare(b.role);
    }
    return 0;
  });

  return (
    <div className="volunteer-volunteer-hub-recruitment">
      <Nav />
      <div className="volunteer-main-content">
        <header className="volunteer-header">
          <h1>Volunteer Recruitment & Approval</h1>
        </header>

        {/* Stats sections remain the same */}
        <section className="volunteer-recruitment-stats">
          <div className="volunteer-stats-card">
            <h3>Total Applications: {stats.total}</h3>
            <p>Pending Review: {stats.pending}</p>
          </div>
        </section>

        <section className="volunteer-summary-stats">
          <div className="volunteer-summary-card">
            <FaUsers className="volunteer-summary-icon" />
            <h3>Total Applications</h3>
            <p>{stats.total}</p>
          </div>
          <div className="volunteer-summary-card">
            <FaCheckCircle className="volunteer-summary-icon" />
            <h3>Approved</h3>
            <p>{stats.approved}</p>
          </div>
          <div className="volunteer-summary-card">
            <FaTimesCircle className="volunteer-summary-icon" />
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
          <div className="volunteer-summary-card">
            <FaHourglassHalf className="volunteer-summary-icon" />
            <h3>Pending Review</h3>
            <p>{stats.pending}</p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="volunteer-search-filters">
          <div className="volunteers-search-box">
            <FaSearch className="volunteers-search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              className="volunteer-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="volunteer-filter-select"
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
          >
            <option value="Date">Sort by Date</option>
            <option value="Role">Sort by Role</option>
          </select>
          <select
            className="volunteer-filter-select"
            onChange={(e) => setRoleFilter(e.target.value)}
            value={roleFilter}
          >
            <option value="All">All Roles</option>
            <option value="Volunteer Delivery Staff">Delivery Staff</option>
            <option value="Volunteer Packing Staff">Packing Staff</option>
          </select>
        </section>

        {/* Applicants Table */}
        <section className="volunteer-applicants-table">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Contact</th>
                <th>Preferred Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVolunteers.length > 0 ? (
                sortedVolunteers.map((volunteer) => (
                  <Volunteer 
                    key={volunteer._id} 
                    volunteer={volunteer}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-volunteers">No pending volunteers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default Volunteers;