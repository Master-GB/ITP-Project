import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./dashboard.css";
import ChatBox from "../../../imalshaComponent/Chatbot/Chatbot";
import axios from "axios";

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
  const [filter, setFilter] = useState("month"); 
  const [geocodedDonations, setGeocodedDonations] = useState([]); 
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  
  const fetchDonation = async () => {
    return await axios.get("http://localhost:8090/donations/display")
    .then((res) => res.data)
    .catch(()=> console.log("Donation Not featching"));
  };

  useEffect(() => {
    fetchDonation().then((data) => setDonations(data.donations));
  }, []);

 
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

  
  const geocodeAddress = async (address) => {
    const apiKey = "da9f3136e71846d289f8da0f3e88c3f9"; 
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

  
  const generateXAxisLabels = (filter) => {
    const labels = [];
    if (filter === "year") {
      for (let i = 0; i < 12; i++) {
        const date = new Date(2023, i, 1); 
        labels.push(date.toLocaleString("default", { month: "short" }));
      }
    } else if (filter === "month") {
      for (let i = 1; i <= 31; i++) {
        labels.push(i.toString());
      }
    } else if (filter === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels.push(...days);
    }
    return labels;
  };

  
  const filterDonationsByTimePeriod = (donations, period) => {
    const now = new Date(); 
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeekStart = new Date(now); 
    currentWeekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); 

    return donations.filter((donation) => {
      const donationDate = new Date(donation.donationDate);

      if (period === "year") {
        return donationDate.getFullYear() === currentYear;
      } else if (period === "month") {
        return (
          donationDate.getFullYear() === currentYear &&
          donationDate.getMonth() === currentMonth
        );
      } else if (period === "week") {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6); 
        return donationDate >= currentWeekStart && donationDate <= weekEnd;
      }
      return true; 
    });
  };

  
  const groupDonationsByTimePeriod = (donations, period) => {
    const grouped = { kg: {}, unit: {} };

  
    const labels = generateXAxisLabels(period);
    labels.forEach((label) => {
      grouped.kg[label] = 0;
      grouped.unit[label] = 0;
    });

    donations.forEach((donation) => {
      const date = new Date(donation.donationDate);
      let key;

      if (period === "year") {
        key = date.toLocaleString("default", { month: "short" });
      } else if (period === "month") {
        key = date.getDate().toString(); 
      } else if (period === "week") {
        const day = date.getDay(); 
      
        const adjustedDay = day === 0 ? 6 : day - 1; 
        key = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][adjustedDay]; 
      }

      if (donation.quantityUnit === "kg") {
        grouped.kg[key] = (grouped.kg[key] || 0) + Number(donation.quantity);
      } else if (donation.quantityUnit === "unit") {
        grouped.unit[key] = (grouped.unit[key] || 0) + Number(donation.quantity);
      }
    });

    return grouped;
  };


  useEffect(() => {
    if (donations.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const filteredDonations = filterDonationsByTimePeriod(donations, filter);

      const groupedData = groupDonationsByTimePeriod(filteredDonations, filter);
      const labels = generateXAxisLabels(filter);

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels, 
          datasets: [
            {
              label: "Quantity Donated (kg)",
              data: labels.map((label) => groupedData.kg[label] || 0), 
              borderColor: "rgba(255, 99, 132, 1)", 
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Quantity Donated (units)",
              data: labels.map((label) => groupedData.unit[label] || 0), 
              borderColor: "rgba(128, 128, 128, 1)", 
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
    <div>
    <ChatBox />
    <div className="donor-dh-dashboard-background">
    <div className="donor-dh-advanced-donor-dashboard">
      <div className="donor-dh-header">
        <h1>Welcome, {user.name}!</h1>
        <p>Here's your donation activity overview</p>
      </div>

      <div className="donor-dh-statistics">
        <div className="donor-dh-statistics-row">
          <div className="donor-dh-stat-card donor-dh-total-donations">
            <i className="fas fa-donate donor-dh-stat-icon"></i>
            <h2>Total Donations</h2>
            <p>{totalDonations}</p>
          </div>
          <div className="donor-dh-stat-card donor-dh-completed">
            <i className="fas fa-check-circle donor-dh-stat-icon"></i>
            <h2>Completed</h2>
            <p>{totalCompleted}</p>
          </div>
          <div className="donor-dh-stat-card donor-dh-pending">
            <i className="fas fa-clock donor-dh-stat-icon"></i>
            <h2>Pending</h2>
            <p>{totalPending}</p>
          </div>
          <div className="donor-dh-stat-card donor-dh-cancel">
            <i className="fas fa-cancel donor-dh-stat-icon"></i>
            <h2>Cancel</h2>
            <p>{totalCancel}</p>
          </div>
        </div>

        <div className="donor-dh-statistics-row">
          <div className="donor-dh-stat-card donor-dh-total-food">
            <i className="fas fa-utensils donor-dh-stat-icon"></i>
            <h2>Total Food Donated</h2>
            <div className="donor-dh-values">
              <span className="donor-dh-kg-value">{kgQuantity} kg</span>
              <span className="donor-dh-unit-value">
                {unitQuantity} units</span>
            </div>
            <div className="donor-dh-progress-bar">
              <div
                className="donor-dh-progress g"
                style={{ width: `${(kgQuantity / 500) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="donor-dh-stat-card donor-dh-people-helped">
            <i className="fas fa-users donor-dh-stat-icon"></i>
            <h2>People Helped</h2>
            <p>{Math.floor((kgQuantity + unitQuantity) / 2)}</p>
            <div className="donor-dh-progress-bar">
              <div
                className="donor-dh-progress g"
                style={{
                  width: `${(Math.floor((kgQuantity + unitQuantity) / 2) / 500) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="donor-dh-stat-card donor-dh-completion-rate">
            <i className="fas fa-chart-line donor-dh-stat-icon"></i>
            <h2>Completion Rate</h2>
            <p>{completionRate}%</p>
            <div className="donor-dh-progress-bar">
              <div
                className="donor-dh-progress g"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="donor-dh-button-section">
        <Link to="/dl/myDonate">
          <button className="donor-dh-view-all-button">View All Donations</button>
        </Link>
        <Link to="/dl/donate">
          <button className="donor-dh-create-new-button">Create New Donation</button>
        </Link>
      </div>
      <div className="donor-dh-card donor-dh-recent-donations">
        <h2 >Recent Donations</h2>
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
              .slice(-5) 
              .map((donation, index) => (
                <tr key={index}>
                  <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                  <td>{donation.foodItem}</td>
                  <td>{donation.finalQuantity}</td>
                  <td>
                    <span className={`donor-dh-status donor-dh-status-${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="donor-dh-card donor-dh-chart-section">
      <div className="donor-dh-chart-header">Donation Trends</div>
        <div className="donor-dh-card-over">  
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 8 }}>
            <div className="donor-dh-filter-section donor-dh-filter-right">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="year">Year</option>
                <option value="month">Month</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      <div className="donor-dh-card donor-dh-map-section">
        <h2 className="donor-dh-map-header">Donation Locations</h2>
        <div className="donor-dh-card-over"> 
        <MapContainer
          center={[6.9271, 79.8612]} 
          zoom={7} 
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
    </div>
    </div>
  );
};

export default AdvancedDonorDashboard;