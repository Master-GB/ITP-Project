import React, { useEffect, useState } from 'react';
import './opDashboard.css';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ChatBox from '../../../imalshaComponent/Chatbot/Chatbot';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function OpDashboard() {
  // Ensure the background gradient covers the whole page only on this dashboard
  React.useEffect(() => {
    document.body.classList.add('opm-dashboard-background');
    return () => {
      document.body.classList.remove('opm-dashboard-background');
    };
  }, []);
  const [geocodedDonations, setGeocodedDonations] = useState([]);

  // Dummy data for map (copied from dashboard.js)
  const sampleMapData = [
    {
      _id: "1",
      foodItem: "Frid Rice",
      quantity: 10,
      quantityUnit: "kg",
      donationDate: "2025-03-25",
      address: "Colombo, Sri Lanka",
    },
    {
      _id: "2",
      foodItem: "Bread",
      quantity: 50,
      quantityUnit: "unit",
      donationDate: "2023-03-02",
      address: "Kandy, Sri Lanka",
    },
    {
      _id: "3",
      foodItem: "Koththu",
      quantity: 3,
      quantityUnit: "kg",
      donationDate: "2025-03-03",
      address: "Galle, Sri Lanka",
    },
    {
      _id: "4",
      foodItem: "Watalappan",
      quantity: 5,
      quantityUnit: "unit",
      donationDate: "2025-03-04",
      address: "Jaffna, Sri Lanka",
    },
    {
      _id: "5",
      foodItem: "Chicken",
      quantity: 5,
      quantityUnit: "kg",
      donationDate: "2025-03-04",
      address: "No. 89, Temple Road, Anuradhapura, Sri Lanka",
    },
    {
      _id: "6",
      foodItem: "Dhal Curry",
      quantity: 5,
      quantityUnit: "kg",
      donationDate: "2025-03-29",
      address: "No. 10, Post Office Road, Badulla, Sri Lanka",
    },
  ];
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({
    totalDonations: 0,
    pendingApprovals: 0,
    activeVolunteers: 0, // updated by previous effect
    completedDonations: 0,
  });

  // Geocode sampleMapData addresses for the map (like dashboard.js)
  useEffect(() => {
    const geocodeAddress = async (address) => {
      const apiKey = 'da9f3136e71846d289f8da0f3e88c3f9';
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
      try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry;
          return { latitude: lat, longitude: lng };
        }
        return null;
      } catch {
        return null;
      }
    };
    const geocodeAll = async () => {
      const geocoded = await Promise.all(
        sampleMapData.map(async (donation) => {
          const coordinates = await geocodeAddress(donation.address);
          return {
            ...donation,
            latitude: coordinates?.latitude,
            longitude: coordinates?.longitude,
          };
        })
      );
      setGeocodedDonations(geocoded.filter((d) => d.latitude && d.longitude));
    };
    geocodeAll();
  }, []);

  // Fetch real active volunteers count
  // Fetch donations and summary data
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8090/donations/display');
        if (response.data && Array.isArray(response.data.donations)) {
          const donationList = response.data.donations;
          setDonations(donationList);
          // Calculate summary
          const totalDonations = donationList.length;
          const pendingApprovals = donationList.filter(d => d.status === 'Pending').length;
          const completedDonations = donationList.filter(d => (d.status || '').toLowerCase() === 'completed').length;
          setSummary(prev => ({
            ...prev,
            totalDonations,
            pendingApprovals,
            completedDonations
          }));
          // Chart data update handled below
          updateCharts(donationList);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };
    fetchDonations();
  }, []);

  // Fetch real active volunteers count
  useEffect(() => {
    const fetchActiveVolunteers = async () => {
      try {
        const response = await axios.get('http://localhost:8090/volunteers');
        if (response.data && Array.isArray(response.data.volunteers)) {
          const activeCount = response.data.volunteers.filter(v => v.status === 'Accepted').length;
          setSummary(prev => ({ ...prev, activeVolunteers: activeCount }));
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };
    fetchActiveVolunteers();
  }, []);

  // Update charts based on real donation data
  const updateCharts = (donationList) => {
    // Donations Over Time (by week: Monday-Sunday)
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekCounts = [0, 0, 0, 0, 0, 0, 0];
    const statusCounts = { Approved: 0, Pending: 0, Rejected: 0 };

    // Get start (Monday) and end (Sunday) of current week
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0=Monday, 6=Sunday
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0,0,0,0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);

    donationList.forEach(donation => {
      // Parse donation date
      const date = new Date(donation.date || donation.donationDate);
      // Only count donations from current week
      if (date >= monday && date <= sunday) {
        // Get index for weekDays (0=Monday, 6=Sunday)
        const index = (date.getDay() + 6) % 7;
        weekCounts[index]++;
      }
      // Status breakdown for pie chart (all time)
      if (statusCounts[donation.status] !== undefined) {
        statusCounts[donation.status]++;
      }
    });

    // Update Donations Over Time Chart (weekly)
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: weekDays,
          datasets: [{
            label: 'Donations',
            data: weekCounts,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52,152,219,0.1)',
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    }
    // Update Status Breakdown Pie Chart (Completed, Pending, Cancel)
    if (statusChartRef.current) {
      if (statusChartInstanceRef.current) {
        statusChartInstanceRef.current.destroy();
      }
      // Compute actual data for Completed, Pending, Cancel
      let completed = 0, pending = 0, cancel = 0;
      donationList.forEach(donation => {
        const status = (donation.status || '').toLowerCase();
        if (status === 'completed') completed++;
        else if (status === 'pending') pending++;
        else if (status === 'cancel') cancel++;
      });
      const ctx = statusChartRef.current.getContext('2d');
      statusChartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending', 'Cancel'],
          datasets: [{
            data: [completed, pending, cancel],
            backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }
  };
  const chartRef = React.useRef(null);
  const statusChartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);
  const statusChartInstanceRef = React.useRef(null);




  // Quick actions
  const handleStatusChange = async (id, newStatus) => {
    const originalStatus = donations.find((d) => d.id === id || d._id === id)?.status;
    // Optimistically update UI
    setDonations((prev) => prev.map(d => (d.id === id || d._id === id) ? { ...d, status: newStatus } : d));
    try {
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
    } catch (error) {
      // Rollback UI
      setDonations(prev => prev.map(d => (d.id === id || d._id === id) ? { ...d, status: originalStatus } : d));
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };


  // Provide valid status transitions (customize as needed)
  const getStatusOptions = (currentStatus) => {
    const statusHierarchy = [
      'Pending',
      'Collected',
      'Packaging',
      'Delivery',
      'Completed',
      'Cancel',
    ];
    const currentIndex = statusHierarchy.indexOf(currentStatus);
    // If status is not found, allow all
    if (currentIndex === -1) return statusHierarchy;
    return statusHierarchy.slice(currentIndex);
  };

  

  return (

    
    <div > 
       <ChatBox />
       <div className="opm-dh-header">
        <h1>Operating Manger Dashboard</h1>
        <p>Here's your donation activity overview</p>
      </div>
    <div className="opm-dashboard-background">
   
        
    <div className="op-dashboard-container">
      <div className="welcome-message-op">Welcome, Operating Manager! Have a great day managing food donations and making a difference. 🌟</div>
      <div className="dashboard-summary">
        <div className="summary-card accent-total">
          <div className="summary-icon">📦</div>
          <div className="summary-label">Total Donations</div>
          <div className="summary-value">{summary.totalDonations}</div>
        </div>
        <div className="summary-card accent-pending">
          <div className="summary-icon">⏰</div>
          <div className="summary-label">Pending Approvals</div>
          <div className="summary-value">{summary.pendingApprovals}</div>
        </div>
        <div className="summary-card accent-volunteers">
          <div className="summary-icon">👥</div>
          <div className="summary-label">Active Volunteers</div>
          <div className="summary-value">{summary.activeVolunteers}</div>
        </div>
        <div className="summary-card accent-completed">
          <div className="summary-icon">✅</div>
          <div className="summary-label">Completed Donations</div>
          <div className="summary-value">{summary.completedDonations}</div>
        </div>
      </div>
      <div className="dashboard-activity">
        <h2>Recent Donation Activity</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Donation Date</th>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations
  .slice() // copy array to avoid mutating state
  .sort((a, b) => {
    const dateA = new Date(a.date || a.donationDate);
    const dateB = new Date(b.date || b.donationDate);
    return dateB - dateA; // descending
  })
  .slice(0, 5)
  .map((donation) => (
    <tr key={donation.id || donation._id}>
      <td>{donation.date || donation.donationDate ? new Date(donation.date || donation.donationDate).toLocaleDateString() : '-'}</td>
      <td>{donation.item || donation.foodItem || '-'}</td>
      <td>{donation.quantity ?? donation.finalQuantity ?? '-'}</td>
      <td>
        <span className={`status-badge status-${(donation.status || '').toLowerCase()}`}>{donation.status || '-'}</span>
      </td>
      <td>
        <select
          className={`status-dropdown ${(donation.status || '').toLowerCase()}`}
          value={donation.status}
          onChange={e => handleStatusChange(donation.id || donation._id, e.target.value)}
        >
          {getStatusOptions(donation.status).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>

      {/* Charts Section: now below activity, vertical layout, larger size */}
      <div className="dashboard-charts-vertical">
        <div className="chart-card large-chart">
          <h3>Donations Over Time</h3>
          <div className="opm-chart-over">
          <canvas ref={chartRef} height={340} width={900}></canvas>
          </div>
        </div>
        <div className="chart-card large-chart">
          <div style={{ textAlign: 'center', marginBottom: 20, fontWeight: 700, fontSize: '1.5rem', color:'#2c3e50'}}>Status Breakdown</div>
          <div className="centered-pie-canvas opm-chart-over">
  <canvas ref={statusChartRef} height={300} width={300}></canvas>
</div>
        </div>
      </div>
      {/* Map Section: Donation Locations */}
      <div className="map-section chart-card large-chart">
        <h2>Donation Locations</h2>
        <div className="opm-chart-over">
        <MapContainer center={[6.9271, 79.8612]} zoom={7} style={{ height: '500px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geocodedDonations.map((donation) => (
            donation.latitude && donation.longitude && (
              <Marker key={donation.id || donation._id} position={[donation.latitude, donation.longitude]}>
                <Popup>
                  <strong>{donation.foodItem || donation.item}</strong>
                  <br />
                  {donation.quantity} {donation.quantityUnit}
                  <br />
                  {new Date(donation.date || donation.donationDate).toLocaleDateString()}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
