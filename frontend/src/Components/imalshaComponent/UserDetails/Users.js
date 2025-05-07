import React, { useState, useEffect } from "react";
import axios from "axios";
import UserComponent from "../User/User";
import Navigationbar from '../anavbar/aNavigationBar';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./Users.css"; 
import { Chart } from 'chart.js/auto';

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
  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Modern title with styling
    doc.setFontSize(24);
    doc.setTextColor(25, 118, 210); // Modern blue color
    doc.text("User Management Report", 105, 20, { align: "center" });
    
    // Add date and time
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" });

    // Calculate user statistics
    const totalUsers = users.length;
    const roleDistribution = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    // Add summary statistics
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Summary Statistics", 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Total Users: ${totalUsers}`, 20, 55);
    
    // Role distribution
    let yPos = 65;
    doc.text("Role Distribution:", 20, yPos);
    yPos += 10;
    Object.entries(roleDistribution).forEach(([role, count]) => {
      const percentage = ((count / totalUsers) * 100).toFixed(1);
      doc.text(`${role}: ${count} (${percentage}%)`, 30, yPos);
      yPos += 10;
    });

    // Create and add role distribution pie chart
    const pieCanvas = document.createElement('canvas');
    pieCanvas.width = 400;
    pieCanvas.height = 300;
    const pieCtx = pieCanvas.getContext('2d');
    
    // Enhanced color palette for pie chart
    const chartColors = [
      '#FF6B6B', // Coral Red
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky Blue
      '#96CEB4', // Sage Green
      '#FFEEAD', // Cream Yellow
      '#D4A5A5', // Dusty Rose
      '#9B59B6', // Purple
      '#3498DB', // Blue
      '#E67E22', // Orange
      '#2ECC71'  // Green
    ];
    
    await new Promise(resolve => {
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(roleDistribution),
          datasets: [{
            data: Object.values(roleDistribution),
            backgroundColor: chartColors,
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                font: { size: 12 },
                padding: 20
              }
            },
            title: {
              display: true,
              text: 'User Role Distribution',
              font: { size: 16, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            }
          },
          animation: false,
          responsive: false
        }
      });
      setTimeout(resolve, 500);
    });

    const pieImage = pieCanvas.toDataURL('image/png');
    doc.addPage();
    doc.addImage(pieImage, 'PNG', 20, 20, 170, 120);

    // Add detailed user table
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("User Details", 105, 20, { align: "center" });

    // Table headers and data
    const tableColumn = ["ID", "Name", "Email", "Role", "Contact", "Address"];
    const tableRows = users.map(user => [
      user._id,
      user.name,
      user.email,
      user.role,
      user.contactNumber,
      user.address
    ]);

    // Calculate page width for better table fitting
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const availableWidth = pageWidth - (2 * margin);
    const colCount = tableColumn.length;
    const colWidth = availableWidth / colCount;

    // Add table with modern styling and improved fitting
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: margin, right: margin },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: colWidth },
        1: { cellWidth: colWidth },
        2: { cellWidth: colWidth },
        3: { cellWidth: colWidth },
        4: { cellWidth: colWidth },
        5: { cellWidth: colWidth }
      },
      showFoot: 'lastPage',
      didDrawPage: function(data) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount} of ${data.pageNumber}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    // Place footer just below the table, centered
    const tableY = doc.lastAutoTable.finalY || 130;
    doc.text('Generated by Food Donation Platform', 105, tableY + 10, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(100);
    const date = new Date();
    const dateString = date.toLocaleString();
    doc.text(`Report generated: ${dateString}`, 105, tableY + 14, { align: 'center' });

    // Save the PDF
    doc.save("User_Management_Report.pdf");
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