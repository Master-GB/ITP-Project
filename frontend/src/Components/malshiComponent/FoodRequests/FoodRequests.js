import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodRequests.css';
import { jsPDF } from 'jspdf';

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

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape', 
            unit: 'mm',
            format: 'a4',
        });
    
        doc.setProperties({
            title: 'Food Requests Report',
            subject: 'Surplus Food Redistribution System',
            author: 'HodaHiths',
            creator: 'Partnership Management',
        });
    
        doc.setFontSize(22);
        doc.text('Food Requests Report', 15, 15);
    
        const pageWidth = doc.internal.pageSize.getWidth();
        const tableMargin = 15;
        const lineHeight = 15;
        const columnWidths = [40, 50, 35, 50, 30, 30, 50];
    
        const headers = [
            'Request Code', 
            'Location', 
            'Contact Number', 
            'Food Type', 
            'Quantity', 
            'Status',
            'Additional Notes'
        ];
    
        const createTable = () => {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(220, 230, 255);
            doc.rect(tableMargin, 25, pageWidth - (2 * tableMargin), 12, 'F');
            
            doc.setTextColor(0, 0, 0);
            headers.forEach((header, index) => {
                const xPos = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
                doc.text(header, xPos, 32, { 
                    maxWidth: columnWidths[index],
                    align: 'left'
                });
            });
    
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            foodrequests.forEach((request, rowIndex) => {
                if (!request) return;

                const rowData = [
                    request.requestCode || request.organizationName || 'N/A',
                    request.location || 'N/A',
                    request.contactNumber || 'N/A',
                    request.foodType || 'N/A',
                    request.quantity || 'N/A',
                    request.status || 'N/A',
                    request.additionalNotes || 'N/A'
                ];
    
                const yPos = 40 + lineHeight * rowIndex;
    
                doc.setFillColor(240, 240, 240);
                doc.rect(tableMargin, yPos, pageWidth - (2 * tableMargin), lineHeight, 'F');
    
                rowData.forEach((cell, colIndex) => {
                    const xPos = tableMargin + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
                    doc.text(String(cell), xPos, yPos + 8, { 
                        maxWidth: columnWidths[colIndex],
                        align: 'left'
                    });
                });
    
                doc.setDrawColor(200, 200, 200);
                doc.rect(tableMargin, yPos, pageWidth - (2 * tableMargin), lineHeight);
            });
        };
    
        createTable();
        doc.save('FoodRequestsReport.pdf');
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
        <div className="food-requests-container">
            <br/>
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
                <button onClick={handleManualSearch} className="Freq-search-button">
                    Search
                </button>

                <button onClick={generatePDF} className="Freq-generatepdf-fr-button">Generate PDF</button>
            </div>

            {noResults ? (
                <div className="Freq-no-results">
                    <p>No requests found matching your search.</p>
                </div>
            ) : (
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
                                    <button onClick={() => handleUpdateClick(request)} className="Freq-update-button">
                                        Update
                                    </button>
                                    <button onClick={() => handleDeleteClick(request)} className="Freq-delete-button">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
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
    );
}

export default FoodRequests;