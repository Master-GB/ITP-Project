import React, { useState, useEffect } from "react";
import "./myDonation.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyDonation() {
  const fetchDonation = async () => {
    return await axios
      .get("http://localhost:8090/donations/display")
      .then((res) => res.data);
  };

  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonation()
      .then((data) => {
        setDonations(data.donations);
        setFilteredDonations(data.donations);
      })
      .catch((error) => console.error("Error fetching donations:", error));
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = donations;

    // Filter by search query (food item)
    if (searchQuery) {
      filtered = filtered.filter((donation) =>
        donation.foodItem.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (donation) => donation.status === statusFilter
      );
    }

    setFilteredDonations(filtered);
  }, [searchQuery, statusFilter, donations]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "red";
      case "Collected":
        return "purple";
      case "Packaging":
        return "rgb(217, 127, 142)";
      case "Delivery":
        return "blue";
      case "Completed":
        return "green";
      case "Cancel":
        return "red";
      default:
        return "black";
    }
  };

  const handleDelete = async (id) => {
    console.log(`Delete donation with ID: ${id}`);
    try {
      await axios.delete(`http://localhost:8090/donations/delete/${id}`);
      setDonations((prevDonations) =>
        prevDonations.filter((donation) => donation._id !== id)
      );
      alert("Donation Deleted Successfully");
    } catch (error) {
      console.error("Error deleting Donation:", error);
      alert("Failed to delete sDonation");
    }
  };

  const handleRowClick = (donation) => {
    if (donation.status !== "Cancel") {
      setSelectedDonation(donation);
    } else {
      setSelectedDonation(null);
    }
  };

  const getActiveStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Collected":
        return 1;
      case "Packaging":
        return 2;
      case "Delivery":
        return 3;
      case "Completed":
        return 4;
      default:
        return -1;
    }
  };

  return (
    <div className="myBack">
      <div className="my-donation-container">
        {/* Filter and Search Bar */}
        <div className="filter-search-container">
          {/* Status Filter */}
          <div className="filter-container">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Collected">Collected</option>
              <option value="Packaging">Packaging</option>
              <option value="Delivery">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by food item..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        {/* Donation Table */}
        <table className="donation-table">
          <thead>
            <tr>
              <th>Food Category</th>
              <th>Food Item</th>
              <th>Storage Condition</th>
              <th>Donation Date</th>
              <th>Expiration Date</th>
              <th>Quantity</th>
              <th>Additional Note</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(donation)}
                  className={
                    selectedDonation?._id === donation._id ? "selected-row" : ""
                  }
                >
                  <td>{donation.foodCategory}</td>
                  <td>{donation.foodItem}</td>
                  <td>{donation.storageCondition}</td>
                  <td>
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>
                  <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                  <td>{donation.finalQuantity}</td>
                  <td>{donation.notes}</td>
                  <td style={{ color: getStatusColor(donation.status) }}>
                    {donation.status}
                  </td>
                  <td>
                    {donation.status === "Pending" && (
                      <Link to={`/myDonate/${donation._id}`}>
                        <button className="update-button">Edit</button>
                      </Link>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(donation._id);
                      }}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No donations found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Workflow Visualization - Only show for non-canceled donations */}
{selectedDonation && selectedDonation.status !== "Cancel" && (
  <div className="donation-workflow-wrapper">
    <h3 className="donation-workflow-title">Donation Workflow</h3>
    <div className="donation-steps-container">
      {["Pending", "Collected", "Packaging", "Delivery", "Completed"].map((status, index) => (
        <React.Fragment key={status}>
          <div className={`donation-status-step ${getActiveStep(selectedDonation.status) >= index ? "active" : ""}`}>
            <div className="donation-step-number">{index + 1}</div>
            <div className="donation-step-name">{status}</div>
          </div>
          {index < 4 && (
            <div className={`donation-step-connector ${getActiveStep(selectedDonation.status) > index ? "active" : ""}`}>
              <span className="donation-arrow">→</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
    <div className="donation-current-status">
      Current Status: <span style={{ color: getStatusColor(selectedDonation.status) }}>
        {selectedDonation.status}
      </span>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
