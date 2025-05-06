import React, { useState, useEffect } from "react";
import axios from "axios";
import UserComponent from "../User/User";
import Navigationbar from '../anavbar/aNavigationBar';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./Users.css"; 

const URL = "http://localhost:8090/users";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };  // Keep the same structure as success response
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchHandler()
      .then((data) => {
        setUsers(data.users || []);  // Handle potential undefined
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
        setUsers([]);
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      // Show all users if search is empty
      fetchHandler().then((data) => {
        setUsers(data.users || []);
        setNoResults(false);
      });
      return;
    }
    const userList = users || [];
    const filtered = userList.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    // Auto-search: filter users as you type
    const filteredUsers = userList.filter((user) =>
      Object.values(user).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setUsers(filteredUsers);
    setNoResults(filteredUsers.length === 0);
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    // Auto-search: filter users immediately
    const userList = users || [];
    const filteredUsers = userList.filter((user) =>
      Object.values(user).some((field) =>
        field.toString().toLowerCase().includes(name.toLowerCase())
      )
    );
    setUsers(filteredUsers);
    setNoResults(filteredUsers.length === 0);
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Users Report", 14, 15);
    
    // Table Headers & Data
    const tableColumn = ["ID", "Name", "Email", "Role"];
    const tableRows = [];

    users.forEach((user) => {
      tableRows.push([user.id, user.name, user.email, user.role]);
    });

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    // Save the PDF
    doc.save("Users_Report.pdf");
  };

  return (
    <div className="user-search-container">
      <Navigationbar />
      <div className="search-actions">
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            value={searchQuery}
            onChange={handleInputChange}
            className="user-search"
            type="text"
            placeholder="Search Users Details"
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && (
            <ul className="suggestion-list">
              {suggestions.map((user, idx) => (
                <li
                  key={user._id || idx}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(user.name)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={generatePDF} className="user-search-button">Download Report</button>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : noResults ? (
        <p>No Users Found</p>
      ) : (
        <div className="user-card-grid">
          {users && users.map((user, i) => (
            <UserComponent key={i} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;