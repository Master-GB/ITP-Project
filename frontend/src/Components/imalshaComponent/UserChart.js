import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import './UserChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Users',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Poppins', sans-serif"
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'User Distribution Overview',
        font: {
          size: 18,
          family: "'Poppins', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          stepSize: 1,
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/users');
        const users = response.data.users;

        // Count users by role
        const roleCounts = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(roleCounts);
        const data = Object.values(roleCounts);
        const totalUsers = users.length;

        // Modern color palette
        const colors = {
          background: [
            'rgba(54, 162, 235, 0.7)',  // Blue
            'rgba(255, 99, 132, 0.7)',  // Pink
            'rgba(75, 192, 192, 0.7)',  // Teal
            'rgba(255, 206, 86, 0.7)',  // Yellow
            'rgba(153, 102, 255, 0.7)', // Purple
            'rgba(255, 159, 64, 0.7)',  // Orange
          ],
          border: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ]
        };

        setChartData({
          labels: ['Total Users', ...labels],
          datasets: [
            {
              label: 'Number of Users',
              data: [totalUsers, ...data],
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 2,
              borderRadius: 5,
              barThickness: 40,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setChartData({
          labels: ['Total Users'],
          datasets: [
            {
              label: 'Number of Users',
              data: [0],
              backgroundColor: ['rgba(54, 162, 235, 0.7)'],
              borderColor: ['rgba(54, 162, 235, 1)'],
              borderWidth: 2,
              borderRadius: 5,
            },
          ],
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UserChart; 