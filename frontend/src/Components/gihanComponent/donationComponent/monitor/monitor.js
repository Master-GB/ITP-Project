import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  FacebookIcon, 
  TwitterIcon, 
  LinkedinIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';
import axios from 'axios';
import './monitor.css';

const DonorAnalyticsDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [groupCategory, setGroupCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('month');
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8090/donations/display');
        setDonations(response.data.donations);
        calculateMilestones(response.data.donations);
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };
    fetchDonations();
  }, []);

  const calculateMilestones = (donations) => {
    const totalDonation = donations.length;
    let totalKg = 0;
    let totalUnit = 0;
    
    donations.forEach(donation => {
      if(donation.quantityUnit === "kg"){
        totalKg += Number(donation.quantity);
      }
      else if(donation.quantityUnit === "unit"){
        totalUnit += Number(donation.quantity);
      }
    });

    const newAchievements = [];
    if(totalDonation >= 1) newAchievements.push({id: 1, name: 'First Donation', icon: '🥇', achieved: true});
    if(totalDonation >= 10) newAchievements.push({id: 2, name: '10 Donations', icon: '🥈', achieved: true});
    if(totalKg >= 50) newAchievements.push({id: 3, name: '50 kg Donated', icon: '🏅', achieved: true});
    if(totalUnit >= 20) newAchievements.push({id: 4, name: '20 Unit Donated', icon: '✨', achieved: true});
    if(totalDonation >= 100) newAchievements.push({id: 5, name: 'Top Donor', icon: '🎉', achieved: true});

    setMilestones(newAchievements);
  };

  const getCategoryData = () => {
    const categoryCounts = {};
    
    donations.forEach(donation => {
      const category = donation.foodCategory || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC24A', '#FF5722'
        ]
      }]
    };
  };

  const generateXAxisLabels = (filter) => {
    const labels = [];
    if (filter === "year") {
      for (let i = 0; i < 12; i++) {
        const date = new Date(2023, i, 1);
        labels.push(date.toLocaleString("default", { month: "short" }));
      }
    } else if (filter === "month") {
      for (let i = 1; i <= 31; i++) labels.push(i.toString());
    } else if (filter === "week") {
      labels.push(...["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
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
      if (period === "year") return donationDate.getFullYear() === currentYear;
      if (period === "month") return donationDate.getFullYear() === currentYear && donationDate.getMonth() === currentMonth;
      if (period === "week") {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);
        return donationDate >= currentWeekStart && donationDate <= weekEnd;
      }
      return true;
    });
  };

  const getTimeSeriesData = () => {
    const filteredDonations = filterDonationsByTimePeriod(donations, filter);
    const labels = generateXAxisLabels(filter);
    const data = new Array(labels.length).fill(0);
  
    filteredDonations.forEach(donation => {
      const date = new Date(donation.donationDate);
      let index;
      
      if (filter === "year") {
        index = date.getMonth();
      } else if (filter === "month") {
        index = date.getDate() - 1;
      } else if (filter === "week") {
        index = (date.getDay() + 6) % 7;
      }
  
      if (index >= 0 && index < labels.length) {
        data[index] += 1;
      }
    });
  
    return {
      labels,
      datasets: [{
        label: 'Number of Donations',
        data,
        backgroundColor: '#36A2EB',
        borderRadius: 4
      }]
    };
  };

  useEffect(() => {
    if (donations.length > 0 && pieChartRef.current) {
      if (pieChartInstance) pieChartInstance.destroy();
      
      const pieCtx = pieChartRef.current.getContext('2d');
      const newPieChart = new Chart(pieCtx, {
        type: 'pie',
        data: getCategoryData(),
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
      setPieChartInstance(newPieChart);
    }

    return () => {
      if (pieChartInstance) pieChartInstance.destroy();
    };
  }, [donations]);

  useEffect(() => {
    if (donations.length > 0 && barChartRef.current) {
      if (barChartInstance) barChartInstance.destroy();
      
      const barCtx = barChartRef.current.getContext('2d');
      const newBarChart = new Chart(barCtx, {
        type: 'bar',
        data: getTimeSeriesData(),
        options: {
          responsive: true,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Donations'
              }
            },
            x: {
              title: {
                display: true,
                text: filter === 'year' ? 'Months' : filter === 'month' ? 'Days' : 'Days of Week'
              }
            }
          }
        }
      });
      setBarChartInstance(newBarChart);
    }

    return () => {
      if (barChartInstance) barChartInstance.destroy();
    };
  }, [donations, filter]);


