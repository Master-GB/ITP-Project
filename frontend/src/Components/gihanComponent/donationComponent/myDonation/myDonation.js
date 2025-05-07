import React, { useState, useEffect } from "react";
import "./myDonation.css";
import "./myDonation.toast.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyDonation() {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    donationId: null,
  });
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

  useEffect(() => {
    let filtered = donations;

    if (searchQuery) {
      filtered = filtered.filter((donation) =>
        donation.foodItem.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8090/donations/delete/${id}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      console.error("Error deleting Donation:", error);
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
    <>
      {showSuccess && (
        <div className="donor-donation-success-toast">
          Donation deleted successfully!
        </div>
      )}{" "}
      <div className="donor-donation-myBack">
        {deleteModal.open && (
          <div className="donor-donation-modal-overlay">
            <div className="donor-donation-modal-content">
              <h2 className="donor-donation-modal-title">Confirm Deletion</h2>
              <p className="donor-donation-modal-message">
                Are you sure you want to delete this donation? This action
                cannot be undone.
              </p>
              <div className="donor-donation-modal-actions">
                <button
                  className="donor-donation-cancel-button"
                  onClick={() =>
                    setDeleteModal({ open: false, donationId: null })
                  }
                >
                  Cancel
                </button>
                <button
                  className="donor-donation-delete-button"
                  onClick={() => {
                    setDonations((prevDonations) =>
                      prevDonations.filter(
                        (donation) => donation._id !== deleteModal.donationId
                      )
                    );
                    setDeleteModal({ open: false, donationId: null });
                    handleDelete(deleteModal.donationId);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}{" "}
        <div className="donor-donate-back-d">
          <div className="donor-donation-donate">
            <div className="donor-donation-my-donation-header">
              <div className="donor-donation-my-donation-header-row">
                <div className="donor-donation-my-donation-avatar">🍱</div>
                <h1 className="donor-donation-my-donation-title">
                  My Donations
                </h1>
              </div>
              <div className="donor-donation-my-donation-tagline">
                View, update, and track your food donations with ease.
              </div>
            </div>
            <div className="donor-donation-my-donation-container">
              <div className="donor-donation-table-card">
                <div className="donor-donation-filter-search-container">
                  <div className="donor-donation-filter-container">
                    <label
                      htmlFor="donor-donation-status-filter"
                      className="donor-donation-fLabel"
                    >
                      Filter by Status:
                    </label>
                    <select
                      className="donor-dh-filter-right"
                      id="donor-donation-status-filter"
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
                  <div className="donor-donation-search-container">
                    <input
                      type="text"
                      placeholder="Search by food item..."
                      className="donor-donation-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="donor-donation-search-button">
                      Search
                    </button>
                  </div>
                </div>
                <div className="donor-donation-inner-table-card">
                  <table className="donor-donation-donation-table">
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
                            key={donation._id}
                            onClick={() => handleRowClick(donation)}
                            style={{ cursor: "pointer" }}
                            className={
                              selectedDonation &&
                              selectedDonation._id === donation._id
                                ? "row-selected donor-donation-selected-row"
                                : ""
                            }
                          >
                            <td>{donation.foodCategory}</td>
                            <td>{donation.foodItem}</td>
                            <td>{donation.storageCondition}</td>
                            <td>
                              {new Date(
                                donation.donationDate
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(
                                donation.expiryDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{donation.finalQuantity}</td>
                            <td>{donation.notes}</td>
                            <td
                              style={{ color: getStatusColor(donation.status) }}
                            >
                              {donation.status}
                            </td>
                            <td>
                              <div className="donor-donation-action-btn-group">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModal({
                                      open: true,
                                      donationId: donation._id,
                                    });
                                  }}
                                  className="donor-donation-tab-delete-button"
                                >
                                  Delete
                                </button>
                                {donation.status === "Pending" && (
                                  <Link to={`/dl/myDonate/${donation._id}`}>
                                    <button className="donor-donation-update-button">
                                      Edit
                                    </button>
                                  </Link>
                                )}
                              </div>
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
                </div>
              </div>

              {selectedDonation && selectedDonation.status !== "Cancel" && (
                <div className="donor-donation-donation-workflow-wrapper">
                  <h3 className="donor-donation-donation-workflow-title">
                    Donation Workflow
                  </h3>
                  <div className="donor-donation-donation-steps-container">
                    {[
                      "Pending",
                      "Collected",
                      "Packaging",
                      "Delivery",
                      "Completed",
                    ].map((status, index) => (
                      <React.Fragment key={status}>
                        <div
                          className={`donor-donation-donation-status-step ${
                            getActiveStep(selectedDonation.status) >= index
                              ? "donor-donation-active"
                              : ""
                          }`}
                        >
                          <div className="donor-donation-donation-step-number">
                            {index + 1}
                          </div>
                          <div className="donor-donation-donation-step-name">
                            {status}
                          </div>
                        </div>
                        {index < 4 && (
                          <div
                            className={`donor-donation-donation-step-connector ${
                              getActiveStep(selectedDonation.status) > index
                                ? "donor-donation-active"
                                : ""
                            }`}
                          >
                            <span className="donor-donation-donation-arrow">
                              →
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="donor-donation-donation-current-status">
                    Current Status:{" "}
                    <span
                      style={{ color: getStatusColor(selectedDonation.status) }}
                    >
                      {selectedDonation.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
