import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./donationManagement.css";

import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const FoodDonationPage = () => { 
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const messageTemplates = [
    "Thank you for your generous donation! We are processing your food donation now.",
    "Your donation has been received and is being prepared for delivery.",
    "We appreciate your support. Your food donation will help many in need.",
    "Your donation is scheduled for pickup soon. Thank you for contributing!"
  ];
  const socketRef = useRef();
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

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  
  const getExpiringSoonDonationsCount = () => {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return donations.filter(d => {
      if (!d.expiryDate) return false;
      const expiryDate = new Date(d.expiryDate);
      return (
        expiryDate > now && expiryDate <= next24h &&
        d.status !== "Completed" &&
        d.status !== "Cancel"
      );
    }).length;
  };

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

    result.sort((a, b) => {
      const dateA = a.expiryDate ? new Date(a.expiryDate) : new Date(0);
      const dateB = b.expiryDate ? new Date(b.expiryDate) : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredDonations(result);
  }, [donations, searchTerm, statusFilter, sortOrder]);

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
          expiryDate > new Date() &&
          expiryDate <= oneDaysFromNow
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

    doc.setFontSize(20);
    doc.text(`Food Donations - ${status}`, 60, 20 );

    doc.autoTable({
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 152, 219] },
      tableLineColor: [52, 152, 219],
      tableLineWidth: 0.2,
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

    const tableY = doc.lastAutoTable.finalY || 130;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generated by Food Donation Platform', 105, tableY + 9, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(100);
    const date = new Date();
    const dateString = date.toLocaleString();
    doc.text(`Report generated: ${dateString}`, 105, tableY + 13, { align: 'center' });
    doc.save(`food_donations_${status.toLowerCase()}.pdf`);
  };

  const handleStatusChange = async (id, newStatus) => {
    const originalStatus = donations.find((d) => d._id === id)?.status;

  
    if (originalStatus && originalStatus !== newStatus && newStatus !== 'Pending') {
    const donation = donations.find((d) => d._id === id);
    const displayId = donation?.displayId || id;
    let msg = `Donation #${displayId} status changed from ${originalStatus} to ${newStatus}`;
    fetch('http://localhost:5000/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
  }

    try {
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
    if (!message.trim()) return;
    let userId = localStorage.getItem('chatOpUserId');
    if (!userId) {
      userId = 'op-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('chatOpUserId', userId);
    }
    let donationDetails = '';
    if (selectedDonation) {
      donationDetails = `Donation Details:\n- Food Item: ${selectedDonation.foodItem}\n- Quantity: ${selectedDonation.quantity} ${selectedDonation.quantityUnit}\n- Category: ${selectedDonation.foodCategory}`;
    }
    let fullMessage = donationDetails;
    if (message.trim()) {
      fullMessage += "\n\n" + message;
    }
    const msgObj = { text: fullMessage, userId };

    socketRef.current.emit("chat message", msgObj);
    setMessage("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const totalPending = donations.filter((d) => d.status === "Pending").length;
  const totalCollected = donations.filter(
    (d) => d.status === "Collected"
  ).length;
  const totalPackaging = donations.filter(
    (d) => d.status === "Packaging"
  ).length;
  const totalDelivery = donations.filter((d) => d.status === "Delivery").length;
  const expiringSoonCount = getExpiringSoonDonationsCount();
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
    <div>
        
        <div className="opm-donation-my-donation-header">
  <div className="opm-donation-my-donation-header-row">
    <div className="opm-donation-my-donation-avatar">🍽️</div>
    <h1 className="opm-donation-my-donation-title">Donation Management</h1>
  </div>
  <div className="opm-donation-my-donation-tagline">Track, review, and manage food donations seamlessly.</div>
</div>
        
    <div className="page-container-opm">
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

      <div className="donation-outer-card">
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
      <div className="donation-inner-card">
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
      </div>
      </div>

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

            {showSuccess && (
              <div style={{color: 'green', marginBottom: 10, fontWeight: 'bold'}}>Message sent successfully!</div>
            )}
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
                <div style={{ position: 'relative', display: 'inline-block' }}>
  <button
    className="template-button"
    type="button"
    onClick={() => setShowTemplates((prev) => !prev)}
  >
    Use Template
  </button>
  {showTemplates && (
    <div className="template-dropdown" style={{ position: 'absolute', zIndex: 10, left: 0, bottom: '100%', background: '#fff', border: '1px solid #ccc', borderRadius: 4, minWidth: 240, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      {messageTemplates.map((tpl, idx) => (
        <div
          key={idx}
          style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: idx !== messageTemplates.length - 1 ? '1px solid #eee' : 'none' }}
          onClick={() => {
            setMessage(tpl);
            setShowTemplates(false);
          }}
        >
          {tpl}
        </div>
      ))}
    </div>
  )}
</div>
              </div>
            </div>

          </>
        )}
    </div>
    </div>
  );
};

export default FoodDonationPage;
