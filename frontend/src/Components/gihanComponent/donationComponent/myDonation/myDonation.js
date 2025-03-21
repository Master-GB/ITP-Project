import React, { useState, useEffect } from "react";
import "./myDonation.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
        return "yellow";
      case "Packaging":
        return "blue";
      case "Delivered":
        return "green";
      default:
        return "black";
    }
  };

  const navigate = useNavigate();

  // Handle Update Action
  const handleUpdate = (id) => {
    console.log(`Update donation with ID: ${id}`);
    // Add your update logic here
  };

  
  const handleDelete = async(id) => {
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

  return (
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
            <option value="Delivered">Delivered</option>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDonations.length > 0 ? (
            filteredDonations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.foodCategory}</td>
                <td>{donation.foodItem}</td>
                <td>{donation.storageCondition}</td>
                <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                <td>{donation.quantity}</td>
                <td>{donation.notes}</td>
                <td style={{ color: getStatusColor(donation.status) }}>
                  {donation.status}
                </td>
                <td>
                  {donation.status === "Pending" && (
                    <button
                      onClick={() => handleUpdate(donation.id)}
                      className="update-button"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(donation._id)}
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
    </div>
  );
}