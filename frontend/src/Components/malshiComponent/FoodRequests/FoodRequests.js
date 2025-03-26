import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayRequests from '../DisplayRequests/DisplayRequests';
import './FoodRequests.css';
import { jsPDF } from 'jspdf';

const URL = 'http://localhost:8090/requests';

const fetchHandler = async () => {
    const res = await axios.get(URL);
    console.log(res.data);
    return res.data;
};

function FoodRequests() {
    const [foodrequests, setFoodRequests] = useState([]);
    const [search, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        fetchHandler().then((data) => {
            setFoodRequests(data.requests); // Ensure this matches the structure of your fetched data
            console.log('Food Request State:', data.requests);
        });
    }, []);

    const handleSearch = () => {
        fetchHandler().then((data) => {
            const filterRequests = data.requests.filter((request) =>
                Object.values(request).some((field) =>
                    field.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
            setFoodRequests(filterRequests);
            setNoResults(filterRequests.length === 0); // Update noResults state
        });
    };

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape', 
            unit: 'mm',
            format: 'a4',
        });
    
        // Set document properties
        doc.setProperties({
            title: 'Food Requests Report',
            subject: 'Surplus Food Redistribution System',
            author: 'HodaHiths',
            creator: 'Partnership Management',
        });
    
        // Title
        doc.setFontSize(22); // Larger font size
        doc.text('Food Requests Report', 15, 15);
    
        // Table configuration
        const pageWidth = doc.internal.pageSize.getWidth();
        const tableMargin = 15;
        const lineHeight = 15; // Increased line height
        const columnWidths = [40, 50, 35, 50, 30, 30, 50]; // Adjusted column widths
    
        // Headers
        const headers = [
            'Request ID', 
            'Organization Name', 
            'Location', 
            'Contact Number', 
            'Food Type', 
            'Quantity', 
            'Additional Notes'
        ];
    
        // Create table function
        const createTable = () => {
            // Header row
            doc.setFontSize(16); // Larger font for headers
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(220, 230, 255); // Light blue header
            doc.rect(tableMargin, 25, pageWidth - (2 * tableMargin), 12, 'F');
            
            doc.setTextColor(0, 0, 0);
            headers.forEach((header, index) => {
                const xPos = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
                doc.text(header, xPos, 32, { 
                    maxWidth: columnWidths[index],
                    align: 'left'
                });
            });
    
            // Data rows
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14); // Large font for data
            foodrequests.forEach((request, rowIndex) => {
                const rowData = [
                    request.requestId || 'N/A',
                    request.organizationName || 'N/A',
                    request.location || 'N/A',
                    request.contactNumber || 'N/A',
                    request.foodType || 'N/A',
                    request.quantity || 'N/A',
                    request.additionalNotes || 'N/A'
                ];
    
                const yPos = 40 + lineHeight * rowIndex;
    
                // Alternate row background
                doc.setFillColor(240, 240, 240);
                doc.rect(tableMargin, yPos, pageWidth - (2 * tableMargin), lineHeight, 'F');
    
                // Draw row data
                rowData.forEach((cell, colIndex) => {
                    const xPos = tableMargin + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
                    doc.text(String(cell), xPos, yPos + 8, { 
                        maxWidth: columnWidths[colIndex],
                        align: 'left'
                    });
                });
    
                // Cell borders
                doc.setDrawColor(200, 200, 200);
                doc.rect(tableMargin, yPos, pageWidth - (2 * tableMargin), lineHeight);
            });
        };
    
        // Generate table
        createTable();
    
        // Save PDF
        doc.save('FoodRequestsReport.pdf');
    };

    return (
        <div>
            <h1>Food Requests</h1>
            <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                name="search"
                placeholder="Search requests"
                className="request-search"
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={generatePDF}>Generate PDF</button>

            {noResults ? (
                <div>
                    <p>No Results Found</p>
                </div>
            ) : (
                <div>
                    {foodrequests &&
                        foodrequests.map((request, i) => (
                            <div key={i}>
                                <DisplayRequests request={request} />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default FoodRequests;