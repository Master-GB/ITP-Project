import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './ProfileP.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfileP = () => {
    const [summary, setSummary] = useState({
        totalRequests: 0,
        latestRequest: null,
        foodTypeSummary: []
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('http://localhost:8090/requests/summary');
                setSummary(res.data);
            } catch (err) {
                console.error("Error fetching summary data:", err);
            }
        };
        fetchSummary();
    }, []);

    const chartData = {
        labels: summary.foodTypeSummary.map(item => item._id),
        datasets: [
            {
                label: 'Number of Requests',
                data: summary.foodTypeSummary.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="profile-summary">
            <h1>Profile Summary</h1>
            <div className="summary-details">
                <p><strong>Total Requests:</strong> {summary.totalRequests}</p>
                {summary.latestRequest && (
                    <>
                        <p><strong>Latest Request ID:</strong> {summary.latestRequest._id}</p>
                        <p><strong>Organization Name:</strong> {summary.latestRequest.organizationName}</p>
                        <p><strong>Food Type:</strong> {summary.latestRequest.foodType}</p>
                    </>
                )}
            </div>
            <div className="chart-container">
                <h2>Requests by Food Type</h2>
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default ProfileP;