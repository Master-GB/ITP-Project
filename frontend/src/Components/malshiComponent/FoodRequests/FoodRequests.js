import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodRequests.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import FooterP from '../FooterP/FooterP';

const URL = 'http://localhost:8090/requests';

const fetchHandler = async () => {
    try {
        const res = await axios.get(URL);
        return res.data;
    } catch (error) {
        console.error('Error fetching requests:', error);
        return { requests: [] };
    }
};

function FoodRequests() {
    const [allRequests, setAllRequests] = useState([]);
    const [foodrequests, setFoodRequests] = useState([]);
    const [search, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        location: '',
        contactNumber: '',
        foodType: '',
        quantity: '',
        additionalNotes: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState("");

    // Chart ref
    const chartRef = React.useRef(null);

    const highlightText = (text, searchTerm) => {
        if (!searchTerm || !text) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    useEffect(() => {
        const loadRequests = async () => {
            setIsLoading(true);
            try {
                const data = await fetchHandler();
                if (data && data.requests) {
                    // Sort requests by creation date, newest first
                    const sortedRequests = data.requests.sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setAllRequests(sortedRequests);
                    setFoodRequests(sortedRequests);
                    setNoResults(sortedRequests.length === 0);
                } else {
                    setAllRequests([]);
                    setFoodRequests([]);
                    setNoResults(true);
                }
            } catch (err) {
                setError('Failed to load requests');
                console.error('Error loading requests:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadRequests();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFoodRequests(allRequests);
            setNoResults(allRequests.length === 0);
        } else {
            const searchLower = search.toLowerCase();
            const filtered = allRequests.filter((request) => {
                if (!request) return false;
                return (
                    (request.requestCode && request.requestCode.toLowerCase().includes(searchLower)) ||
                    (request.organizationName && request.organizationName.toLowerCase().includes(searchLower))
                );
            });
            setFoodRequests(filtered);
            setNoResults(filtered.length === 0);
        }
    }, [search, allRequests]);

    const handleDeleteClick = (request) => {
        setSelectedRequest(request);
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setSelectedRequest(null);
    };

    const deleteHandler = async () => {
        if (!selectedRequest) return;

        try {
            await axios.delete(`http://localhost:8090/requests/${selectedRequest._id}`);
            setFoodRequests(prevRequests => 
                prevRequests.filter(request => request._id !== selectedRequest._id)
            );
            setShowDeleteConfirm(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error deleting request:', error);
            setError('Failed to delete request');
        }
    };

    //update modal
    const handleUpdateClick = (request) => {
        setSelectedRequest(request);
        setUpdateForm({
            location: request.location || '',
            contactNumber: request.contactNumber || '',
            foodType: request.foodType || '',
            quantity: request.quantity || '',
            additionalNotes: request.additionalNotes || ''
        });
        setShowUpdateModal(true);
    };

    const handleUpdateCancel = () => {
        setShowUpdateModal(false);
        setSelectedRequest(null);
        setUpdateForm({
            location: '',
            contactNumber: '',
            foodType: '',
            quantity: '',
            additionalNotes: ''
        });
    };

    const handleUpdateSubmit = async () => {
        if (!selectedRequest) return;

        try {
            const response = await axios.put(`http://localhost:8090/requests/${selectedRequest._id}`, updateForm);
            setFoodRequests(prevRequests =>
                prevRequests.map(request =>
                    request._id === selectedRequest._id ? response.data.request : request
                )
            );
            setShowUpdateModal(false);
            setSelectedRequest(null);
            setUpdateForm({
                location: '',
                contactNumber: '',
                foodType: '',
                quantity: '',
                additionalNotes: ''
            });
            setUpdateSuccess("Request updated successfully!");
            setTimeout(() => setUpdateSuccess(""), 3000);
        } catch (error) {
            console.error('Error updating request:', error);
            setError('Failed to update request');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper to get status counts
    const getStatusCounts = () => {
        const counts = {};
        foodrequests.forEach(req => {
            const status = req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1).toLowerCase() : 'Unknown';
            counts[status] = (counts[status] || 0) + 1;
        });
        return counts;
    };

    // PDF generation with table and chart
    const generatePDF = async () => {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.setProperties({
            title: 'Food Requests Report',
            subject: 'Surplus Food Redistribution System',
            author: 'HodaHiths',
            creator: 'Partnership Management',
        });
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(30);
        doc.text('Food Requests Report', 15, 15);
        // Underline the topic
        const textWidth = doc.getTextWidth('Food Requests Report');
        doc.setLineWidth(1.2);
        doc.line(15, 18, 15 + textWidth, 18); // Draw a line under the text

        // Table data
        const headers = [['Request Code', 'Location', 'Contact', 'Food Type', 'Quantity', 'Status', 'Date']];
        const rows = foodrequests.map(req => [
            req.requestCode || '',
            req.location || '',
            req.contactNumber || '',
            req.foodType || '',
            req.quantity || '',
            req.status || '',
            req.createdAt ? new Date(req.createdAt).toLocaleString() : ''
        ]);

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 30,
            styles: { fontSize: 16, font: 'helvetica', fontStyle: 'normal' },
            headStyles: { fillColor: [25, 90, 200], fontSize: 18, font: 'helvetica', fontStyle: 'bolditalic' },
            margin: { left: 10, right: 10 },
            theme: 'grid',
            tableWidth: 'auto',
        });

        // Add chart on new page
        doc.addPage();
        doc.setFontSize(24);
        doc.text('Requests by Status', 15, 20);

        // Prepare chart data
        const statusCounts = getStatusCounts();
        const chartLabels = Object.keys(statusCounts);
        const chartData = Object.values(statusCounts).map(v => parseInt(v, 10));
        const chartColors = [
            '#195a5c', // dark green
            '#43a047', // medium green
            '#a5d6a7', // light green
            '#388e3c', // deep green
            '#81c784', // soft green
            '#2e7d32', // another green
            '#66bb6a'  // another light green
        ];

        // Create chart in a hidden canvas and add to DOM
        const chartCanvas = document.createElement('canvas');
        chartCanvas.width = 700;
        chartCanvas.height = 350;
        chartCanvas.style.display = 'none';
        document.body.appendChild(chartCanvas);

        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Requests',
                    data: chartData,
                    backgroundColor: chartColors.slice(0, chartLabels.length),
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, precision: 0, font: { size: 22, weight: 'bold' }, color: '#195a5c' },
                        title: { display: true, text: 'Count', font: { size: 24, weight: 'bold' }, color: '#195a5c' }
                    },
                    x: {
                        ticks: { font: { size: 22, weight: 'bold' }, color: '#195a5c' },
                        title: { display: true, text: 'Status', font: { size: 24, weight: 'bold' }, color: '#195a5c' }
                    }
                },
                animation: false
            }
        });

        // Wait a short time to ensure the chart is rendered
        await new Promise(resolve => setTimeout(resolve, 300));

        // Use toDataURL directly from the canvas
        const chartImg = chartCanvas.toDataURL('image/png');
        document.body.removeChild(chartCanvas);

        doc.addImage(chartImg, 'PNG', 25, 35, 250, 110);
        // Add footer to the last page
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Generated by Food Donation Platform', doc.internal.pageSize.getWidth() / 2, pageHeight - 18, { align: 'center' });
        doc.setFontSize(9);
        doc.setTextColor(100);
        const date = new Date();
        const dateString = date.toLocaleString();
        doc.text(`Report generated: ${dateString}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 12, { align: 'center' });
        doc.save('food-requests-report.pdf');
    };

    // Highlight matching part of request code
    const highlightMatch = (text, searchTerm) => {
        if (!searchTerm || !text) return text;
        const idx = text.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.substring(0, idx)}
                <span style={{ background: '#5dade2', color: 'white', borderRadius: '4px', padding: '0 4px' }}>
                    {text.substring(idx, idx + searchTerm.length)}
                </span>
                {text.substring(idx + searchTerm.length)}
            </>
        );
    };

    // Add a handler for manual search button
    const handleManualSearch = () => {
        setSearchQuery(search); // This will trigger the useEffect
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <p>Loading requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="Freq-food-requests">
        <div className="food-requests-container">
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="Freq-top-search-container">
                
                <input
                    type="text"
                    placeholder="Search by request code"
                    value={search}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="Freq-search-input"
                />
                <img src="/Resources/malshiRes/searchM.png" alt="Search" className="Freq-search-icon" />

                <button onClick={generatePDF} style={{ margin: '20px 0', background: '#195a5c', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
                    Download PDF
                </button>
            </div>

            {updateSuccess && (
                <div style={{
                    background: '#8abfc1',
                    color: '#195a5c',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    margin: '10px auto',
                    maxWidth: '600px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    boxShadow: '0 2px 8px rgba(44, 62, 80, 0.10)'
                }}>
                    {updateSuccess}
                </div>
            )}

            {noResults ? (
                <div className="Freq-no-results">
                    <p>No requests found matching your search.</p>
                    <br/>
                </div>
            ) : (
                <div className="Freq-requests-header">
                    <br/>
                    <br/>
                <div className="Freq-requests-grid">
                    {foodrequests.map((request) => (
                        request && (
                            <div key={request._id} className="Freq-request-card">
                                <div className="Freq-request-header">
                                    <h3>{highlightMatch(request.requestCode || request.organizationName || 'N/A', search)}</h3>
                                    <span className={`status-badge ${request.status || 'pending'}`}>
                                        {request.status || 'Pending'}
                                    </span>
                                </div>
                                <table className="Freq-request-details-table">
                                    <tbody>
                                        <tr>
                                            <td><strong>Location:</strong></td>
                                            <td>{request.location}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Contact:</strong></td>
                                            <td>{request.contactNumber}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Food Type:</strong></td>
                                            <td>{request.foodType}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Quantity:</strong></td>
                                            <td>{request.quantity}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Date:</strong></td>
                                            <td>{new Date(request.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</td>
                                        </tr>
                                        {request.additionalNotes && (
                                            <tr>
                                                <td><strong>Notes:</strong></td>
                                                <td>{request.additionalNotes}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="Freq-request-actions">
                                    {!(request.status && ['completed', 'rejected', 'cancelled'].includes(request.status.toLowerCase())) && (
                                        <button onClick={() => handleUpdateClick(request)} className="Freq-update-button">
                                            Update
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteClick(request)} className="Freq-delete-button">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                </div>
            )}

            {showDeleteConfirm && selectedRequest && (
                <div className="Freq-delete-confirm-overlay">
                    <div className="Freq-delete-confirm-modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this request?</p>
                        <p className="Freq-delete-confirm-details">
                            Request Code: {selectedRequest.requestCode || selectedRequest.organizationName || 'N/A'}
                        </p>
                        <div className="Freq-delete-confirm-actions">
                            <button onClick={handleCancelDelete} className="Freq-delete-confirm-cancel">
                                Cancel
                            </button>
                            <button onClick={deleteHandler} className="Freq-delete-confirm-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUpdateModal && selectedRequest && (
                <div className="Freq-update-modal-overlay">
                    <div className="Freq-update-modal">
                        <h3>Update Request</h3>
                        <div className="Freq-update-form">
                            <div className="Freq-form-group">
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={updateForm.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="Freq-form-group">
                                <label>Contact Number:</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={updateForm.contactNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="Freq-form-group">
                                <label>Food Type:</label>
                                <input
                                    type="text"
                                    name="foodType"
                                    value={updateForm.foodType}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="Freq-form-group">
                                <label>Quantity:</label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={updateForm.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="Freq-form-group">
                                <label>Additional Notes:</label>
                                <textarea
                                    name="additionalNotes"
                                    value={updateForm.additionalNotes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="Freq-update-modal-actions">
                            <button onClick={handleUpdateCancel} className="FReq-update-cancel">
                                Cancel
                            </button>
                            <button onClick={handleUpdateSubmit} className="FReq-update-submit">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
            <br/>
            <br/>
            <br/>
            <FooterP />
        </div>
    );
}

export default FoodRequests;