const generateDonationHistoryPDF = (filteredDonations) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('Donation History Report', 105, 20, { align: 'center' });
  const headers = [['Date', 'Food Item', 'Quantity', 'Status']];
  const data = filteredDonations.map(d => [
    new Date(d.donationDate).toLocaleDateString(),
    d.foodItem,
    `${d.quantity} ${d.quantityUnit}`,
    d.status,
  ]);
  doc.autoTable({
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [52, 152, 219] },
    tableLineColor: [52, 152, 219],
    tableLineWidth: 0.2
  });

  doc.setFontSize(10);
  doc.setTextColor(150);
  
  const tableY = doc.lastAutoTable.finalY || 130;
  doc.text('Generated by Food Donation Platform', 105, tableY + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100);
  const date = new Date();
  const dateString = date.toLocaleString();
  doc.text(`Report generated: ${dateString}`, 105, tableY + 14, { align: 'center' });
  doc.save('donation_history.pdf');
};


const handleExportPDF = () => {
  let filtered = donations;
  if (filterStatus !== 'All') {
    filtered = filtered.filter(d => d.status === filterStatus);
  }
  if (groupCategory !== 'All') {
    filtered = filtered.filter(d => (d.foodCategory || 'Uncategorized') === groupCategory);
  }
  if (startDate) {
    filtered = filtered.filter(d => new Date(d.donationDate) >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter(d => new Date(d.donationDate) <= new Date(endDate));
  }
  setDialogOpen(false);
  generateDonationHistoryPDF(filtered);
  setFilterStatus('All');
  setGroupCategory('All');
  setStartDate('');
  setEndDate('');
};

const generateStatsPDF = async () => {

  const statusCounts = donations.reduce((acc, d) => {
    const status = (d.status || '').toLowerCase();
    if (status === 'completed') acc.Completed = (acc.Completed || 0) + 1;
    else if (status === 'pending') acc.Pending = (acc.Pending || 0) + 1;
    else if (status === 'cancel') acc.Canceled = (acc.Canceled || 0) + 1;
    else if (status === 'delivery' || status === 'in delivery') acc.Delivery = (acc.Delivery || 0) + 1;
    else if (status === 'packaging') acc.Packaging = (acc.Packaging || 0) + 1;
    else if (status === 'collected') acc.Collected = (acc.Collected || 0) + 1;
    else acc.Other = (acc.Other || 0) + 1;
    return acc;
  }, {});
  const doc = new jsPDF();

 
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); 
  doc.text('Donation Statistics Report', 105, 20, { align: 'center' });

  doc.setDrawColor(52, 152, 219);
  doc.setFillColor(236, 245, 252);
  doc.roundedRect(15, 28, 180, 18, 4, 4, 'FD');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total Donations: ${donations.length}`, 25, 40);


  const tableBody = [
    ['Completed', statusCounts.Completed || 0],
    ['Pending', statusCounts.Pending || 0],
    ['Canceled', statusCounts.Canceled || 0],
    ['In Delivery', statusCounts.Delivery || 0],
    ['Packaging', statusCounts.Packaging || 0],
    ['Collected', statusCounts.Collected || 0],
  ];
  doc.autoTable({
    head: [['Status', 'Count']],
    body: tableBody,
    startY: 55,
    theme: 'grid',
    styles: { fillColor: [255,255,255], textColor: [44, 62, 80], fontSize: 11 },
    headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [236, 245, 252] },
    margin: { left: 25, right: 25 },
    tableLineColor: [52, 152, 219],
    tableLineWidth: 0.2,
  });


  const pieData = getCategoryData();
  const pieCanvas = document.createElement('canvas');
  pieCanvas.width = 500;
  pieCanvas.height = 400;
  const pieCtx = pieCanvas.getContext('2d');
  await new Promise(resolve => {
    new Chart(pieCtx, {
      type: 'pie',
      data: pieData,
      options: {
        plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 15 } } } },
        animation: false,
        responsive: false,
        events: []
      },
      plugins: [{ afterRender: resolve }]
    });
    setTimeout(resolve, 500);
  });
  const pieImg = pieCanvas.toDataURL('image/png');

  const barData = getTimeSeriesData();
  const barCanvas = document.createElement('canvas');
  barCanvas.width = 500;
  barCanvas.height = 400;
  const barCtx = barCanvas.getContext('2d');
  await new Promise(resolve => {
    new Chart(barCtx, {
      type: 'bar',
      data: barData,
      options: {
        plugins: { legend: { display: false } },
        animation: false,
        responsive: false,
        events: [],
        scales: { x: { ticks: { font: { size: 15 } } }, y: { ticks: { font: { size: 15 } } } }
      },
      plugins: [{ afterRender: resolve }]
    });
    setTimeout(resolve, 500);
  });
  const barImg = barCanvas.toDataURL('image/png');


  doc.addPage();

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Category Breakdown', 105, 20, { align: 'center' });
  doc.addImage(pieImg, 'PNG', 35, 30, 150, 110);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Donation Trends', 105, 160, { align: 'center' });
  doc.addImage(barImg, 'PNG', 25, 170, 170, 90);


  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Generated by Food Donation Platform', 105, 270, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100);
  const date = new Date();
  const dateString = date.toLocaleString();
  doc.text(`Report generated: ${dateString}`, 105, 274, { align: 'center' });

  doc.save('donation_stats.pdf');
};

  const shareUrl = window.location.href;
  const shareTitle = "Check out my donation achievements!";
  const shareBody = "I've been helping my community through food donations. See my impact!";

  return (
    <div className='monitor-background'>
      <div className="donor-donation-my-donation-header">
        <div className="donor-donation-my-donation-header-row">
          <div className="donor-donation-my-donation-avatar">📈</div>
          <h1 className="donor-donation-my-donation-title">Donation Analytics</h1>
        </div>
        <div className="donor-donation-my-donation-tagline">Visualize and track your donation impact</div>
      </div>
    <div className="donor-analytics-dashboard">
      <section className="milestones-section">
        <h2>🏆Achievements</h2>
        {milestones.length > 0 ? (
          <div className="milestones-grid">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-card achieved">
                <span className="milestone-icon">{milestone.icon}</span>
                <h3>{milestone.name}</h3>
                <p>Achieved!</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No milestones achieved yet. Keep donating to unlock achievements!</p>
        )}
      </section>

      <section className="chart-section">
        <h3>🍽️ Category Breakdown</h3>
        <div className="chart-container">
          <canvas ref={pieChartRef}></canvas>
        </div>
      </section>

      <section className="chart-section">
        <div className="chart-header">
          <h3>📊 Donation Trends</h3>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
        <div className="chart-container">
          <canvas ref={barChartRef}></canvas>
        </div>
      </section>

      <section className="pdf-buttons">
        <button onClick={() => setDialogOpen(true)} className="pdf-button">
  Download Donation History
</button>

      
        {dialogOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Configure Donation History Report</h2>
              <div className="modal-section">
                <label>Status:</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Delivery">In Delivery</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>
              <div className="modal-section">
                <label>Group by Category:</label>
                <select value={groupCategory} onChange={e => setGroupCategory(e.target.value)}>
                  <option value="All">All</option>
                  {Array.from(new Set(donations.map(d => d.foodCategory || 'Uncategorized'))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="modal-section">
                <label>Date Range:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ fontSize: '0.95em', marginBottom: '2px', color: '#666' }}>Start Date</label>
                    <input className="startEnd-date-m" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <span style={{margin: '0 8px', fontWeight: 'bold', color: '#888', alignSelf: 'center', lineHeight: '2.2'}}>-</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ fontSize: '0.95em', marginBottom: '2px', color: '#666' }}>End Date</label>
                    <input className="startEnd-date-m" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => {
                  setDialogOpen(false);
                  setFilterStatus('All');
                  setGroupCategory('All');
                  setStartDate('');
                  setEndDate('');
                }} className="modal-cancel" style={{ flex: 1, marginRight: '10px' }}>
                  <span className="button-icon">✖️</span>
                  Cancel
                </button>
                <button onClick={handleExportPDF} className="modal-export" style={{ flex: 1, marginLeft: '10px' }}>
                  <span className="button-icon">📤</span>
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
        <button onClick={generateStatsPDF} className="pdf-button">
  Download Statistics Report
</button>
      </section>

      <section className="social-sharing">
        <h3>Share Your Achievements</h3>
        <p>Inspire others by sharing your impact</p>
        <div className="social-buttons">
          <FacebookShareButton 
            url={shareUrl}
            quote={shareTitle}
            hashtag="#FoodDonation"
            className="social-button"
          >
            <FacebookIcon size={40} round />
            <span>Facebook</span>
          </FacebookShareButton>
          
          {/* X (formerly Twitter) share button */}
          <a
            href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            style={{ textDecoration: 'none' }}
          >
            {/* SVG X icon */}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: '#000', color: '#fff', fontSize: 26 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="16" fill="#000"/>
                <path d="M10 10L22 22M22 10L10 22" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            <span>X</span>
          </a>
          
          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareBody}
            source="Food Donation App"
            className="social-button"
          >
            <LinkedinIcon size={40} round />
            <span>LinkedIn</span>
          </LinkedinShareButton>

          {/* Instagram button (opens Instagram profile or home) */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-button"
            style={{ textDecoration: 'none' }}
          >
            {/* SVG Instagram icon */}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', color: '#fff', fontSize: 26 }}>
              <svg width="26" height="26" viewBox="0 0 448 448" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="448" height="448" rx="224" fill="url(#ig-gradient)"/>
                <defs>
                  <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%" fx="30%" fy="107%">
                    <stop offset="0%" stop-color="#fdf497"/>
                    <stop offset="5%" stop-color="#fdf497"/>
                    <stop offset="45%" stop-color="#fd5949"/>
                    <stop offset="60%" stop-color="#d6249f"/>
                    <stop offset="90%" stop-color="#285AEB"/>
                  </radialGradient>
                </defs>
                <path d="M224 144c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm88-80c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16-16-7.2-16-16zm48-32c-1.7-35.3-9.9-66.7-36.1-92.9C338.7 41.9 307.3 33.7 272 32c-35.3-1.7-141.3-1.7-176.6 0C70.7 33.7 39.3 41.9 13.1 68.1-13.1 94.3-21.3 125.7-23 161c-1.7 35.3-1.7 141.3 0 176.6 1.7 35.3 9.9 66.7 36.1 92.9 26.2 26.2 57.6 34.4 92.9 36.1 35.3 1.7 141.3 1.7 176.6 0 35.3-1.7 66.7-9.9 92.9-36.1 26.2-26.2 34.4-57.6 36.1-92.9 1.7-35.3 1.7-141.3 0-176.6zm-48 218c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.7 9s-103.3 2.6-132.7-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.7s-2.6-103.3 9-132.7c7.8-19.6 22.9-34.7 42.5-42.5C118.7 41.9 188.5 44.5 222 44.5s103.3-2.6 132.7 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.7s2.6 103.3-9 132.7z" fill="#fff"/>
              </svg>
            </span>
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </div>
    </div>
  );
};

export default DonorAnalyticsDashboard;