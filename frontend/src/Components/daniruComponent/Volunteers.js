import React, { useEffect, useState } from "react";
import "./Volunteers.css";
import { FaSearch } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State for search input
  const [sortOption, setSortOption] = useState("Date"); // Sorting state
  
  useEffect(() => {
    fetchHandler().then((data) => {
      setVolunteers(data.volunteers || []);
    });
  }, []);

  // 🔍 Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.volunteerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🧭 Sort volunteers based on selected option (Date or Role)
  const sortedVolunteers = filteredVolunteers.sort((a, b) => {
    if (sortOption === "Date") {
      // Sort by Date
      return new Date(b.dateApplied) - new Date(a.dateApplied); // assuming dateApplied exists
    } else if (sortOption === "Role") {
      // Sort by Role
      return a.role.localeCompare(b.role); // assuming role exists
    }
    return 0;
  });

  return (
    <div className="volunteer-volunteer-hub-recruitment">
      <Nav />

      {/* Main Content */}
      <div className="volunteer-main-content">
        <header className="volunteer-header">
          <h1>Volunteer Recruitment & Approval</h1>
        </header>

        {/* Recruitment Stats */}
        <section className="volunteer-recruitment-stats">
          <div className="volunteer-stats-card">
            <h3>Total Applications: {volunteers.length}</h3>
            <p>Pending Review: {volunteers.filter(v => v.status === "Pending").length}</p>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="volunteer-summary-stats">
          <div className="volunteer-summary-card">
            <h3>Total Applications</h3>
            <p>{volunteers.length}</p>
          </div>
          <div className="volunteer-summary-card">
            <h3>Approved</h3>
            <p>{volunteers.filter(v => v.status === "Accepted").length}</p>
          </div>
          <div className="volunteer-summary-card">
            <h3>Rejected</h3>
            <p>{volunteers.filter(v => v.status === "Rejected").length}</p>
          </div>
          <div className="volunteer-summary-card">
            <h3>Pending Review</h3>
            <p>{volunteers.filter(v => v.status === "Pending").length}</p>
          </div>
        </section>

        {/* 🔍 Search and Filters */}
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
        </section>

        {/* 📜 Applicants Table */}
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
                  <Volunteer key={volunteer._id} volunteer={volunteer} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-volunteers">No volunteers found</td>
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
