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
    if(totalDonation >= 1) newAchievements.push({id: 1, name: 'First Donation', icon: '🎖️', achieved: true});
    if(totalDonation >= 10) newAchievements.push({id: 2, name: '10 Donations', icon: '🌱', achieved: true});
    if(totalKg >= 50) newAchievements.push({id: 3, name: '50 kg Donated', icon: '🏅', achieved: true});
    if(totalUnit >= 50) newAchievements.push({id: 4, name: '50 Unit Donated', icon: '🏅', achieved: true});
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

  const generateDonationHistoryPDF = () => {
    const doc = new jsPDF();
    doc.text('Donation History Report', 105, 20, { align: 'center' });
    
    const headers = [['Date', 'Food Item', 'Quantity', 'Status']];
    const data = donations.map(d => [
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
      headStyles: { fillColor: [52, 152, 219] }
    });
    
    doc.save('donation_history.pdf');
  };

  const generateStatsPDF = () => {
    const statusCounts = donations.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});
    
    const doc = new jsPDF();
    doc.text('Donation Statistics Report', 105, 20, { align: 'center' });
    
    doc.text(`Total Donations: ${donations.length}`, 20, 40);
    doc.text(`Completed: ${statusCounts.Completed || 0}`, 20, 50);
    doc.text(`Pending: ${statusCounts.Pending || 0}`, 20, 60);
    doc.text(`Canceled: ${statusCounts.Canceled || 0}`, 20, 70);
    doc.text(`In Delivery: ${statusCounts.Delivery || 0}`, 20, 80);
    doc.text(`Packaging: ${statusCounts.Packaging || 0}`, 20, 90);
    
    doc.save('donation_stats.pdf');
  };

  const shareUrl = window.location.href;
  const shareTitle = "Check out my donation achievements!";
  const shareBody = "I've been helping my community through food donations. See my impact!";

  return (
    <div className='monitor-background'>
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
        <button onClick={generateDonationHistoryPDF} className="pdf-button">
          Download Donation History
        </button>
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
          
          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={["FoodDonation", "CommunityHelp"]}
            className="social-button"
          >
            <TwitterIcon size={40} round />
            <span>Twitter</span>
          </TwitterShareButton>
          
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

          <EmailShareButton
            subject={shareTitle}
            body={shareBody}
            url={shareUrl}
            className="social-button"
          >
            <EmailIcon size={40} round />
            <span>Email</span>
          </EmailShareButton>
        </div>
      </section>
    </div>
    </div>
  );
};

export default DonorAnalyticsDashboard;