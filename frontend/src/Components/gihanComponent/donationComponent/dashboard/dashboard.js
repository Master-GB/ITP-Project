import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./dashboard.css";
import axios from "axios";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const AdvancedDonorDashboard = () => {
  const [user, setUser] = useState({
    name: "Gihan Bandara",
    joinDate: "2023-01-01",
  });
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("month"); // Default filter: month
  const [geocodedDonations, setGeocodedDonations] = useState([]); // State for geocoded data
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Fetch donations from the backend
  const fetchDonation = async () => {
    return await axios.get("http://localhost:8090/donations/display")
    .then((res) => res.data)
    .catch(()=> console.log("Donation Not featching"));
  };

  useEffect(() => {
    fetchDonation().then((data) => setDonations(data.donations));
  }, []);

  // Sample data with addresses for testing the map
  const sampleMapData = [
    {
      _id: "1",
      foodItem: "Rice",
      quantity: 10,
      quantityUnit: "kg",
      donationDate: "2023-10-01",
      address: "Colombo, Sri Lanka", // Address for Colombo
    },
    {
      _id: "2",
      foodItem: "Bread",
      quantity: 50,
      quantityUnit: "unit",
      donationDate: "2023-10-02",
      address: "Kandy, Sri Lanka", // Address for Kandy
    },
    {
      _id: "3",
      foodItem: "Vegetables",
      quantity: 20,
      quantityUnit: "kg",
      donationDate: "2023-10-03",
      address: "Galle, Sri Lanka", // Address for Galle
    },
    {
      _id: "4",
      foodItem: "Fruits",
      quantity: 30,
      quantityUnit: "kg",
      donationDate: "2023-10-04",
      address: "Jaffna, Sri Lanka", // Address for Jaffna
    },
  ];

  // Function to geocode addresses using OpenCage API
  const geocodeAddress = async (address) => {
    const apiKey = "da9f3136e71846d289f8da0f3e88c3f9"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("No results found for address:", address);
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  // Geocode sample data on component mount
  useEffect(() => {
    const geocodeSampleData = async () => {
      const geocodedData = await Promise.all(
        sampleMapData.map(async (donation) => {
          const coordinates = await geocodeAddress(donation.address);
          return {
            ...donation,
            latitude: coordinates?.latitude,
            longitude: coordinates?.longitude,
          };
        })
      );
      setGeocodedDonations(geocodedData.filter((d) => d.latitude && d.longitude));
    };

    geocodeSampleData();
  }, []);

  // Calculate donation statistics
  const totalDonations = donations.length;
  const totalCompleted = donations.filter((d) => d.status === "Completed").length;
  const totalPending = donations.filter((d) => d.status === "Pending").length;
  const totalCancel = donations.filter((d)=>d.status==="Cancel").length;
  let kgQuantity = 0;
  let unitQuantity = 0;
  for (let i = 0; i < totalDonations; i++) {
    if (donations[i].quantityUnit === "kg") {
      kgQuantity += Number(donations[i].quantity);
    } else if (donations[i].quantityUnit === "unit") {
      unitQuantity += Number(donations[i].quantity);
    }
  }
  const completionRate = ((totalCompleted / totalDonations) * 100).toFixed(2);

  // Function to generate x-axis labels based on the filter
  const generateXAxisLabels = (filter) => {
    const labels = [];
    if (filter === "year") {
      // Labels for months (January to December)
      for (let i = 0; i < 12; i++) {
        const date = new Date(2023, i, 1); // Use any year (e.g., 2023)
        labels.push(date.toLocaleString("default", { month: "short" }));
      }
    } else if (filter === "month") {
      // Labels for days (1 to 31)
      for (let i = 1; i <= 31; i++) {
        labels.push(i.toString());
      }
    } else if (filter === "week") {
      // Labels for days of the week (Monday to Sunday)
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels.push(...days);
    }
    return labels;
  };

  // Function to filter donations based on the selected time period
  const filterDonationsByTimePeriod = (donations, period) => {
    const now = new Date(); // Current date
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeekStart = new Date(now); // Start of the current week (Monday)
    currentWeekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Adjust for Monday as the start of the week

    return donations.filter((donation) => {
      const donationDate = new Date(donation.donationDate);

      if (period === "year") {
        // Filter donations for the current year
        return donationDate.getFullYear() === currentYear;
      } else if (period === "month") {
        // Filter donations for the current month
        return (
          donationDate.getFullYear() === currentYear &&
          donationDate.getMonth() === currentMonth
        );
      } else if (period === "week") {
        // Filter donations for the current week
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6); // End of the current week (Sunday)
        return donationDate >= currentWeekStart && donationDate <= weekEnd;
      }
      return true; // No filter applied
    });
  };

  // Function to group donations by time period (year, month, week)
  const groupDonationsByTimePeriod = (donations, period) => {
    const grouped = { kg: {}, unit: {} };

    // Initialize grouped data with zeros for all labels
    const labels = generateXAxisLabels(period);
    labels.forEach((label) => {
      grouped.kg[label] = 0;
      grouped.unit[label] = 0;
    });

    donations.forEach((donation) => {
      const date = new Date(donation.donationDate);
      let key;

      if (period === "year") {
        key = date.toLocaleString("default", { month: "short" }); // Group by month
      } else if (period === "month") {
        key = date.getDate().toString(); // Group by day of the month
      } else if (period === "week") {
        const day = date.getDay(); // Get day of the week (0 = Sunday, 6 = Saturday)
        // Adjust to make Monday the first day (0 = Monday, 6 = Sunday)
        const adjustedDay = day === 0 ? 6 : day - 1; // Map Sunday (0) to 6, Monday (1) to 0, etc.
        key = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][adjustedDay]; // Map to day name
      }

      if (donation.quantityUnit === "kg") {
        grouped.kg[key] = (grouped.kg[key] || 0) + Number(donation.quantity);
      } else if (donation.quantityUnit === "unit") {
        grouped.unit[key] = (grouped.unit[key] || 0) + Number(donation.quantity);
      }
    });

    return grouped;
  };

  // Update chart when donations or filter changes
  useEffect(() => {
    if (donations.length > 0 && chartRef.current) {
      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Filter donations based on the selected time period
      const filteredDonations = filterDonationsByTimePeriod(donations, filter);

      // Group filtered donations by time period
      const groupedData = groupDonationsByTimePeriod(filteredDonations, filter);
      const labels = generateXAxisLabels(filter);

      const ctx = chartRef.current.getContext("2d");

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels, // Use dynamically generated labels
          datasets: [
            {
              label: "Quantity Donated (kg)",
              data: labels.map((label) => groupedData.kg[label] || 0), // Map labels to kg data
              borderColor: "rgba(255, 99, 132, 1)", // Pink color
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Quantity Donated (units)",
              data: labels.map((label) => groupedData.unit[label] || 0), // Map labels to unit data
              borderColor: "rgba(128, 128, 128, 1)", // Grey color
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [donations, filter]);

  return (
    <div className="dashboard-background">
    <div className="advanced-donor-dashboard">
      {/* Header */}
      <div className="header">
        <h1>Welcome, {user.name}!</h1>
        <p>Here's your donation activity overview</p>
      </div>

      {/* Donation Statistics */}
      <div className="statistics">
        {/* First Section: Top Row */}
        <div className="statistics-row">
          <div className="stat-card total-donations">
            <i className="fas fa-donate stat-icon"></i>
            <h2>Total Donations</h2>
            <p>{totalDonations}</p>
          </div>
          <div className="stat-card completed">
            <i className="fas fa-check-circle stat-icon"></i>
            <h2>Completed</h2>
            <p>{totalCompleted}</p>
          </div>
          <div className="stat-card pending">
            <i className="fas fa-clock stat-icon"></i>
            <h2>Pending</h2>
            <p>{totalPending}</p>
          </div>
          <div className="stat-card cancel">
            <i className="fas fa-cancel stat-icon"></i>
            <h2>Cancel</h2>
            <p>{totalCancel}</p>
          </div>
        </div>

        {/* Second Section: Bottom Row */}
        <div className="statistics-row">
          <div className="stat-card total-food">
            <i className="fas fa-utensils stat-icon"></i>
            <h2>Total Food Donated</h2>
            <div className="values">
              <span className="kg-value">{kgQuantity} kg</span>
              <span className="unit-value">
                {unitQuantity}
                units
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress blue"
                style={{ width: `${(kgQuantity / 100) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="stat-card people-helped">
            <i className="fas fa-users stat-icon"></i>
            <h2>People Helped</h2>
            <p>{Math.floor((kgQuantity + unitQuantity) / 2)}</p>
            <div className="progress-bar">
              <div
                className="progress green"
                style={{
                  width: `${(Math.floor((kgQuantity + unitQuantity) / 2) / 100) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="stat-card completion-rate">
            <i className="fas fa-chart-line stat-icon"></i>
            <h2>Completion Rate</h2>
            <p>{completionRate}%</p>
            <div className="progress-bar">
              <div
                className="progress green"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="button-section">
        <Link to="/myDonate">
          <button className="view-all-button">View All Donations</button>
        </Link>
        <Link to="/donate">
          <button className="create-new-button">Create New Donation</button>
        </Link>
      </div>

      {/* Recent Donations */}
      <div className="recent-donations">
        <h2>Recent Donations</h2>
        <table>
          <thead>
            <tr>
              <th>Donation Date</th>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations
              .slice(-5) // Show only the last 5 donations
              .map((donation, index) => (
                <tr key={index}>
                  <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                  <td>{donation.foodItem}</td>
                  <td>{donation.finalQuantity}</td>
                  <td>
                    <span className={`status status-${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Donation Trends Chart */}
      <div className="chart-section">
        <h2>Donation Trends</h2>
        {/* Filter Options */}
        <div className="filter-section">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* Donation Map */}
      <div className="map-section">
        <h2>Donation Locations</h2>
        <MapContainer
          center={[6.9271, 79.8612]} // Center of Sri Lanka
          zoom={7} // Zoom level to show the entire country
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geocodedDonations.map((donation) => (
            donation.latitude && donation.longitude && (
              <Marker
                key={donation._id}
                position={[donation.latitude, donation.longitude]}
              >
                <Popup>
                  <strong>{donation.foodItem}</strong>
                  <br />
                  {donation.quantity} {donation.quantityUnit}
                  <br />
                  {new Date(donation.donationDate).toLocaleDateString()}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
    </div>
  );
};

export default AdvancedDonorDashboard;