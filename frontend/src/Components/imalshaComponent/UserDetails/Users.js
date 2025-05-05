import React, { useState, useEffect } from "react";
import axios from "axios";
import UserComponent from "../User/User";
import Navigationbar from "../unavbar/Navigationbar";
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
    return { users: [] };
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
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
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        className="user-search"
        type="text"
        placeholder="Search Users Details"
      />
      <button onClick={handleSearch} className="user-search-button">Search</button>
      <button onClick={generatePDF} className="user-search-button">Download Report</button>
      
      {noResults ? (
        <p>No Users Found</p>
      ) : (
        <table className="user-table">
          <tbody className="tbody-users">
            {users.map((user, i) => (
              <UserComponent key={i} user={user} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;