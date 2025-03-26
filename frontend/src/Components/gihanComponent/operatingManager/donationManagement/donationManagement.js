import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./donationManagement.css";

const FoodDonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [nextId, setNextId] = useState(1);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8090/donations/display"
      );
      const donationsWithIds = response.data.donations.map((d, index) => ({
        ...d,
        displayId: index + 1,
      }));
      setDonations(donationsWithIds);
      setFilteredDonations(donationsWithIds);
      setNextId(response.data.donations.length + 1);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Apply filters and search
  useEffect(() => {
    let result = donations.filter(
      (d) => d.status !== "Completed" && d.status !== "Cancel"
    );

    if (searchTerm) {
      result = result.filter((d) =>
        d.foodItem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Sort by expiry date
    result.sort((a, b) => {
      const dateA = a.expiryDate ? new Date(a.expiryDate) : new Date(0);
      const dateB = b.expiryDate ? new Date(b.expiryDate) : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredDonations(result);
  }, [donations, searchTerm, statusFilter, sortOrder]);

  // Generate PDF for a specific status
  const generateStatusPDF = (status) => {
    let donationsToExport = [];

    if (status === "Expiring") {
      donationsToExport = donations.filter((d) => {
        if (!d.expiryDate) return false;
        const expiryDate = new Date(d.expiryDate);
        const oneDaysFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return (
          d.status !== "Completed" &&
          d.status !== "Cancel" &&
          expiryDate < oneDaysFromNow
        );
      });
    } else if (status === "New") {
      donationsToExport = donations.filter((d) => {
        if (!d.donationDate) return false;
        const donationDate = new Date(d.donationDate);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return donationDate > twentyFourHoursAgo;
      });
    } else {
      donationsToExport = donations.filter((d) =>
        status === "All" ? true : d.status === status
      );
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Food Donations - ${status}`, 14, 20);

    // Table
    doc.autoTable({
      startY: 30,
      head: [
        [
          "ID",
          "Food Category",
          "Food Item",
          "Quantity",
          "Storage",
          "Expiration",
          "Status",
        ],
      ],
      body: donationsToExport.map((d) => [
        d.displayId,
        d.foodCategory,
        d.foodItem,
        `${d.quantity} ${d.quantityUnit}`,
        d.storageCondition,
        d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : "N/A",
        d.status,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`food_donations_${status.toLowerCase()}.pdf`);
  };

  const handleStatusChange = async (id, newStatus) => {
    const originalStatus = donations.find((d) => d._id === id)?.status;

    try {
      // Optimistic update
      const updatedDonations = donations.map((d) =>
        d._id === id ? { ...d, status: newStatus } : d
      );
      setDonations(updatedDonations);

      const response = await axios.put(
        `http://localhost:8090/donations/update/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Update failed");
      }

      if (newStatus === "Completed" || newStatus === "Cancel") {
        setTimeout(() => setSelectedDonation(null), 1000);
      }
    } catch (error) {
      console.error("Update error:", error);
      // Revert on error
      setDonations(
        donations.map((d) =>
          d._id === id ? { ...d, status: originalStatus } : d
        )
      );
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const getStatusSteps = (status) => {
    const statusHierarchy = [
      "Pending",
      "Collected",
      "Packaging",
      "Delivery",
      "Completed",
    ];
    const currentIndex = statusHierarchy.indexOf(status);
    return currentIndex >= 0 ? statusHierarchy.slice(0, currentIndex + 1) : [];
  };

  const getStatusOptions = (currentStatus) => {
    const statusHierarchy = [
      "Pending",
      "Collected",
      "Packaging",
      "Delivery",
      "Completed",
      "Cancel",
    ];
    const currentIndex = statusHierarchy.indexOf(currentStatus);
    return statusHierarchy.slice(currentIndex);
  };

  const handleSendMessage = () => {
    if (selectedDonation && message) {
      alert(`Message sent to donor: ${message}`);
      setMessage("");
    }
  };

  // Counts for cards
  const totalPending = donations.filter((d) => d.status === "Pending").length;
  const totalCollected = donations.filter(
    (d) => d.status === "Collected"
  ).length;
  const totalPackaging = donations.filter(
    (d) => d.status === "Packaging"
  ).length;
  const totalDelivery = donations.filter((d) => d.status === "Delivery").length;
  const expiringSoonCount = donations.filter((d) => {
    if (!d.expiryDate) return false;
    const expiryDate = new Date(d.expiryDate);
    const oneDaysFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return (
      d.status !== "Completed" &&
      d.status !== "Cancel" &&
      expiryDate < oneDaysFromNow
    );
  }).length;
  const newDonationsCount = donations.filter((d) => {
    if (!d.donationDate) return false;
    const donationDate = new Date(d.donationDate);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return donationDate > twentyFourHoursAgo;
  }).length;
  const totalCompleted = donations.filter(
    (d) => d.status === "Completed"
  ).length;
  const totalCancel = donations.filter((d) => d.status === "Cancel").length;

  return (
    <div className="page-container">
      {/* Section 1: Status Overview Cards */}
      <div className="card-container">
        <div
          id="pendingStatus"
          className="status-card pending-card"
          onClick={() => generateStatusPDF("Pending")}
        >
          <h3>{totalPending}</h3>
          <p>Pending Donations</p>
        </div>

        <div
          id="newStatus"
          className="status-card new-card"
          onClick={() => generateStatusPDF("New")}
        >
          <h3>{newDonationsCount}</h3>
          <p>New Donation(24h) Donations</p>
        </div>

        <div
          id="expiryStatus"
          className="status-card expiring-card"
          onClick={() => generateStatusPDF("Expiring")}
        >
          <h3>{expiringSoonCount}</h3>
          <p>Expiring Soon Donations</p>
        </div>

        <div
          id="completeStatus"
          className="status-card completed-card"
          onClick={() => generateStatusPDF("Completed")}
        >
          <h3>{totalCompleted}</h3>
          <p>Completed Donations</p>
        </div>

        <div
          id="deleteStatus"
          className="status-card canceled-card"
          onClick={() => generateStatusPDF("Cancel")}
        >
          <h3>{totalCancel}</h3>
          <p>Canceled Donations</p>
        </div>
      </div>

      <div className="card-container" style={{ marginTop: "15px" }}>
        <div
          id="collectedStatus"
          className="status-card collected-card"
          onClick={() => generateStatusPDF("Collected")}
        >
          <h3>{totalCollected}</h3>
          <p>Collected Donations</p>
        </div>

        <div
          id="packagingStatus"
          className="status-card packaging-card"
          onClick={() => generateStatusPDF("Packaging")}
        >
          <h3>{totalPackaging}</h3>
          <p>Packaging Donations</p>
        </div>

        <div
          id="deliveryStatus"
          className="status-card delivery-card"
          onClick={() => generateStatusPDF("Delivery")}
        >
          <h3>{totalDelivery}</h3>
          <p>In Delivery Donations</p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* Search, Filter, and Sort Controls */}
      <div className="table-controls-container">
        <div className="sort-control">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort: Expiry (Oldest First)</option>
            <option value="desc">Sort: Expiry (Newest First)</option>
          </select>
        </div>

        <div className="filter-control">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Collected">Collected</option>
            <option value="Packaging">Packaging</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>

        <div className="search-control">
          <div className="search-input-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search by food item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Donations Table */}
      <div className="table-responsive-container">
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Food Category</th>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Storage</th>
              <th>Expiration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation) => (
              <tr
                key={donation._id}
                className={
                  selectedDonation?._id === donation._id ? "selected-row" : ""
                }
                onClick={() => setSelectedDonation(donation)}
              >
                <td>{donation.displayId}</td>
                <td>{donation.foodCategory}</td>
                <td>{donation.foodItem}</td>
                <td>
                  {donation.quantity} {donation.quantityUnit}
                </td>
                <td>{donation.storageCondition}</td>
                <td>
                  {donation.expiryDate
                    ? new Date(donation.expiryDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{donation.status}</td>
                <td>
                  <select
                    className={`status-dropdown ${donation.status.toLowerCase()}`}
                    value={donation.status}
                    onChange={(e) =>
                      handleStatusChange(donation._id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getStatusOptions(donation.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: Workflow Visualization */}
      {selectedDonation &&
        selectedDonation.status !== "Completed" &&
        selectedDonation.status !== "Cancel" && (
          <>
            <div className="workflow-container">
              <h4>
                Processing Workflow for Donation #{selectedDonation.displayId}
              </h4>
              <div className="workflow-steps">
                {getStatusSteps(selectedDonation.status).map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="step-indicator">{index + 1}</div>
                    <span>{step}</span>
                    {index <
                      getStatusSteps(selectedDonation.status).length - 1 && (
                      <span> → </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Section 4: Communication Panel */}
            <div className="communication-panel">
              <h4>Donor Communication</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the donor..."
                rows="3"
              />
              <div className="communication-actions">
                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!message}
                >
                  Send Message
                </button>
                <button className="template-button">Use Template</button>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default FoodDonationPage;
