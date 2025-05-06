import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './ProfileP.css';

function ProfileP() {
    const [profileData, setProfileData] = useState({
        organizationName: '',
        location: '',
        contactNumber: '',
        email: '',
        joinedDate: '',
        status: 'Active'
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch organization details
                const orgResponse = await axios.get("http://localhost:8090/organization/profile");
                const orgData = orgResponse.data;

                setProfileData({
                    organizationName: orgData.organizationName || 'Not Set',
                    location: orgData.location || 'Not Set',
                    contactNumber: orgData.contactNumber || 'Not Set',
                    email: orgData.email || 'Not Set',
                    joinedDate: orgData.joinedDate || 'Not Set',
                    status: orgData.status || 'Active'
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-title">
                    <h1>Partner Information</h1>
                    <p className="profile-subtitle">Organization Details</p>
                </div>
                <div className="profile-status">
                    <span className={`status-badge ${profileData.status.toLowerCase()}`}>
                        {profileData.status}
                    </span>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">🏢</div>
                            <div className="info-content">
                                <label>Organization Name</label>
                                <p>{profileData.organizationName}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                                <label>Location</label>
                                <p>{profileData.location}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div className="info-content">
                                <label>Contact Number</label>
                                <p>{profileData.contactNumber}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">✉️</div>
                            <div className="info-content">
                                <label>Email</label>
                                <p>{profileData.email}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📅</div>
                            <div className="info-content">
                                <label>Joined Date</label>
                                <p>{profileData.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileP;
